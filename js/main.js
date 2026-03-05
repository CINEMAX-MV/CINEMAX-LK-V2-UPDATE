function toggleMenu(){
    let sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
}

/* ===== Pagination Variables ===== */
let currentPage = 1;
const moviesPerPage = 12;
let moviesData = [];
let seriesData = [];

/* ===== Load Movies + Series JSON ===== */
Promise.all([
    fetch("data/movies.json").then(res => res.json()),
    fetch("data/series.json").then(res => res.json())
])
.then(([movies, series]) => {

    moviesData = movies;
    seriesData = series;

    loadLast10Slider();
    displayMovies();
    updateButtons();
})
.catch(error => console.log("JSON Load Error:", error));


/* ===== Display Movies Function ===== */
function displayMovies(){
    const movieList = document.getElementById("movieList");
    if(!movieList) return;

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

/* ===== Open Movie ===== */
function openMovie(id){
    window.location.href = `movie.html?id=${id}`;
}

/* ===== Open Series ===== */
function openSeries(id){
    window.location.href = `series.html?id=${id}`;
}

/* ===== Pagination ===== */
function changePage(direction){
    const totalPages = Math.ceil(moviesData.length / moviesPerPage);
    currentPage += direction;

    if(currentPage < 1) currentPage = 1;
    if(currentPage > totalPages) currentPage = totalPages;

    displayMovies();
    updateButtons();
}

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


/* ===== LAST 10 MOVIES SLIDER ===== */
function loadLast10Slider(){

    const slider = document.getElementById("movieSlider");
    const dotsContainer = document.getElementById("sliderDots");

    if(!slider || !dotsContainer) return;

    const lastMovies = moviesData.slice(-10).reverse();

    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    lastMovies.forEach((movie, index) => {

        const realId = moviesData.length - 1 - index;

        const slide = document.createElement("div");
        slide.className = "slide";

        slide.onclick = () => {
            window.location.href = `movie.html?id=${realId}`;
        };

        slide.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <div class="slide-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date || ""}</p>
            </div>
        `;

        slider.appendChild(slide);

        const dot = document.createElement("span");
        dot.className = "dot";
        if(index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });
}


/* ===== SEARCH FUNCTION ===== */
document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");

    if(searchInput){
        searchInput.addEventListener("input", function(){

            const searchValue = this.value.toLowerCase();

            if(searchValue === ""){
                displayMovies();
                updateButtons();
                return;
            }

            const filteredMovies = moviesData.filter(movie =>
                movie.title.toLowerCase().includes(searchValue)
            );

            const filteredSeries = seriesData.filter(series =>
                series.title.toLowerCase().includes(searchValue)
            );

            displaySearchResults(filteredMovies, filteredSeries);
        });
    }
});


/* ===== Display Search Results ===== */
function displaySearchResults(filteredMovies, filteredSeries){

    const movieList = document.getElementById("movieList");
    if(!movieList) return;

    movieList.innerHTML = "";

    // Movies
    filteredMovies.forEach(movie => {
        const realId = moviesData.indexOf(movie);

        movieList.innerHTML += `
            <div class="movie-card" onclick="openMovie(${realId})">
                <img src="${movie.image}" alt="${movie.title}">
                <h4>${movie.title}</h4>
            </div>
        `;
    });

    // Series
    filteredSeries.forEach(series => {
        const realId = seriesData.indexOf(series);

        movieList.innerHTML += `
            <div class="movie-card" onclick="openSeries(${realId})">
                <img src="${series.image}" alt="${series.title}">
                <h4>${series.title} (Series)</h4>
            </div>
        `;
    });
}


/* ===== Toggle Problems Form ===== */
function toggleProblems(){
    const form = document.getElementById('problemsForm');
    if(form.style.display === "block"){
        form.style.display = "none";
    } else {
        form.style.display = "block";
    }
}


/* ===== Send Problem via WhatsApp ===== */
function sendProblem(){
    const name = document.getElementById('pName').value.trim();
    const user = document.getElementById('pUser').value.trim();
    const email = document.getElementById('pEmail').value.trim();
    const number = document.getElementById('pNumber').value.trim();
    const problem = document.getElementById('pProblem').value.trim();

    if(!name || !user || !email || !number || !problem){
        alert("Please fill all fields!");
        return;
    }

    const message = `🙋 Name: ${name}\n🙇‍♀️ User: ${user}\n🕊️ Email: ${email}\n🔰 Number: ${number}\n🔆 Problem: ${problem}`;
    const whatsappNumber = "94740707157";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

    document.getElementById('pName').value = "";
    document.getElementById('pUser').value = "";
    document.getElementById('pEmail').value = "";
    document.getElementById('pNumber').value = "";
    document.getElementById('pProblem').value = "";
}
