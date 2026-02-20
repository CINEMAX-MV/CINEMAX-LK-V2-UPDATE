
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
        <a href="https://wa.me/94740707157?text=${encodeURIComponent('.gdrive or .download ' + movie.players[0].link)}" target="_blank">
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
<!-- 📢 FULLSCREEN NETFLIX STYLE ANNOUNCEMENT WITH CLOSE -->
<!-- =============================== -->
<div id="fullscreenAnnouncement">
  <div class="announcement-container">
    <div class="announcement-header">
      📢 Announcement
      <span id="closeAnnouncement">&times;</span>
    </div>
    <div class="announcement-body">
      මෙම සිංහල චිත්‍රපටය ඔබට පහසුවෙන්ම 
      <span class="gradient-text">WHATSAPP PACKAGE</span> 
      ඔස්සේ බාගත කිරීමට ඉහත දී ඇති 
      <span class="gradient-text">@WHATSAPP SOCIAL MEDIA ICON</span> 
      එක භාවිතා කරන්න. මෙහිදී ඔබට 
      <span class="highlight-text">.Gdrive</span> & 
      <span class="highlight-text">.Download</span> 
      යනුවෙන් දිස්වෙන අතර Google drive ලින්ක් එකක් නොවේ නම් එය කපා හැර 
      <span class="highlight-text">.download</span> 
      යන මුරපදය පමණක් භාවිතා කරන්න. මෙම වෙබ් අඩවිය ඔස්සේ ලබා ගන්නා ෆිල්ම්ස් හැර අනෙකුත් දේ ලබා ගැනීමට 
      <span class="gradient-text">WA - USER BOT</span> 
      යොදා ගැනීම ඔබගෙ අනන්‍යතාවයට හානිදායක වනු ඇත.
    </div>
  </div>
</div>

<style>
/* =============================== */
/* FULLSCREEN NETFLIX ANNOUNCEMENT */
/* =============================== */
#fullscreenAnnouncement {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.85);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
  animation: fadeInOverlay 1.5s forwards;
  padding:20px;
  box-sizing:border-box;
}

/* Card container */
.announcement-container {
  background:#111;
  border-left:8px solid #E50914;
  border-radius:16px;
  padding:25px 30px;
  max-width:800px;
  width:100%;
  text-align:center;
  box-shadow:0 10px 40px rgba(0,0,0,0.7);
  color:#FFD700;
  position: relative;
}

/* Close button */
#closeAnnouncement {
  position: absolute;
  top:15px;
  right:20px;
  font-size:1.5em;
  cursor:pointer;
  color:#fff;
  font-weight:bold;
  transition:0.3s;
}
#closeAnnouncement:hover {
  color:#FF2A68;
  transform: scale(1.2);
}

/* Header */
.announcement-header {
  font-size:1.8em;
  font-weight:800;
  margin-bottom:20px;
  color:#E50914;
  text-transform: uppercase;
  letter-spacing:1px;
  text-shadow: 2px 2px 6px rgba(0,0,0,0.7);
}

/* Body text */
.announcement-body {
  font-size:1.1em;
  line-height:1.8em;
}

/* Gradient text animation for English words */
.gradient-text {
  background: linear-gradient(90deg, #25D366, #128C7E, #FF8C00, #FF2A68);
  background-size: 400% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  animation: gradientShift 6s linear infinite;
  display:inline-block;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

/* Highlight for .Gdrive and .Download */
.highlight-text {
  color:#FF4081;
  font-weight:bold;
  animation: pulse 1.5s infinite alternate;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

/* Fade-in overlay */
@keyframes fadeInOverlay {
  0% { opacity:0; }
  100% { opacity:1; }
}

/* Gradient shift animation */
@keyframes gradientShift {
  0% { background-position:0% 50%; }
  50% { background-position:100% 50%; }
  100% { background-position:0% 50%; }
}

/* Pulse effect */
@keyframes pulse {
  0% { color: #FF4081; text-shadow: 0 0 2px #FF4081; }
  50% { color: #FF80AB; text-shadow: 0 0 6px #FF80AB; }
  100% { color: #FF4081; text-shadow: 0 0 2px #FF4081; }
}

/* Responsive for mobile screens */
@media (max-width:600px) {
  .announcement-container {
    padding:20px 18px;
  }
  .announcement-header {
    font-size:1.5em;
  }
  .announcement-body {
    font-size:1em;
  }
}
</style>

<script>
  // Close on click
  document.getElementById("closeAnnouncement").addEventListener("click", function(){
    document.getElementById("fullscreenAnnouncement").style.display = "none";
  });

  // Auto-hide after 10 seconds
  setTimeout(function(){
    const ann = document.getElementById("fullscreenAnnouncement");
    if(ann) ann.style.display = "none";
  }, 10000);
</script>
<!-- =============================== -->
<!-- 🔹 STYLES AND ANIMATION -->
<!-- =============================== -->
<style>
  /* Gradient text animation for English words */
  .gradient-text {
    background: linear-gradient(90deg, #25D366, #128C7E, #FF8C00, #FF2A68);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    animation: gradientShift 4s infinite alternate;
    display: inline-block;
  }

  /* Highlight for .Gdrive and .Download */
  .highlight-text {
    color:#FF4081;
    font-weight:bold;
    animation: pulse 1.5s infinite alternate;
  }

  /* Fade-in for whole announcement */
  @keyframes fadeInAnnouncement {
    0% { opacity:0; transform: translateY(10px); }
    100% { opacity:1; transform: translateY(0); }
  }

  /* Gradient shift animation */
  @keyframes gradientShift {
    0% { background-position:0% 50%; }
    50% { background-position:100% 50%; }
    100% { background-position:0% 50%; }
  }

  /* Pulse effect for highlight text */
  @keyframes pulse {
    0% { color: #FF4081; }
    50% { color: #FF80AB; }
    100% { color: #FF4081; }
  }

  /* Responsive for mobile screens */
  @media (max-width:600px) {
    #commentAnnouncement {
      font-size:0.9em;
      padding:12px 15px;
    }
  }
</style>

<!-- =============================== -->
<!-- 🔹 STYLES AND ANIMATION -->
<!-- =============================== -->
<style>
  /* Gradient text animation for English words */
  .gradient-text {
    background: linear-gradient(90deg, #25D366, #128C7E, #FF8C00, #FF2A68);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    animation: gradientShift 4s infinite alternate;
    display: inline-block;
  }

  /* Highlight for .Gdrive and .Download */
  .highlight-text {
    color:#FF4081;
    font-weight:bold;
    animation: pulse 1.5s infinite alternate;
  }

  /* Fade-in for whole announcement */
  @keyframes fadeInAnnouncement {
    0% { opacity:0; transform: translateY(10px); }
    100% { opacity:1; transform: translateY(0); }
  }

  /* Gradient shift animation */
  @keyframes gradientShift {
    0% { background-position:0% 50%; }
    50% { background-position:100% 50%; }
    100% { background-position:0% 50%; }
  }

  /* Pulse effect for highlight text */
  @keyframes pulse {
    0% { color: #FF4081; }
    50% { color: #FF80AB; }
    100% { color: #FF4081; }
  }

  /* Responsive for mobile screens */
  @media (max-width:600px) {
    #commentAnnouncement {
      font-size:0.9em;
      padding:12px 15px;
    }
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
