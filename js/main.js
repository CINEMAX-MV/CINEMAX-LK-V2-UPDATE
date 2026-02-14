function toggleMenu(){
let sidebar = document.getElementById("sidebar");

sidebar.style.left =
sidebar.style.left === "0px" ? "-250px" : "0px";
}

/* Load Movies */

fetch("data/movies.json")
.then(res => res.json())
.then(data => {

let movieList = document.getElementById("movieList");

data.forEach((movie,index)=>{

movieList.innerHTML += `
<div class="movie-card"
onclick="openMovie(${index})">

<img src="${movie.image}">
<h4>${movie.title}</h4>

</div>
`;

});

});

function openMovie(id){
window.location.href = `movie.html?id=${id}`;
}
fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {
    const carousel = document.getElementById("lastMoviesCarousel");

    // Get last 10 movies
    const lastMovies = data.slice(-10);

    lastMovies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
        <p>${movie.genre} | සිංහල</p>
        <h3>${movie.title}</h3>
        <a href="${movie.players[0].link}" target="_blank">▶ Watch / Download</a>
      `;
      carousel.appendChild(card);
    });

    // Auto scroll
    let scrollAmount = 0;
    let scrollStep = 1;
    const scrollMax = carousel.scrollWidth - carousel.clientWidth;

    function autoScroll() {
      scrollAmount += scrollStep;
      if(scrollAmount >= scrollMax || scrollAmount <= 0) scrollStep *= -1;
      carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      requestAnimationFrame(autoScroll);
    }

    autoScroll();

    // Pause on hover
    carousel.addEventListener("mouseenter", () => { scrollStep = 0; });
    carousel.addEventListener("mouseleave", () => { scrollStep = 1; });
  });
