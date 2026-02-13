let params = new URLSearchParams(window.location.search);
let movieId = params.get("id");

fetch("data/movies.json")
.then(res => res.json())
.then(data => {

let movie = data[movieId];

document.getElementById("movieDetails").innerHTML = `
<h2>${movie.title}</h2>

<img src="${movie.image}" width="300">

<p>${movie.description}</p>

<a class="btn" href="${movie.watch}" target="_blank">Watch</a>

<a class="btn" href="${movie.download}" target="_blank">Download</a>
`;

});
