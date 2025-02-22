function loadLayout() {
    fetch("header.html")
        .then(response => response.text())
        .then(data => document.getElementById("header").innerHTML = data);

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data);
}

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => document.getElementById("content").innerHTML = data);
}

document.addEventListener("DOMContentLoaded", loadLayout);
