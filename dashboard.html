<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sinhala Movies Pro</title>
<style>
/* ===== Reset & Base ===== */
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
body{background:#0b0b0b;color:#fff;}
h1{padding:20px;text-align:center;color:#00ffd5;font-size:2em;letter-spacing:1px;}

/* ===== Years ===== */
.years{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:12px;padding:15px;justify-items:center;}
.year-btn{background:#1c1c1c;color:#fff;padding:10px 0;width:70px;text-align:center;border-radius:6px;cursor:pointer;transition:0.3s;font-weight:bold;}
.year-btn:hover{background:#00ffd5;color:#000;transform:scale(1.1);}

/* ===== Movies Grid ===== */
.movies{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:15px;padding:15px;}
.card{background:#1a1a1a;border-radius:10px;overflow:hidden;cursor:pointer;transition:0.3s;position:relative;}
.card:hover{transform:scale(1.05);box-shadow:0 0 15px #00ffd5;}
.card img{width:100%;height:260px;object-fit:cover;}
.card .info{padding:10px;}
.card .info h3{font-size:16px;margin-bottom:5px;color:#00ffd5;}
.card .info p{font-size:0.85em;color:#aaa;margin-bottom:5px;}
.card .rating{color:#ffd700;font-weight:bold;}

/* ===== Modal ===== */
.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);justify-content:center;align-items:center;animation:fadeIn 0.3s;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal-content{background:#1c1c1c;width:90%;max-width:600px;border-radius:10px;padding:20px;position:relative;animation:slideUp 0.3s;}
@keyframes slideUp{from{transform:translateY(50px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.close{position:absolute;top:10px;right:15px;font-size:22px;color:#ff4c4c;cursor:pointer;transition:0.3s;}
.close:hover{transform:scale(1.2);}
.modal img{width:100%;border-radius:8px;margin-bottom:15px;}
.btn{display:inline-block;margin-top:10px;padding:10px 15px;background:#00ffd5;color:black;text-decoration:none;border-radius:6px;font-weight:bold;transition:0.3s;}
.btn:hover{background:#00e0c0;}

/* ===== Genres Tags ===== */
.genres{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0;}
.genres span{background:#00ffd5;color:#000;padding:5px 10px;border-radius:5px;font-size:0.8em;font-weight:bold;}

/* ===== Responsive ===== */
@media(max-width:600px){
  .card img{height:180px;}
  .year-btn{width:60px;padding:8px 0;font-size:0.9em;}
  h1{font-size:1.5em;}
}
</style>
</head>
<body>

<h1>🎬 Sinhala Movies Pro</h1>

<div class="years" id="yearContainer"></div>
<div class="movies" id="moviesContainer">Select a year</div>

<div class="modal" id="movieModal">
  <div class="modal-content" id="modalContent">
    <span class="close" onclick="closeModal()">✖</span>
  </div>
</div>

<script>
const API_KEY = "664258113a1e4067d9a47099ac78e3a4";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";

// Generate Years 2000-2026
const yearContainer = document.getElementById("yearContainer");
for(let y=2026;y>=2000;y--){
  const btn=document.createElement("div");
  btn.className="year-btn";
  btn.innerText=y;
  btn.onclick=()=>loadMoviesByYear(y);
  yearContainer.appendChild(btn);
}

// Load Movies
function loadMoviesByYear(year){
  const url=`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&with_original_language=si&sort_by=popularity.desc`;
  fetch(url)
    .then(res=>res.json())
    .then(data=>{
      const container=document.getElementById("moviesContainer");
      container.innerHTML="";
      if(data.results.length===0){container.innerHTML="No Sinhala movies found for this year.";return;}
      data.results.forEach(movie=>{
        const ratingStars = '⭐'.repeat(Math.round(movie.vote_average/2));
        container.innerHTML+=`
          <div class="card" onclick="showDetails(${movie.id})">
            <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <div class="info">
              <h3>${movie.title}</h3>
              <p class="rating">${ratingStars} (${movie.vote_average})</p>
              <p>${movie.release_date}</p>
            </div>
          </div>
        `;
      });
    });
}

// Show Details
function showDetails(id){
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,genres`)
    .then(res=>res.json())
    .then(movie=>{
      const trailer = movie.videos.results.find(v=>v.type==="Trailer");
      const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "#";
      const genres = movie.genres.map(g=>`<span>${g.name}</span>`).join(' ');

      document.getElementById("modalContent").innerHTML=`
        <span class="close" onclick="closeModal()">✖</span>
        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
        <h2>${movie.title}</h2>
        <div class="genres">${genres}</div>
        <p><b>Release:</b> ${movie.release_date}</p>
        <p><b>Rating:</b> ⭐ ${movie.vote_average}</p>
        <p>${movie.overview}</p>
        ${trailer ? `<a class="btn" href="${trailerUrl}" target="_blank">▶ Watch Trailer</a>` : ""}
      `;
      document.getElementById("movieModal").style.display="flex";
    });
}

function closeModal(){document.getElementById("movieModal").style.display="none";}
</script>

</body>
</html>
