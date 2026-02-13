let params = new URLSearchParams(window.location.search);
let movieId = params.get("id");

fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {

    let movie = data[movieId];

    // Players buttons
    let playersHTML = "";
    movie.players.forEach(player => {
      playersHTML += `
        <button class="btn" onclick="loadPlayer('${player.link}')">${player.name}</button>
      `;
    });

    // Movie details + new fields
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

// Player load function
function loadPlayer(link){
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${link}" width="100%" height="400" allowfullscreen></iframe>
  `;
}
