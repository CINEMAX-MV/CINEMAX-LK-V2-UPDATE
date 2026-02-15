document.getElementById("movieDetails").innerHTML = `
  <div style="
    max-width:950px;
    margin:40px auto;
    padding:25px;
    font-family:'Poppins',sans-serif;
    background:rgba(255,255,255,0.05);
    backdrop-filter:blur(15px);
    border-radius:20px;
    box-shadow:0 15px 40px rgba(0,0,0,0.6);
    color:white;
  ">

    <!-- TOP SECTION -->
    <div style="
      display:flex;
      gap:25px;
      flex-wrap:wrap;
      align-items:flex-start;
    ">

      <!-- Poster -->
      <div style="flex:0 0 260px;">
        <img src="${movie.image}" alt="${movie.title}" style="
          width:100%;
          border-radius:18px;
          box-shadow:0 15px 40px rgba(0,0,0,0.7);
        ">
      </div>

      <!-- Info -->
      <div style="flex:1; min-width:250px;">

        <h2 style="
          font-size:2em;
          margin-bottom:15px;
          background:linear-gradient(90deg,#ff8c00,#ff2a68);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        ">
          ${movie.title}
        </h2>

        <!-- Rating Box -->
        <div style="
          display:inline-block;
          background:#1db954;
          padding:8px 14px;
          border-radius:10px;
          font-weight:bold;
          margin-bottom:15px;
        ">
          ⭐ IMDb ${movie.imdb}
        </div>

        <div style="color:#ccc; line-height:1.8; font-size:14px;">
          <div><strong style="color:#fff;">Release:</strong> ${movie.release_date}</div>
          <div><strong style="color:#fff;">Director:</strong> ${movie.director}</div>
          <div><strong style="color:#fff;">Runtime:</strong> ${movie.runtime}</div>
          <div><strong style="color:#fff;">Genre:</strong> ${movie.genre}</div>
        </div>

      </div>
    </div>

    <!-- Description Section -->
    <div style="
      margin-top:25px;
      background:rgba(255,255,255,0.03);
      padding:18px;
      border-radius:15px;
      line-height:1.7;
      color:#eee;
      font-size:15px;
    ">
      <strong style="color:#fff;">Description</strong><br><br>
      ${movie.description}
    </div>

    <!-- Player Buttons -->
    <div id="players" style="
      margin-top:25px;
      display:flex;
      flex-wrap:wrap;
      gap:15px;
    ">
      ${playersHTML}
    </div>

    <!-- Video Player -->
    <div id="videoPlayer" style="margin-top:30px;"></div>

  </div>
`;
