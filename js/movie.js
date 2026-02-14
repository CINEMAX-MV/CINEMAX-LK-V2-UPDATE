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

    // Movie details
    document.getElementById("movieDetails").innerHTML = `
      <h2>${movie.title}</h2>
      <img src="${movie.image}" width="300" alt="${movie.title}">
      <p>▫🎞 <strong>IMDb:</strong> ${movie.imdb}</p>
      <p>▫📅 <strong>Release Date:</strong> ${movie.release_date}</p>
      <p>▫🕵️‍♂️ <strong>Director:</strong> ${movie.director}</p>
      <p>▫⏳ <strong>Runtime:</strong> ${movie.runtime}</p>
      <p>▫🎭 <strong>Genre:</strong> ${movie.genre}</p>
      <p>📝 <strong>Description:</strong> ${movie.description}</p>

      <div id="players">${playersHTML}</div>
      <div id="videoPlayer"></div>
    `;
  });

// Load player function
function loadPlayer(link){
  // Force /preview for iframe
  let embedLink = link.replace("/view", "/preview");
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" width="100%" height="400" allowfullscreen></iframe>
  `;
}

// Download function (open Player 1 link in new tab)
function downloadMovie(link){
  let downloadLink = link.replace("/preview", "/view"); // normal Google Drive view/download link
  window.open(downloadLink, "_blank");
}
