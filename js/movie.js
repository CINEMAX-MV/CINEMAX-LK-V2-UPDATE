<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Movie Details</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

<style>
body{
  margin:0;
  background:#0f0f0f;
  font-family:'Poppins',sans-serif;
  color:white;
}

/* HERO */
.hero{
  height:320px;
  background-size:cover;
  background-position:center;
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
}

.hero::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(to top,#0f0f0f 20%,transparent 80%);
}

.play-btn{
  position:relative;
  z-index:2;
  width:80px;
  height:80px;
  border-radius:50%;
  background:rgba(255,255,255,0.2);
  backdrop-filter:blur(10px);
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:30px;
  cursor:pointer;
  transition:0.3s;
}

.play-btn:hover{
  background:#ff2a68;
}

/* CARD */
.card{
  margin:-60px 15px 20px;
  background:rgba(255,255,255,0.05);
  backdrop-filter:blur(15px);
  border-radius:20px;
  padding:20px;
  box-shadow:0 10px 40px rgba(0,0,0,0.6);
}

.top{
  display:flex;
  gap:20px;
}

.poster{
  width:140px;
  border-radius:15px;
}

.info h1{
  margin:0;
  font-size:22px;
}

.meta{
  font-size:13px;
  color:#bbb;
  margin-top:5px;
}

.rating{
  margin-top:10px;
  display:flex;
  align-items:center;
  gap:10px;
}

.rating span{
  background:#1db954;
  padding:6px 10px;
  border-radius:8px;
  font-weight:bold;
}

/* BUTTONS */
.sources{
  margin-top:20px;
  display:flex;
  flex-wrap:wrap;
  gap:12px;
}

.btn{
  padding:10px 18px;
  border:none;
  border-radius:10px;
  background:#1db954;
  color:white;
  cursor:pointer;
  font-weight:bold;
  transition:0.3s;
}

.btn:hover{
  background:#17a74a;
}

/* DESCRIPTION */
.description{
  margin-top:20px;
  color:#ccc;
  line-height:1.6;
  font-size:14px;
}

/* PLAYER */
#videoPlayer{
  margin-top:25px;
}

#videoPlayer iframe{
  width:100%;
  height:400px;
  border:none;
  border-radius:15px;
}

@media(max-width:600px){
  .top{
    flex-direction:column;
    align-items:center;
    text-align:center;
  }
}
</style>
</head>
<body>

<div id="movieDetails"></div>

<script>
fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {

    let params = new URLSearchParams(window.location.search);
    let movieId = params.get("id");
    let movie = data[movieId];

    let playersHTML = "";

    movie.players.forEach(player => {
      playersHTML += `
        <button class="btn" onclick="loadPlayer('${player.link}')">
          ${player.name}
        </button>
      `;
    });

    if(movie.players.length > 0){
      playersHTML += `
        <button class="btn" onclick="downloadMovie('${movie.players[0].link}')">
          Download
        </button>
      `;
    }

    document.getElementById("movieDetails").innerHTML = `

      <div class="hero" style="background-image:url('${movie.image}')">
        <div class="play-btn" onclick="loadPlayer('${movie.players[0]?.link || ""}')">
          ▶
        </div>
      </div>

      <div class="card">

        <div class="top">
          <img src="${movie.image}" class="poster">

          <div class="info">
            <h1>${movie.title}</h1>
            <div class="meta">${movie.release_date} • ${movie.runtime}</div>
            <div class="meta">${movie.genre}</div>

            <div class="rating">
              <span>${movie.imdb}</span>
              IMDb Rating
            </div>
          </div>
        </div>

        <div class="sources">
          ${playersHTML}
        </div>

        <div class="description">
          ${movie.description}
        </div>

        <div id="videoPlayer"></div>

      </div>
    `;
  });

function loadPlayer(link){
  let embedLink = link.replace("/view", "/preview");
  document.getElementById("videoPlayer").innerHTML = `
    <iframe src="${embedLink}" allowfullscreen></iframe>
  `;
}

function downloadMovie(link){
  let downloadLink = link.replace("/preview", "/view");
  window.open(downloadLink, "_blank");
}
</script>

</body>
</html>
