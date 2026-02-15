const API_KEY = "AIzaSyAvdxsDafd2PzYeSZORv6JKRvXxg2m4NxQ"; // Your API Key

fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {
    let params = new URLSearchParams(window.location.search);
    let movieId = params.get("id");

    let movie = data[movieId];

    if(!movie){
      document.getElementById("movieDetails").innerHTML = "<h2 style='color:white;text-align:center'>Movie Not Found</h2>";
      return;
    }

    // Players buttons
    let playersHTML = "";
    if(movie.players && movie.players.length > 0){
      movie.players.forEach(player => {
        playersHTML += `<button class="btn btn-player" onclick="loadPlayer('${player.link}')">${player.name}</button>`;
      });
      playersHTML += `<button class="btn btn-download" onclick="downloadMovie('${movie.players[0].link}')">Download</button>`;
    }

    // Social media share
    let currentURL = encodeURIComponent(window.location.href);
    let socialHTML = `
      <div style="margin-top:20px; display:flex; gap:12px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="35" title="Share on Facebook">
        </a>
        <a href="https://wa.me/?text=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/whatsapp.png" width="35" title="Share on WhatsApp">
        </a>
        <a href="https://twitter.com/intent/tweet?url=${currentURL}&text=Watch ${encodeURIComponent(movie.title)}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="35" title="Share on Twitter">
        </a>
      </div>
    `;

    // Get Trailer ID from YouTube API
    getTrailer(movie.title).then(trailerId => {
      let trailerURL = trailerId ? `https://www.youtube.com/embed/${trailerId}?rel=0` : "";

      document.getElementById("movieDetails").innerHTML = `
        <div style="max-width:1000px;margin:auto;padding:20px;color:white;font-family:Poppins,sans-serif;">

          <!-- TRAILER -->
          <div style="width:100%; text-align:center; margin-bottom:20px;">
            ${ trailerURL ? `
              <iframe 
                src="${trailerURL}" 
                width="100%" 
                height="450" 
                allowfullscreen 
                style="border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);">
              </iframe>
            ` : `
              <img src="${movie.image}" 
                   style="width:100%;max-height:500px;object-fit:cover;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.3);">
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
              <img src="${movie.image}" 
                   style="width:100%;max-width:250px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
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
        </div>

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
          .btn:hover{
            transform:scale(1.05);
          }
          .btn-download{
            background:linear-gradient(45deg,#4caf50,#2e7d32);
          }
        </style>
      `;
    });

  });

// Load player
function loadPlayer(link){
  let embedLink = link.replace("/view","/preview");
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="450" allowfullscreen 
      style="border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);border:none;">
    </iframe>
  `;
}

// Download
function downloadMovie(link){
  let downloadLink = link.replace("/preview","/view");
  window.open(downloadLink,"_blank");
}

// IMDb stars
function getStars(rating){
  rating = parseFloat(rating);
  let fullStars = Math.floor(rating / 2);
  let halfStar = (rating % 2) >= 1 ? true : false;
  let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let stars = "";
  for(let i=0;i<fullStars;i++) stars += "⭐";
  if(halfStar) stars += "✨";
  for(let i=0;i<emptyStars;i++) stars += "☆";
  return stars;
}

// YouTube Search API
function getTrailer(movieName){
  let query = encodeURIComponent(movieName + " trailer");
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${API_KEY}`;

  return fetch(url)
    .then(res => res.json())
    .then(data => {
      if(data.items && data.items.length > 0){
        return data.items[0].id.videoId;
      } else {
        return "";
      }
    })
    .catch(() => "");
}

<!-- COMMENTS SECTION -->
<div id="commentsSection" style="margin-top:50px; max-width:800px; margin:auto;">
  <h3 style="color:white; margin-bottom:15px;">💬 User Comments</h3>

  <!-- Input -->
  <div style="margin-bottom:20px; display:flex; flex-direction:column; gap:10px;">
    <input id="commentName" type="text" placeholder="Your Name" style="padding:10px; border-radius:6px; border:none; width:100%;">
    <textarea id="commentText" placeholder="Write your comment..." rows="4" style="padding:10px; border-radius:6px; border:none; width:100%;"></textarea>
    <button onclick="addComment()" style="width:150px; padding:10px; border:none; border-radius:6px; background:#ff8c00; color:white; font-weight:bold; cursor:pointer;">Submit</button>
  </div>

  <!-- Comments List -->
  <div id="commentsList" style="display:flex; flex-direction:column; gap:15px;"></div>
</div>

<script>
// movieId unique for each movie page
const movieId = new URLSearchParams(window.location.search).get("id");

// Load comments
function loadComments() {
  let comments = JSON.parse(localStorage.getItem("comments_" + movieId) || "[]");
  let html = "";
  comments.forEach(c => {
    html += `
      <div style="background: rgba(255,255,255,0.05); padding:12px; border-radius:8px;">
        <p style="margin:0; font-weight:bold; color:#ffcc00;">${c.name} 
          <span style="font-weight:normal; color:#aaa; font-size:0.85em;">(${c.time})</span>
        </p>
        <p style="margin:5px 0 0 0; color:#ddd;">${c.text}</p>
      </div>
    `;
  });
  document.getElementById("commentsList").innerHTML = html;
}

// Add new comment
function addComment() {
  const name = document.getElementById("commentName").value.trim();
  const text = document.getElementById("commentText").value.trim();
  if(!name || !text){
    alert("Please enter your name and comment!");
    return;
  }
  const time = new Date().toLocaleString();
  let comments = JSON.parse(localStorage.getItem("comments_" + movieId) || "[]");
  comments.push({name, text, time});
  localStorage.setItem("comments_" + movieId, JSON.stringify(comments));
  document.getElementById("commentName").value = "";
  document.getElementById("commentText").value = "";
  loadComments();
}

// Load existing comments on page load
loadComments();
</script>
