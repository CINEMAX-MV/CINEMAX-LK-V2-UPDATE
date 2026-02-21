
// ===============================
// 🔐 YOUTUBE API KEY
// ===============================
const API_KEY = "AIzaSyBPPhDhVem-bSzZjGIlysFfnAax9bKQ2aM"; // Your API Key

// ===============================
// 📂 LOAD MOVIE DATA FROM JSON
// ===============================
fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {

    // ===============================
    // 🎯 GET MOVIE ID FROM URL
    // ===============================
    let params = new URLSearchParams(window.location.search);
    let movieId = params.get("id");

    let movie = data[movieId];

    // ===============================
    // ❌ IF MOVIE NOT FOUND
    // ===============================
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
      // 🔹 FIX: loadPlayer → goAdPage
      movie.players.forEach(player => {
        playersHTML += `<button class="btn btn-player" onclick="goAdPage('${player.link}')">${player.name}</button>`;
      });

      // ✅ Download direct (No adpage)
      // ✅ Download direct (No adpage)
      playersHTML += `<button class="btn btn-download" onclick="downloadMovie('${movie.players[0].link}')">Download</button>`;
    }
    // ===============================
    // 🔗 ENCODE FULL URL FOR WHATSAPP
    // ===============================
    let shareURL = `https://cinemaxlk.vercel.app/api/og?id=${movieId}&title=${encodeURIComponent(movie.title)}&image=${encodeURIComponent(movie.image)}`;
    shareURL = encodeURIComponent(shareURL);

   
    // ===============================
    // 🌐 SOCIAL SHARE URL (CURRENT PAGE)
    // ===============================
    let currentURL = encodeURIComponent(window.location.href);
    let socialHTML = `
      <div style="margin-top:20px; display:flex; gap:12px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="35" title="Share on Facebook">
        </a>
        <a href="https://wa.me/94772461954?text=${encodeURIComponent('.gdrive or .download ' + movie.players[0].link)}" target="_blank">
  <img src="https://img.icons8.com/color/48/000000/whatsapp.png" width="35" title="Download via WhatsApp Bot">
        </a>
        <a href="https://twitter.com/intent/tweet?url=${currentURL}&text=Watch ${encodeURIComponent(movie.title)}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="35" title="Share on Twitter">
        </a>
         <a href="https://wa.me/?text=${shareURL}" target="_blank">
  <img src="https://img.icons8.com/color/48/000000/forward-arrow.png" 
       width="35" 
       title="Share on WhatsApp">
        </a>
      </div>
    `;
   
    // ===============================
    // 🎥 GET TRAILER FROM YOUTUBE
    // ===============================
    getTrailer(movie.title).then(trailerId => {
      let trailerURL = trailerId ? `https://www.youtube.com/embed/${trailerId}?rel=0` : "";

      // ===============================
      // 🖼 RENDER MOVIE DETAILS + COMMENT SECTION
      // ===============================
      document.getElementById("movieDetails").innerHTML = `
        <div style="max-width:1000px;margin:auto;padding:20px;color:white;font-family:Poppins,sans-serif;">

          <!-- TRAILER / BIG SCREEN -->
          <div id="trailerContainer" style="width:100%; text-align:center; margin-bottom:20px;">
            ${ trailerURL ? `
              <iframe src="${trailerURL}" width="100%" height="450" allowfullscreen style="border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);"></iframe>
            ` : `
              <img src="${movie.image}" style="width:100%;max-height:500px;object-fit:cover;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.3);">
            `}
          </div>

          <!-- DESCRIPTION -->
          <div style="margin-top:20px;">
            <h2 style="font-size:2.5em;margin-bottom:15px;background:linear-gradient(90deg,#ff8c00,#ff2a68);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;">
              ${movie.title}
            </h2>
            <p style="font-size:1.1em;line-height:1.8;color:#ddd;">
              ${movie.description}
            </p>
          </div>

          <!-- SMALL POSTER + RATING + DETAILS -->
          <div style="display:flex;gap:25px;margin-top:30px;flex-wrap:wrap;">
            <div style="flex:1;min-width:250px;">
              <img src="${movie.image}" style="width:100%;max-width:250px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
              <div style="margin-top:10px;font-size:1.2em;">
                <strong>IMDb:</strong> 
                <span style="color:#ffcc00;">${getStars(movie.imdb)}</span>
                <span style="color:#aaa;">(${movie.imdb}/10)</span>
              </div>
            </div>

            <div style="flex:2;min-width:300px;line-height:1.8;">
              <p>📅 <strong>Release Date:</strong> ${movie.release_date}</p>
              <p>🎬 <strong>Director:</strong> ${movie.director}</p>
              <p>⏳ <strong>Runtime:</strong> ${movie.runtime}</p>
              <p>🎭 <strong>Genre:</strong> ${movie.genre}</p>
            </div>
          </div>

          <!-- PLAYERS -->
          <div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:12px;">
            ${playersHTML}
          </div>

          <!-- SOCIAL SHARE -->
          ${socialHTML}

          <!-- VIDEO PLAYER -->
          <div id="videoPlayer" style="margin-top:20px;"></div>

          <!-- COMMENT SECTION -->
          <div class="comment-section">
            <h3>Comments</h3>
            <form class="commentForm">
              <div class="input-group">
                <label>Name:</label>
                <input type="text" name="name" placeholder="Display Name" required>
              </div>
              <div class="input-group">
                <label>Email:</label>
                <input type="email" name="email" placeholder="Email Address" required>
              </div>
              <div class="input-group">
                <label>Comment:</label>
                <textarea name="message" placeholder="Write a comment..." required></textarea>
              </div>

              <input type="hidden" name="movie" value="${movie.title}">
              <input type="hidden" name="_subject" value="New Movie Comment - Cinemax LK">
              <input type="hidden" name="_captcha" value="false">
              <input type="hidden" name="_template" value="box">
              <input type="text" name="_honey" style="display:none">

              <button type="submit">Post comment</button>
            </form>
            <p class="successMsg">✅ Comment sent successfully!</p>
          </div>

        </div>
<!-- =============================== -->
<!-- 📢 COMMENT BOX ANNOUNCEMENT -->
<!-- =============================== -->

<div id="commentAnnouncement" style="
    margin-top:20px;
    padding:18px 20px;
    font-family:Poppins, sans-serif;
    background:rgba(0,0,0,0.75);
    border-left:5px solid #FF0000;
    border-radius:12px;
    max-width:100%;
    box-sizing:border-box;
    box-shadow:0 10px 30px rgba(0,0,0,0.6);
">

  <!-- 🔥 TITLE -->
  <div style="
      font-size:1.3em;
      font-weight:900;
      margin-bottom:12px;
      letter-spacing:2px;
  ">
    📢 <span class="red-animate">ANNOUNCEMENT</span>
  </div>

  <!-- 🔥 BODY -->
  <div style="
      font-weight:600;
      font-size:0.95em;
      line-height:1.6em;
      color:#FFD700;
  ">
    මෙම සිංහල චිත්‍රපටය ඔබට පහසුවෙන්ම 
    <span class="rainbow">WHATSAPP PACKAGE</span> 
    ඔස්සේ බාගත කිරීමට ඉහත දී ඇති 
    <span class="rainbow">@WHATSAPP SOCIAL MEDIA ICON</span> 
    එක භාවිතා කරන්න. 

    මෙහිදී ඔබට 
    <span class="rainbow">.Gdrive</span> & 
    <span class="rainbow">.Download</span> 
    යනුවෙන් දිස්වෙන අතර  <span class="rainbow">Google drive</span> ලින්ක් එකක් නොවේ නම් එය කපා හැර 
    <span class="rainbow">.download</span> 
    යන මුරපදය පමණක් භාවිතා කරන්න. 

    මෙම වෙබ් අඩවිය ඔස්සේ ලබා ගන්නා ෆිල්ම්ස් හැර අනෙකුත් දේ ලබා ගැනීමට 
    <span class="rainbow">WA - USER BOT</span> 
    යොදා ගැනීම ඔබගෙ අනන්‍යතාවයට හානිදායක වනු ඇත. කිසියම් චිත්‍රපටයක් වට්සැප් ඔස්සෙ බාගත කිරීමට නොහැකිනම් නැවත උත්සාහ කරන්න. මෙය සිදුවන්නෙ වට්සැප් බොට් <span class="rainbow">OVER LIMIT</span> වන බැවිනි .
  </div>

</div>

<style>
/* 🔴 RED TITLE ANIMATION */
.red-animate{
  color:#ff0000;
  text-shadow:0 0 5px #ff0000, 0 0 15px #ff0000, 0 0 25px #e50914;
  animation:redPulse 1.5s infinite alternate;
}

@keyframes redPulse{
  from{
    opacity:0.6;
    transform:scale(1);
    text-shadow:0 0 5px #ff0000, 0 0 10px #ff0000;
  }
  to{
    opacity:1;
    transform:scale(1.05);
    text-shadow:0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 40px #e50914;
  }
}

/* 🌈 Rainbow for English Words */
.rainbow{
  background:linear-gradient(
    90deg,
    #ff0000,
    #ff8c00,
    #ffd700,
    #00ff00,
    #00c3ff,
    #8a2be2,
    #ff1493
  );
  background-size:400%;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:rainbowMove 6s linear infinite;
  font-weight:700;
}

@keyframes rainbowMove{
  0%{background-position:0%}
  100%{background-position:400%}
}
</style>
        <!-- =============================== -->
        <!-- 💎 STYLES -->
        <!-- =============================== -->
        <style>
          .btn{
            padding:10px 20px;
            border:none;
            border-radius:8px;
            background:linear-gradient(45deg,#ff8c00,#ff2a68);
            color:white;
            cursor:pointer;
            font-weight:bold;
            transition:0.3s;
          }
          .btn:hover{transform:scale(1.05);}
          .btn-download{background:linear-gradient(45deg,#4caf50,#2e7d32);}

          .comment-section{
            margin-top:30px;
            padding:20px;
            background:#111;
            border-radius:12px;
            max-width:500px;
          }
          .comment-section.hidden{ display:none !important; }
          .comment-section h3{
            color:#fff;
            font-size:1.3em;
            margin-bottom:10px;
            text-align:left;
          }
          .input-group{ margin-bottom:5mm; }
          .comment-section label{
            display:block;
            margin-bottom:2px;
            color:#fff;
            font-weight:bold;
            font-size:0.85em;
          }
          .comment-section input,
          .comment-section textarea{
            width:100%;
            padding:8px;
            background:#1a1a1a;
            border:1px solid #333;
            border-radius:6px;
            color:white;
            font-size:0.9em;
            font-weight:bold;
            box-sizing:border-box;
          }
          .comment-section textarea{
            resize:none;
            height:100px;
          }
          .comment-section button{
            padding:6px 15px;
            border:none;
            border-radius:15px;
            background:linear-gradient(45deg,#ff0040,#ff2a68);
            color:white;
            cursor:pointer;
            font-size:0.9em;
            float:left;
            margin-top:5px;
          }
          .comment-section button:hover{ transform:scale(1.05); }
          .successMsg{
            display:none;
            margin-top:6px;
            color:#00ff99;
            font-size:0.85em;
          }
        </style>
      `;

      // ===============================
      // 📩 SEND COMMENT
      // ===============================
      const form = document.querySelector(".commentForm");
      const successMsg = document.querySelector(".successMsg");
      const submitBtn = form.querySelector("button[type='submit']");

      form.addEventListener("submit", function(e){
        e.preventDefault();
        submitBtn.style.display = "none"; // hide post button

        const formData = new FormData(this);
        fetch("https://formsubmit.co/ajax/boyae399@gmail.com", {
          method: "POST",
          body: formData
        })
        .then(res => res.json())
        .then(() => {
          successMsg.style.display = "block"; // show success
          form.reset();
        });
      });

      // ✅ AUTO PLAY AFTER RETURN FROM ADPAGE
      let autoPlayLink = params.get("autoplay");
      if(autoPlayLink){
        loadPlayer(autoPlayLink);
      }

    });

  });

// ===============================
// ⬇ LOAD PLAYER
// ===============================
function loadPlayer(link){
  let embedLink = link.replace("/view","/preview");

  // Hide comment section when video plays
  const commentDiv = document.querySelector(".comment-section");
  if(commentDiv) commentDiv.classList.add("hidden");

  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="450" allowfullscreen style="border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);border:none;"></iframe>
  `;
}

// ===============================
// ⬇ DOWNLOAD MOVIE
// ===============================
function downloadMovie(link){
  let downloadLink = link.replace("/preview","/view");
  window.open(downloadLink,"_blank");
}

// ===============================
// ⭐ GET STARS FOR IMDB
// ===============================
function getStars(rating){
  rating = parseFloat(rating);
  let fullStars = Math.floor(rating/2);
  let halfStar = (rating%2)>=1 ? true:false;
  let emptyStars = 5 - fullStars - (halfStar?1:0);
  let stars="";
  for(let i=0;i<fullStars;i++) stars+="⭐";
  if(halfStar) stars+="✨";
  for(let i=0;i<emptyStars;i++) stars+="☆";
  return stars;
}

// ===============================
// 🎥 GET YOUTUBE TRAILER
// ===============================
function getTrailer(movieName){
  let query = encodeURIComponent(movieName+" trailer");
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${API_KEY}`;
  return fetch(url)
    .then(res=>res.json())
    .then(data => data.items && data.items.length>0 ? data.items[0].id.videoId:"")
    .catch(()=> "");
}

// ===============================
// 🔁 REDIRECT TO AD PAGE
// ===============================
function goAdPage(link){
  let params = new URLSearchParams(window.location.search);
  let movieId = params.get("id");
  window.location.href = "adpage.html?id=" + movieId + "&play=" + encodeURIComponent(link);
}

