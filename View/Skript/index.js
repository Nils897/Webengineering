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

function setupNavLinks() {
    document.querySelectorAll("#header a[data-page]").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = link.getAttribute("href");

            if (page === "index.html") {
                window.location.href = "index.html"; // Startseite komplett neu laden
            } else {
                loadPage(page);
            }
        });
    });
}


document.addEventListener("DOMContentLoaded", loadLayout);
