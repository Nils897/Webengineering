// Funktion zum Laden des Headers und Footers
function loadLayout() {
    fetch("header.html")
        .then(response => response.text())
        .then(data => document.getElementById("header").innerHTML = data);

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data);
}

// Funktion zum Laden von Seiten in den Hauptinhalt
function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => document.getElementById("content").innerHTML = data);
}

// Lädt beim Start das Layout
document.addEventListener("DOMContentLoaded", loadLayout);
