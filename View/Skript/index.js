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
    const links = document.querySelectorAll("#header a[data-page]");
    console.log("Gefundene Links:", links);

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = link.getAttribute("href");
            console.log("Link wurde geklickt:", page); // Prüft, ob Klick erkannt wird

            if (page === "index.html") {
                console.log("Lade index.html neu...");
                window.location.href = "index.html"; // Startseite neu laden
            } else {
                console.log("Lade Seite:", page);
                loadPage(page);
            }
        });
    });
}


function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
        })
        .catch(error => console.error("Fehler beim Laden der Seite:", error));
}


document.addEventListener("DOMContentLoaded", loadLayout);
