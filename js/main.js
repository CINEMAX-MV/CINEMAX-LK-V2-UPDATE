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

let currentPage = 1;
const moviesPerPage = 12;
let moviesData = [];

// ==========================
// LOAD MOVIES JSON
// ==========================
fetch("data/movies.json")
  .then(res => res.json())
  .then(data => {
    moviesData = data;

    // Load slider last 10
    loadLast10Slider(moviesData);

    // Load movie grid with pagination
    displayMovies(currentPage);
    updatePaginationInfo();
  });


// ==========================
// DISPLAY MOVIES GRID
// ==========================
function displayMovies(page) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;

  const pageMovies = moviesData.slice(startIndex, endIndex);

  pageMovies.forEach((movie, index) => {
    const realId = startIndex + index;

    const movieCard = document.createElement("div");
    movieCard.className = "movie";

    movieCard.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <p>${movie.genre} | සිංහල</p>
      <h3>${movie.title}</h3>
      <a href="movie.html?id=${realId}">▶ View Informations</a>
    `;

    movieList.appendChild(movieCard);
  });

  updatePaginationInfo();
}


// ==========================
// PAGINATION
// ==========================
function changePage(step) {
  const totalPages = Math.ceil(moviesData.length / moviesPerPage);

  currentPage += step;

  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  displayMovies(currentPage);
}

function updatePaginationInfo() {
  const pageInfo = document.getElementById("pageInfo");
  const totalPages = Math.ceil(moviesData.length / moviesPerPage);

  if (pageInfo) {
    pageInfo.innerHTML = `Page ${currentPage} / ${totalPages}`;
  }

  // Disable buttons if needed
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) prevBtn.disabled = (currentPage === 1);
  if (nextBtn) nextBtn.disabled = (currentPage === totalPages);
}


// ==========================
// LAST 10 MOVIES SLIDER
// ==========================
function loadLast10Slider(data) {

  const slider = document.getElementById("movieSlider");
  const dotsContainer = document.getElementById("sliderDots");

  if (!slider || !dotsContainer) return;

  // Last 10 movies
  const lastMovies = data.slice(-10).reverse();

  slider.innerHTML = "";
  dotsContainer.innerHTML = "";

  lastMovies.forEach((movie, index) => {

    // Real id for movie.html
    const realId = data.length - 1 - index;

    const slide = document.createElement("div");
    slide.className = "slide";

    slide.innerHTML = `
      <a href="movie.html?id=${realId}" style="text-decoration:none;">
        <img src="${movie.image}" alt="${movie.title}">
        <div class="slide-info">
          <h3>${movie.title}</h3>
          <p>${movie.release_date || ""}</p>
        </div>
      </a>
    `;

    slider.appendChild(slide);

    // Dots
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
  let sliderInterval = setInterval(nextSlide, 4000);

  // Pause slider on hover
  slider.addEventListener("mouseenter", () => clearInterval(sliderInterval));
  slider.addEventListener("mouseleave", () => {
    sliderInterval = setInterval(nextSlide, 4000);
  });

  // Dot click support
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      showSlide(currentIndex);
    });
  });
}
