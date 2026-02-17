// ===============================
// 🔐 YOUTUBE API KEY
// ===============================
const API_KEY = "AIzaSyAvdxsDafd2PzYeSZORv6JKRvXxg2m4NxQ";


// ===============================
// 📂 LOAD MOVIE DATA FROM JSON
// ===============================
fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {

    let params = new URLSearchParams(window.location.search);
    let movieId = params.get("id");

    let movie = data[movieId];

    if(!movie){
      document.getElementById("movieDetails").innerHTML =
        "<h2 style='color:white;text-align:center'>Movie Not Found</h2>";
      return;
    }

    // ===============================
    // ▶ CREATE PLAYER BUTTONS
    // ===============================
    let playersHTML = "";
    if(movie.players && movie.players.length > 0){
      movie.players.forEach(player => {
        playersHTML += `<button class="btn btn-player" onclick="loadPlayer('${player.link}')">${player.name}</button>`;
      });

      playersHTML += `<button class="btn btn-download" onclick="downloadMovie('${movie.players[0].link}')">Download</button>`;
    }


    // ===============================
    // 🔗 SHARE LINKS
    // ===============================
    let shareURL = `https://cinemaxlk.vercel.app/api/og?id=${movieId}&title=${encodeURIComponent(movie.title)}&image=${encodeURIComponent(movie.image)}`;
    shareURL = encodeURIComponent(shareURL);

    let currentURL = encodeURIComponent(window.location.href);

    let socialHTML = `
      <div style="margin-top:20px; display:flex; gap:12px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="35">
        </a>

        <a href="https://wa.me/?text=${shareURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/whatsapp.png" width="35">
        </a>

        <a href="https://twitter.com/intent/tweet?url=${currentURL}&text=Watch ${encodeURIComponent(movie.title)}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="35">
        </a>
      </div>
    `;


    // ===============================
    // 🎥 GET TRAILER
    // ===============================
    getTrailer(movie.title).then(trailerId => {

      let trailerURL = trailerId
      ? `https://www.youtube.com/embed/${trailerId}?rel=0&modestbranding=1`
      : "";

      document.getElementById("movieDetails").innerHTML = `
        <div style="max-width:1000px;margin:auto;padding:20px;color:white;font-family:Poppins,sans-serif;">

          <div id="trailerContainer" style="width:100%; text-align:center; margin-bottom:20px;">
            ${ trailerURL ? `
              <iframe src="${trailerURL}" width="100%" height="450" allowfullscreen style="border-radius:12px;"></iframe>
            ` : `
              <img src="${movie.image}" style="width:100%;max-height:500px;object-fit:cover;border-radius:12px;">
            `}
          </div>

          <h2>${movie.title}</h2>
          <p>${movie.description}</p>

          <div style="display:flex;gap:25px;margin-top:30px;flex-wrap:wrap;">
            <div>
              <img src="${movie.image}" style="width:220px;border-radius:12px;">
              <div>
                IMDb: ${getStars(movie.imdb)} (${movie.imdb}/10)
              </div>
            </div>

            <div>
              <p>📅 Release Date: ${movie.release_date}</p>
              <p>🎬 Director: ${movie.director}</p>
              <p>⏳ Runtime: ${movie.runtime}</p>
              <p>🎭 Genre: ${movie.genre}</p>
            </div>
          </div>

          <div style="margin-top:20px;">
            ${playersHTML}
          </div>

          ${socialHTML}

          <div id="videoPlayer" style="margin-top:20px;"></div>

          <div class="comment-section">
            <h3>Comments</h3>

            <form class="commentForm">
              <input type="text" name="name" placeholder="Display Name" required>
              <input type="email" name="email" placeholder="Email Address" required>
              <textarea name="message" placeholder="Write a comment..." required></textarea>

              <input type="hidden" name="movie" value="${movie.title}">
              <button type="submit">Post comment</button>
            </form>

            <p class="successMsg">✅ Comment sent successfully!</p>
          </div>
        </div>
      `;


      // ===============================
      // COMMENT SUBMIT
      // ===============================
      const form = document.querySelector(".commentForm");
      const successMsg = document.querySelector(".successMsg");
      const submitBtn = form.querySelector("button");

      form.addEventListener("submit", function(e){

        e.preventDefault();
        submitBtn.style.display="none";

        const formData = new FormData(this);

        fetch("https://formsubmit.co/ajax/boyae399@gmail.com",{
          method:"POST",
          body:formData
        })
        .then(()=> {
          successMsg.style.display="block";
          form.reset();
        });
      });

    });

  });


// ===============================
// ▶ LOAD PLAYER
// ===============================
function loadPlayer(link){

  let embedLink = link.replace("/view","/preview");

  const commentDiv = document.querySelector(".comment-section");
  if(commentDiv) commentDiv.classList.add("hidden");

  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="450" allowfullscreen style="border-radius:12px;border:none;"></iframe>
  `;
}


// ===============================
// ⬇ DOWNLOAD
// ===============================
function downloadMovie(link){
  window.open(link.replace("/preview","/view"),"_blank");
}


// ===============================
// ⭐ IMDB STARS
// ===============================
function getStars(rating){

  rating=parseFloat(rating);

  let full=Math.floor(rating/2);
  let half=rating%2>=1;
  let empty=5-full-(half?1:0);

  let stars="";

  for(let i=0;i<full;i++) stars+="⭐";
  if(half) stars+="✨";
  for(let i=0;i<empty;i++) stars+="☆";

  return stars;
}


// ===============================
// 🎥 FIXED YOUTUBE TRAILER FETCH
// ===============================
async function getTrailer(movieName){

  try{

    let query = encodeURIComponent(movieName + " official trailer");

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${query}&key=${API_KEY}`;

    let res = await fetch(url);

    if(!res.ok) throw new Error("API failed");

    let data = await res.json();

    if(!data.items || data.items.length===0) return "";

    let video = data.items.find(v =>
      v.snippet.title.toLowerCase().includes("trailer")
    );

    return video ? video.id.videoId : data.items[0].id.videoId;

  }catch(e){
    console.log("Trailer Error:",e);
    return "";
  }
}


// ===============================
// 🔁 REDIRECT TO AD PAGE
// ===============================
function goAdPage(link){

  let params=new URLSearchParams(window.location.search);
  let movieId=params.get("id");

  window.location.href=
  "adpage.html?id="+movieId+"&play="+encodeURIComponent(link);
}
