// ===============================
// 🔐 YOUTUBE API KEY
// ===============================
const API_KEY = "AIzaSyBPPhDhVem-bSzZjGIlysFfnAax9bKQ2aM"; // Your API Key

// ===============================
// 💰 COIN SYSTEM
// ===============================
function getCoins() {
  return parseInt(localStorage.getItem('coins') || '0');
}

function addCoins(amount) {
  let current = getCoins();
  localStorage.setItem('coins', current + amount);
  updateCoinDisplay();
}

function spendCoin(amount) {
  let current = getCoins();
  if (current >= amount) {
    localStorage.setItem('coins', current - amount);
    updateCoinDisplay();
    return true;
  }
  return false;
}

function updateCoinDisplay() {
  let coins = getCoins();
  let coinDiv = document.getElementById("coinDisplay");
  if (!coinDiv) {
    coinDiv = document.createElement("div");
    coinDiv.id = "coinDisplay";
    coinDiv.style.position = "fixed";
    coinDiv.style.top = "10px";
    coinDiv.style.right = "10px";
    coinDiv.style.background = "#ff8c00";
    coinDiv.style.color = "#fff";
    coinDiv.style.padding = "8px 12px";
    coinDiv.style.borderRadius = "8px";
    coinDiv.style.fontWeight = "bold";
    coinDiv.style.zIndex = "9999";
    document.body.appendChild(coinDiv);
  }
  coinDiv.innerText = `Coins: ${coins}`;
}

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
        playersHTML += `<button class="btn btn-player" onclick="goAdPage('${player.link}')">${player.name}</button>`;
      });
      playersHTML += `<button class="btn btn-download" onclick="downloadMovie('${movie.players[0].link}')">Download</button>`;
    }

    // ===============================
    // 🔗 SOCIAL SHARE
    // ===============================
    let shareURL = `https://cinemaxlk.vercel.app/api/og?id=${movieId}&title=${encodeURIComponent(movie.title)}&image=${encodeURIComponent(movie.image)}`;
    shareURL = encodeURIComponent(shareURL);
    let currentURL = encodeURIComponent(window.location.href);

    let socialHTML = `
      <div style="margin-top:20px; display:flex; gap:12px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentURL}" target="_blank" onclick="addCoins(1)">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="35" title="Share on Facebook">
        </a>
        <a href="https://wa.me/?text=${shareURL}" target="_blank" onclick="addCoins(1)">
          <img src="https://img.icons8.com/color/48/000000/whatsapp.png" width="35" title="Share on WhatsApp">
        </a>
        <a href="https://twitter.com/intent/tweet?url=${currentURL}&text=Watch ${encodeURIComponent(movie.title)}" target="_blank" onclick="addCoins(1)">
          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="35" title="Share on Twitter">
        </a>
      </div>
    `;

    // ===============================
    // 🎥 GET TRAILER FROM YOUTUBE
    // ===============================
    getTrailer(movie.title).then(trailerId => {
      let trailerURL = trailerId ? `https://www.youtube.com/embed/${trailerId}?rel=0` : "";

      // ===============================
      // 🖼 RENDER MOVIE DETAILS
      // ===============================
      document.getElementById("movieDetails").innerHTML = `
        <div style="max-width:1000px;margin:auto;padding:20px;color:white;font-family:Poppins,sans-serif;">

          <!-- TRAILER / BIG SCREEN -->
          <div id="trailerContainer" style="width:100%; text-align:center; margin-bottom:20px;">
            ${ trailerURL ? `<iframe src="${trailerURL}" width="100%" height="450" allowfullscreen style="border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);"></iframe>` 
            : `<img src="${movie.image}" style="width:100%;max-height:500px;object-fit:cover;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.3);">`}
          </div>

          <!-- DESCRIPTION -->
          <div style="margin-top:20px;">
            <h2 style="font-size:2.5em;margin-bottom:15px;background:linear-gradient(90deg,#ff8c00,#ff2a68);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;">
              ${movie.title}
            </h2>
            <p style="font-size:1.1em;line-height:1.8;color:#ddd;">${movie.description}</p>
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
              <div class="input-group"><label>Name:</label><input type="text" name="name" placeholder="Display Name" required></div>
              <div class="input-group"><label>Email:</label><input type="email" name="email" placeholder="Email Address" required></div>
              <div class="input-group"><label>Comment:</label><textarea name="message" placeholder="Write a comment..." required></textarea></div>
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
      `;

      const form = document.querySelector(".commentForm");
      const successMsg = document.querySelector(".successMsg");
      const submitBtn = form.querySelector("button[type='submit']");
      form.addEventListener("submit", function(e){
        e.preventDefault();
        submitBtn.style.display = "none";
        const formData = new FormData(this);
        fetch("https://formsubmit.co/ajax/boyae399@gmail.com", {
          method: "POST",
          body: formData
        })
        .then(res => res.json())
        .then(() => {
          successMsg.style.display = "block";
          form.reset();
        });
      });

      // Auto play after return from adpage
      let autoPlayLink = params.get("autoplay");
      if(autoPlayLink){ loadPlayer(autoPlayLink); }
    });

    // Show coins on page load
    updateCoinDisplay();
  });

// ===============================
// ⬇ LOAD PLAYER
// ===============================
function loadPlayer(link){
  let embedLink = link.replace("/view","/preview");
  const commentDiv = document.querySelector(".comment-section");
  if(commentDiv) commentDiv.classList.add("hidden");
  document.getElementById("videoPlayer").innerHTML = `<iframe src="${embedLink}" width="100%" height="450" allowfullscreen style="border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);border:none;"></iframe>`;
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
  return fetch(url).then(res=>res.json()).then(data => data.items && data.items.length>0 ? data.items[0].id.videoId:"").catch(()=> "");
}

// ===============================
// 🔁 REDIRECT TO AD PAGE WITH COIN CHECK
// ===============================
function goAdPage(link){
  let params = new URLSearchParams(window.location.search);
  let movieId = params.get("id");
  if(!spendCoin(1)){
    alert("You need 1 coin to play this movie! Earn coins by sharing.");
    return;
  }
  window.location.href = "adpage.html?id=" + movieId + "&play=" + encodeURIComponent(link);
}
