fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {
    let params = new URLSearchParams(window.location.search);
    let movieId = params.get("id");

    let movie = data[movieId];

    // Players buttons + download
    let playersHTML = "";
    movie.players.forEach(player => {
      playersHTML += `
        <button class="btn" onclick="loadPlayer('${player.link}')"
          style="
            padding:10px 18px;
            border:none;
            border-radius:6px;
            background:#ff8c00;
            color:white;
            cursor:pointer;
            font-weight:bold;
            box-shadow:0 4px 8px rgba(0,0,0,0.2);
            transition:0.3s;
          "
          onmouseover="this.style.background='#ff2a68';"
          onmouseout="this.style.background='#ff8c00';"
        >${player.name}</button>
      `;
    });

    // Add download button using Player 1 link
    if(movie.players.length > 0){
      playersHTML += `
        <button class="btn download" onclick="downloadMovie('${movie.players[0].link}')"
          style="
            padding:10px 18px;
            border:none;
            border-radius:6px;
            background:#4caf50;
            color:white;
            cursor:pointer;
            font-weight:bold;
            box-shadow:0 4px 8px rgba(0,0,0,0.2);
            transition:0.3s;
          "
          onmouseover="this.style.background='#45a049';"
          onmouseout="this.style.background='#4caf50';"
        >Download</button>
      `;
    }

    // Movie details layout
    document.getElementById("movieDetails").innerHTML = `
      <div style="max-width:900px; margin:0 auto; padding:20px; font-family: 'Poppins', sans-serif;">
        
        <!-- Movie Image -->
        <div style="width:100%; text-align:center;">
          <img src="${movie.image}" alt="${movie.title}" style="width:80%; max-width:500px; border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);">
        </div>

        <!-- Movie Info -->
        <div style="margin-top:25px; line-height:1.6;">
          <h2 style="
            font-size:2.6em; 
            margin-bottom:20px; 
            background: linear-gradient(90deg, #ff8c00, #ff2a68);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          ">${movie.title}</h2>

          <p>▫🎞 <strong style="color:white;">IMDb:</strong> <span style="color:#ccc;">${movie.imdb}</span></p>
          <p>▫📅 <strong style="color:white;">Release Date:</strong> <span style="color:#ccc;">${movie.release_date}</span></p>
          <p>▫🕵️‍♂️ <strong style="color:white;">Director:</strong> <span style="color:#ccc;">${movie.director}</span></p>
          <p>▫⏳ <strong style="color:white;">Runtime:</strong> <span style="color:#ccc;">${movie.runtime}</span></p>
          <p>▫🎭 <strong style="color:white;">Genre:</strong> <span style="color:#ccc;">${movie.genre}</span></p>
          <p style="text-align:justify; margin-top:15px; font-size:1.05em; color:#eee;">
            📝 <strong style="color:white;">Description:</strong> ${movie.description}
          </p>
        </div>

        <!-- Player Buttons -->
        <div id="players" style="margin-top:25px; display:flex; flex-wrap:wrap; gap:12px;">
          ${playersHTML}
        </div>

        <!-- Video Player -->
        <div id="videoPlayer" style="margin-top:30px;"></div>
      </div>
    `;
  });

// Load player function
function loadPlayer(link){
  let embedLink = link.replace("/view", "/preview"); // Force /preview for iframe
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="400" allowfullscreen style="border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);"></iframe>
  `;
}

// Download function (open Player 1 link in new tab)
function downloadMovie(link){
  let downloadLink = link.replace("/preview", "/view"); // normal Google Drive view/download link
  window.open(downloadLink, "_blank");
}
