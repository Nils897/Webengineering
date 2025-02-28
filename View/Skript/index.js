// Lädt den Header und Footer
function loadLayout() {
    fetch("header.html")
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

// Lädt eine neue Seite in den #content-Bereich, ohne die gesamte Seite zu reloaden
function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
            window.history.pushState({ page: page }, "", page); // URL in der Adresszeile aktualisieren
        })
        .catch(error => console.error("Fehler beim Laden der Seite:", error));
}

// Aktiviert das dynamische Laden für Links im Header/Footer
function setupNavLinks() {
    document.body.addEventListener("click", function (event) {
        if (event.target.tagName === "A" && event.target.hasAttribute("data-page")) {
            event.preventDefault(); // Standardseitenwechsel verhindern
            const page = event.target.getAttribute("href"); // Seite aus href holen
            loadPage(page);
        }
    });
}

// Stellt sicher, dass die richtige Seite geladen wird, wenn der Benutzer vor/zurück klickt
window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    }
});

// Startet das Layout-Laden, wenn die Seite geladen ist
document.addEventListener("DOMContentLoaded", loadLayout);
