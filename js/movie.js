document.getElementById("movieDetails").innerHTML = `

<!-- HERO SECTION -->
<div class="movie-hero" style="
  background:url('${movie.image}') center/cover no-repeat;
">
  <div class="hero-overlay"></div>
  <div class="play-btn" onclick="loadPlayer('${movie.players[0]?.link || ""}')">
    ▶
  </div>
</div>

<!-- MAIN CARD -->
<div class="movie-card">

  <div class="movie-top">
    <img src="${movie.image}" class="movie-poster">

    <div class="movie-info">
      <h2>${movie.title}</h2>
      <div class="meta">${movie.release_date} • ${movie.runtime}</div>
      <div class="meta">${movie.genre}</div>

      <div class="rating">
        <div class="rating-score">${movie.imdb}</div>
        <div class="stars">
          ⭐⭐⭐⭐⭐
        </div>
      </div>
    </div>
  </div>

  <!-- VIDEO SOURCES -->
  <div class="source-section">
    ${playersHTML}
  </div>

  <!-- SYNOPSIS -->
  <div class="synopsis">
    ${movie.description}
  </div>

  <!-- VIDEO PLAYER -->
  <div id="videoPlayer" style="margin-top:25px;"></div>

</div>
`;
