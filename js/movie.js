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
    movie.players.forEach(player => {
      playersHTML += `
        <button class="btn btn-player" onclick="loadPlayer('${player.link}')">
          ${player.name}
        </button>
      `;
    });

    if(movie.players.length > 0){
      playersHTML += `
        <button class="btn btn-download" onclick="downloadMovie('${movie.players[0].link}')">
          Download
        </button>
      `;
    }

    // Social media share buttons (example: Facebook, WhatsApp, Twitter)
    let currentURL = window.location.href;
    let socialHTML = `
      <div style="margin-top:20px; display:flex; gap:12px;">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="35">
        </a>
        <a href="https://wa.me/?text=${currentURL}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/whatsapp.png" width="35">
        </a>
        <a href="https://twitter.com/intent/tweet?url=${currentURL}&text=Watch ${encodeURIComponent(movie.title)}" target="_blank">
          <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" width="35">
        </a>
      </div>
    `;

    // YouTube Trailer Embed URL (assuming movie.trailer has YouTube ID)
    let trailerURL = movie.trailer ? `https://www.youtube.com/embed/${movie.trailer}` : "";

    document.getElementById("movieDetails").innerHTML = `
      <div style="max-width:1000px;margin:auto;padding:20px;color:white;font-family:Poppins,sans-serif;">

        <!-- TRAILER -->
        <div style="text-align:center;">
          ${ trailerURL ? `
            <iframe src="${trailerURL}" width="100%" height="500" allowfullscreen
              style="border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:none;">
            </iframe>
          ` : `
            <img src="${movie.image}" 
                 style="width:100%;max-height:500px;object-fit:cover;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          `}
        </div>

        <!-- DESCRIPTION -->
        <div style="margin-top:25px;">
          <h2 style="font-size:2.5em;margin-bottom:15px;background:linear-gradient(90deg,#ff8c00,#ff2a68);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;">
            ${movie.title}
          </h2>

          <p style="font-size:1.1em;line-height:1.8;color:#ddd;">
            ${movie.description}
          </p>
        </div>

        <!-- SMALL POSTER + RATING + DETAILS -->
        <div style="display:flex;gap:25px;margin-top:40px;flex-wrap:wrap;">

          <!-- Small Poster + IMDb -->
          <div style="flex:1;min-width:250px;">
            <img src="${movie.image}" 
                 style="width:100%;max-width:250px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
            
            <div style="margin-top:15px;font-size:1.2em;">
              <strong>IMDb:</strong> 
              <span style="color:#ffcc00;">${getStars(movie.imdb)}</span>
              <span style="color:#aaa;">(${movie.imdb}/10)</span>
            </div>
          </div>

          <!-- Other Details -->
          <div style="flex:2;min-width:300px;line-height:1.8;">
            <p>📅 <strong>Release Date:</strong> ${movie.release_date}</p>
            <p>🎬 <strong>Director:</strong> ${movie.director}</p>
            <p>⏳ <strong>Runtime:</strong> ${movie.runtime}</p>
            <p>🎭 <strong>Genre:</strong> ${movie.genre}</p>
          </div>

        </div>

        <!-- PLAYERS -->
        <div style="margin-top:30px;display:flex;flex-wrap:wrap;gap:12px;">
          ${playersHTML}
        </div>

        <!-- SOCIAL SHARE -->
        ${socialHTML}

        <!-- VIDEO PLAYER -->
        <div id="videoPlayer" style="margin-top:30px;"></div>

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

// Load player
function loadPlayer(link){
  let embedLink = link.replace("/view", "/preview");
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="450" allowfullscreen
      style="border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.4);border:none;">
    </iframe>
  `;
}

// Download
function downloadMovie(link){
  let downloadLink = link.replace("/preview", "/view");
  window.open(downloadLink, "_blank");
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
