// ===============================
// 🔐 YOUTUBE API KEY
// ===============================
const API_KEY = "AIzaSyBPPhDhVem-bSzZjGIlysFfnAax9bKQ2aM"; // Your API Key

// ===============================
// 💰 COINS SYSTEM + 6H DOWNLOAD LOCK
// ===============================
const DAILY_COINS = 5;
const COINS_KEY = "cinemax_user_coins";
const CLAIM_TIME_KEY = "cinemax_last_claim";

function getCoins() {
  return parseInt(localStorage.getItem(COINS_KEY)) || 0;
}

function setCoins(amount) {
  localStorage.setItem(COINS_KEY, amount);
  updateCoinsUI();
}

function canClaimDaily() {
  const last = parseInt(localStorage.getItem(CLAIM_TIME_KEY)) || 0;
  return Date.now() - last >= 24 * 60 * 60 * 1000;
}

function claimDailyCoins() {
  if(canClaimDaily()) {
    setCoins(getCoins() + DAILY_COINS);
    localStorage.setItem(CLAIM_TIME_KEY, Date.now());
    alert(`✅ You claimed ${DAILY_COINS} coins!`);
  } else {
    alert("⏳ Already claimed today. Wait for countdown.");
  }
}

function updateCoinsUI() {
  let div = document.getElementById("coinsDisplay");
  if(!div){
    div = document.createElement("div");
    div.id = "coinsDisplay";
    div.style.cssText = `
      position:fixed;top:20px;right:20px;padding:10px 15px;
      background:linear-gradient(45deg,#ff8c00,#ff2a68);
      color:#fff;border-radius:10px;font-weight:bold;z-index:9999;display:flex;align-items:center;gap:10px;
    `;
    document.body.appendChild(div);
  }
  div.innerHTML = `
    💰 Coins: ${getCoins()}
    <button onclick="claimDailyCoins()" style="padding:4px 8px;border-radius:6px;background:#fff;color:#ff2a68;border:none;cursor:pointer;font-weight:bold;">Claim Daily</button>
    <span id="coinCountdown" style="margin-left:10px;font-size:0.9em;"></span>
  `;
}

// ===============================
// ⬇ DOWNLOAD LOCK
// ===============================
function canDownload(movieId) {
  const key = "cinemax_download_" + movieId;
  const unlock = parseInt(localStorage.getItem(key)) || 0;
  return Date.now() >= unlock;
}

function setDownloadLock(movieId, hours = 6) {
  const key = "cinemax_download_" + movieId;
  const unlock = Date.now() + hours*60*60*1000;
  localStorage.setItem(key, unlock);
}

function updateDownloadCountdown(movieId) {
  const key = "cinemax_download_" + movieId;
  const unlock = parseInt(localStorage.getItem(key)) || 0;
  const el = document.getElementById("downloadCountdown");
  if(!el) return;
  const interval = setInterval(()=>{
    const remain = unlock - Date.now();
    if(remain <= 0){
      el.innerText = "";
      clearInterval(interval);
      return;
    }
    const h = Math.floor(remain/3600000);
    const m = Math.floor((remain%3600000)/60000);
    const s = Math.floor((remain%60000)/1000);
    el.innerText = `⏳ Download unlocks in ${h}h ${m}m ${s}s`;
  },1000);
}

function attemptDownload(link,movieId){
  if(getCoins() <= 0){
    alert("❌ Not enough coins. Claim daily coins first!");
    return;
  }
  if(!canDownload(movieId)){
    alert("⏳ Download locked for 6 hours.");
    return;
  }
  setCoins(getCoins()-1);
  setDownloadLock(movieId,6);
  downloadMovie(link);
  updateDownloadCountdown(movieId);
}

// ===============================
// 📂 LOAD MOVIE DATA FROM JSON
// ===============================
fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");
    const movie = data[movieId];

    if(!movie){
      document.getElementById("movieDetails").innerHTML = "<h2 style='color:white;text-align:center'>Movie Not Found</h2>";
      return;
    }

    let playersHTML = "";
    if(movie.players && movie.players.length>0){
      movie.players.forEach(p=>{
        playersHTML += `<button class="btn btn-player" onclick="goAdPage('${p.link}')">${p.name}</button>`;
      });
      playersHTML += `<button class="btn btn-download" onclick="attemptDownload('${movie.players[0].link}','${movieId}')">Download</button> <span id='downloadCountdown' style='margin-left:10px;color:#ffcc00;'></span>`;
    }

    let shareURL = encodeURIComponent(`https://cinemaxlk.vercel.app/api/og?id=${movieId}&title=${encodeURIComponent(movie.title)}&image=${encodeURIComponent(movie.image)}`);
    let currentURL = encodeURIComponent(window.location.href);
    let socialHTML = `
      <div style="margin-top:20px; display:flex; gap:12px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="35" title="Share on Facebook">
        </a>
        <a href="https://wa.me/?text=${shareURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/whatsapp.png" width="35" title="Share on WhatsApp">
        </a>
        <a href="https://twitter.com/intent/tweet?url=${currentURL}&text=Watch ${encodeURIComponent(movie.title)}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="35" title="Share on Twitter">
        </a>
      </div>
    `;

    getTrailer(movie.title).then(trailerId=>{
      let trailerURL = trailerId ? `https://www.youtube.com/embed/${trailerId}?rel=0` : "";
      document.getElementById("movieDetails").innerHTML = `
        <div style="max-width:1000px;margin:auto;padding:20px;color:white;font-family:Poppins,sans-serif;">
          <div id="trailerContainer" style="width:100%; text-align:center; margin-bottom:20px;">
            ${trailerURL? `<iframe src="${trailerURL}" width="100%" height="450" allowfullscreen style="border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);"></iframe>` : `<img src="${movie.image}" style="width:100%;max-height:500px;object-fit:cover;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.3);">`}
          </div>

          <div style="margin-top:20px;">
            <h2 style="font-size:2.5em;margin-bottom:15px;background:linear-gradient(90deg,#ff8c00,#ff2a68);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${movie.title}</h2>
            <p style="font-size:1.1em;line-height:1.8;color:#ddd;">${movie.description}</p>
          </div>

          <div style="display:flex;gap:25px;margin-top:30px;flex-wrap:wrap;">
            <div style="flex:1;min-width:250px;">
              <img src="${movie.image}" style="width:100%;max-width:250px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
              <div style="margin-top:10px;font-size:1.2em;">
                <strong>IMDb:</strong> <span style="color:#ffcc00;">${getStars(movie.imdb)}</span> <span style="color:#aaa;">(${movie.imdb}/10)</span>
              </div>
            </div>

            <div style="flex:2;min-width:300px;line-height:1.8;">
              <p>📅 <strong>Release Date:</strong> ${movie.release_date}</p>
              <p>🎬 <strong>Director:</strong> ${movie.director}</p>
              <p>⏳ <strong>Runtime:</strong> ${movie.runtime}</p>
              <p>🎭 <strong>Genre:</strong> ${movie.genre}</p>
            </div>
          </div>

          <div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:12px;">
            ${playersHTML}
          </div>

          ${socialHTML}

          <div id="videoPlayer" style="margin-top:20px;"></div>

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
      `;

      // UPDATE UI
      updateCoinsUI();
      updateDownloadCountdown(movieId);

      const form = document.querySelector(".commentForm");
      const successMsg = document.querySelector(".successMsg");
      const submitBtn = form.querySelector("button[type='submit']");
      form.addEventListener("submit", e=>{
        e.preventDefault();
        submitBtn.style.display = "none";
        const formData = new FormData(form);
        fetch("https://formsubmit.co/ajax/boyae399@gmail.com",{method:"POST",body:formData})
        .then(res=>res.json())
        .then(()=>{successMsg.style.display="block";form.reset();});
      });

      const autoPlayLink = params.get("autoplay");
      if(autoPlayLink) loadPlayer(autoPlayLink);
  });

// ===============================
// ⬇ EXISTING FUNCTIONS (UNCHANGED)
// ===============================
function loadPlayer(link){
  let embedLink = link.replace("/view","/preview");
  const commentDiv = document.querySelector(".comment-section");
  if(commentDiv) commentDiv.classList.add("hidden");
  document.getElementById("videoPlayer").innerHTML = `<iframe src="${embedLink}" width="100%" height="450" allowfullscreen style="border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);border:none;"></iframe>`;
}

function downloadMovie(link){
  let downloadLink = link.replace("/preview","/view");
  window.open(downloadLink,"_blank");
}

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

function getTrailer(movieName){
  let query = encodeURIComponent(movieName+" trailer");
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${API_KEY}`;
  return fetch(url).then(res=>res.json()).then(data=>data.items&&data.items.length>0?data.items[0].id.videoId:"").catch(()=> "");
}

function goAdPage(link){
  let params = new URLSearchParams(window.location.search);
  let movieId = params.get("id");
  window.location.href = "adpage.html?id=" + movieId + "&play=" + encodeURIComponent(link);
}

// ===============================
// ⏱ COIN CLAIM COUNTDOWN
// ===============================
setInterval(()=>{
  const last = parseInt(localStorage.getItem(CLAIM_TIME_KEY))||0;
  const remain = 24*60*60*1000 - (Date.now()-last);
  const el = document.getElementById("coinCountdown");
  if(!el) return;
  if(remain<=0){el.innerText="";return;}
  const h = Math.floor(remain/3600000);
  const m = Math.floor((remain%3600000)/60000);
  const s = Math.floor((remain%60000)/1000);
  el.innerText = `⏳ Next claim in ${h}h ${m}m ${s}s`;
},1000);
