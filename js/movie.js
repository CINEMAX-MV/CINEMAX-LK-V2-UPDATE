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
        <button class="btn" onclick="loadPlayer('${player.link}')">${player.name}</button>
      `;
    });

    // Add download button using Player 1 link
    if(movie.players.length > 0){
      playersHTML += `
        <button class="btn download" onclick="downloadMovie('${movie.players[0].link}')">Download</button>
      `;
    }

    // Movie details with better layout
    document.getElementById("movieDetails").innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:flex-start;">
        <div style="flex:1 1 300px; max-width:400px;">
          <img src="${movie.image}" alt="${movie.title}" style="width:100%; border-radius:10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
        </div>
        <div style="flex:2 1 400px;">
          <h2 style="margin-top:0; font-size:2em; color:#333;">${movie.title}</h2>
          <p>▫🎞 <strong>IMDb:</strong> ${movie.imdb}</p>
          <p>▫📅 <strong>Release Date:</strong> ${movie.release_date}</p>
          <p>▫🕵️‍♂️ <strong>Director:</strong> ${movie.director}</p>
          <p>▫⏳ <strong>Runtime:</strong> ${movie.runtime}</p>
          <p>▫🎭 <strong>Genre:</strong> ${movie.genre}</p>
          <p style="text-align:justify; line-height:1.5; color:#555;">📝 <strong>Description:</strong> ${movie.description}</p>

          <div id="players" style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">${playersHTML}</div>
        </div>
      </div>

      <div id="videoPlayer" style="margin-top:30px;"></div>
    `;
  });

// Load player function
function loadPlayer(link){
  let embedLink = link.replace("/view", "/preview");
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="500" style="border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.3);" allowfullscreen></iframe>
  `;
}

// Download function
function downloadMovie(link){
  let downloadLink = link.replace("/preview", "/view"); // normal Google Drive view/download link
  window.open(downloadLink, "_blank");
}
