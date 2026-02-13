function addMovie(){

let movie = {
title: document.getElementById("title").value,
image: document.getElementById("image").value,
description: document.getElementById("description").value,
watch: document.getElementById("watch").value,
download: document.getElementById("download").value
};

document.getElementById("output").textContent =
JSON.stringify(movie, null, 2);

}
