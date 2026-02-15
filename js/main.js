function toggleMenu(){
    let sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
}

/* ===== Pagination Variables ===== */
let currentPage = 1;
const moviesPerPage = 12;
let moviesData = [];

/* ===== Load Movies from JSON ===== */
fetch("data/movies.json")
.then(res => res.json())
.then(data => {
    moviesData = data;
    displayMovies();
    updateButtons();
});

/* ===== Display Movies Function ===== */
function displayMovies(){
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = moviesData.slice(start, end);

    paginatedMovies.forEach((movie,index) => {
        movieList.innerHTML += `
            <div class="movie-card" onclick="openMovie(${start + index})">
                <img src="${movie.image}" alt="${movie.title}">
                <h4>${movie.title}</h4>
            </div>
        `;
    });
}

/* ===== Open Movie Function ===== */
function openMovie(id){
    window.location.href = `movie.html?id=${id}`;
}

/* ===== Pagination Buttons ===== */
function changePage(direction){
    const totalPages = Math.ceil(moviesData.length / moviesPerPage);
    currentPage += direction;

    if(currentPage < 1) currentPage = 1;
    if(currentPage > totalPages) currentPage = totalPages;

    displayMovies();
    updateButtons();
}

/* ===== Update Buttons ===== */
function updateButtons(){
    const totalPages = Math.ceil(moviesData.length / moviesPerPage);

    const pageInfo = document.getElementById("pageInfo");
    if(pageInfo){
        pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    }

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if(prevBtn) prevBtn.disabled = currentPage === 1;
    if(nextBtn) nextBtn.disabled = currentPage === totalPages;
}

fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {

    const slider = document.getElementById("movieSlider");
    const dotsContainer = document.getElementById("sliderDots");

    // Last 10 Movies (අන්තිමට add කරපු 10)
    const lastMovies = data.slice(-10).reverse();

    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    lastMovies.forEach((movie, index) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
        <div class="slide-info">
          <h3>${movie.title}</h3>
          <p>${movie.release || ""}</p>
        </div>
      `;
      slider.appendChild(slide);

      // dots
      const dot = document.createElement("span");
      dot.className = "dot";
      if (index === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });

    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    function showSlide(index) {
      slider.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    function nextSlide() {
      currentIndex++;
      if (currentIndex >= slides.length) currentIndex = 0;
      showSlide(currentIndex);
    }

    // Auto play every 4 seconds
    setInterval(nextSlide, 4000);
  });
