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
