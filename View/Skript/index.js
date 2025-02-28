function loadLayout() {
    fetch("headerNoLogIn.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            setupNavLinks(); // Navigation aktivieren, nachdem der Header geladen wurde
        })
        .catch(error => console.error("Fehler beim Laden des Headers:", error));

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data)
        .catch(error => console.error("Fehler beim Laden des Footers:", error));
}

// Dynamische Navigation aktivieren
function setupNavLinks() {
    document.querySelectorAll("#header a[data-page]").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            loadPage(link.getAttribute("href"));
        });
    });
}

document.addEventListener("DOMContentLoaded", loadLayout);
