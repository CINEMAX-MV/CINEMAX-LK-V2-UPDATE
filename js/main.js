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

    loadLast10Slider();
    displayMovies();
    updateButtons();
});

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

/* =====================================================
   ✅ 3 MOVIES SLIDER (CENTER BIG)
===================================================== */
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

        slide.style.background = `
            linear-gradient(to top, rgba(0,0,0,0.7), transparent),
            url('${movie.image}') center/cover no-repeat
        `;

        slide.onclick = () => {
            window.location.href = `movie.html?id=${realId}`;
        };

        slide.innerHTML = `
            <div class="slide-content">
                <h3>${movie.title}</h3>
            </div>
        `;

        slider.appendChild(slide);

        const dot = document.createElement("span");
        dot.className = "dot";
        dotsContainer.appendChild(dot);
    });

    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    function showSlide(index){

        const slideWidth = slides[0].offsetWidth + 20;

        slider.scrollTo({
            left: slideWidth * index - slideWidth,
            behavior: "smooth"
        });

        slides.forEach((slide, i) => {
            slide.classList.remove("active","side");

            if(i === index){
                slide.classList.add("active");
            }else if(i === index - 1 || i === index + 1){
                slide.classList.add("side");
            }
        });

        dots.forEach(d => d.classList.remove("active"));
        if(dots[index]) dots[index].classList.add("active");
    }

    function nextSlide(){
        currentIndex++;
        if(currentIndex >= slides.length) currentIndex = 0;
        showSlide(currentIndex);
    }

    // INIT
    showSlide(currentIndex);

    // AUTO PLAY
    let sliderInterval = setInterval(nextSlide, 3500);

    slider.addEventListener("mouseenter", () => clearInterval(sliderInterval));
    slider.addEventListener("mouseleave", () => {
        sliderInterval = setInterval(nextSlide, 3500);
    });

    // DOT CLICK
    dots.forEach((dot, index) => {
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // MOBILE SWIPE
    let startX = 0;

    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;

        if(startX - endX > 50){
            nextSlide();
        } else if(endX - startX > 50){
            currentIndex--;
            if(currentIndex < 0) currentIndex = slides.length - 1;
            showSlide(currentIndex);
        }
    });
}

/* ===== SEARCH FUNCTION ===== */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");

    if(searchInput){
        searchInput.addEventListener("input", function(){
            const searchValue = this.value.toLowerCase();

            const filteredMovies = moviesData.filter(movie =>
                movie.title.toLowerCase().includes(searchValue)
            );

            displaySearchResults(filteredMovies);
        });
    }
});

/* ===== Display Search Results ===== */
function displaySearchResults(filteredMovies){
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = "";

    filteredMovies.forEach(movie => {
        const realId = moviesData.indexOf(movie);

        movieList.innerHTML += `
            <div class="movie-card" onclick="openMovie(${realId})">
                <img src="${movie.image}" alt="${movie.title}">
                <h4>${movie.title}</h4>
            </div>
        `;
    });
}

// Toggle Problems form
function toggleProblems(){
    const form = document.getElementById('problemsForm');
    form.style.display = form.style.display === "block" ? "none" : "block";
}

// Send Problems info via WhatsApp
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
