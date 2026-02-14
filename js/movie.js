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

    if(movie.players.length > 0){
      playersHTML += `
        <button class="btn download" onclick="downloadMovie('${movie.players[0].link}')">Download</button>
      `;
    }

    // Movie details layout with image on top
    document.getElementById("movieDetails").innerHTML = `
      <div style="max-width:900px; margin:0 auto; padding:20px; font-family: 'Poppins', sans-serif;">
        
        <!-- Movie Image -->
        <div style="width:100%; text-align:center;">
          <img src="${movie.image}" alt="${movie.title}" style="width:80%; max-width:500px; border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);">
        </div>

        <!-- Movie Info -->
        <div style="margin-top:25px; color:#333; line-height:1.6;">
          <h2 style="font-size:2.2em; margin-bottom:15px;">${movie.title}</h2>
          <p>▫🎞 <strong>IMDb:</strong> ${movie.imdb}</p>
          <p>▫📅 <strong>Release Date:</strong> ${movie.release_date}</p>
          <p>▫🕵️‍♂️ <strong>Director:</strong> ${movie.director}</p>
          <p>▫⏳ <strong>Runtime:</strong> ${movie.runtime}</p>
          <p>▫🎭 <strong>Genre:</strong> ${movie.genre}</p>
          <p style="text-align:justify; margin-top:15px; font-size:1.05em; color:#555;">
            📝 <strong>Description:</strong> ${movie.description}
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
  let embedLink = link.replace("/view", "/preview");
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="550" style="border-radius:12px; box-shadow:0 8px 25px rgba(0,0,0,0.3);" allowfullscreen></iframe>
  `;
}

// Download function
function downloadMovie(link){
  let downloadLink = link.replace("/preview", "/view");
  window.open(downloadLink, "_blank");
}
