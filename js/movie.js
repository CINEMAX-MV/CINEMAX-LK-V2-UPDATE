document.getElementById("movieDetails").innerHTML = `

<!-- HERO SECTION -->
<div class="hero" style="background-image:url('${movie.image}')">
  <div class="hero-overlay"></div>
  <div class="hero-play" onclick="loadPlayer('${movie.players[0]?.link || ""}')">
    ▶
  </div>
</div>

<!-- MAIN CARD -->
<div class="details-card">

  <div class="top-section">
    <img src="${movie.image}" class="poster">

    <div class="info">
      <h1>${movie.title}</h1>
      <div class="meta">${movie.release_date} • ${movie.runtime}</div>
      <div class="meta">${movie.genre}</div>

      <div class="rating-box">
        <span class="imdb">${movie.imdb}</span>
        <span class="stars">★★★★★</span>
      </div>
    </div>
  </div>

  <div class="sources">
    ${playersHTML}
  </div>

  <div class="description">
    ${movie.description}
  </div>

  <div id="videoPlayer" class="player-box"></div>

</div>
`;
