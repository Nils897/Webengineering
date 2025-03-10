/**
 * Lädt das Header- und Footer-Layout basierend auf dem Anmeldestatus des Benutzers.
 * Der Header wird je nach Login-Status aus einer entsprechenden Datei geladen.
 */
function loadLayout() {
    const userData = sessionStorage.getItem("loggedInUser");
    const isLoggedIn = !!userData;

    const headerFile = isLoggedIn ? "headerLoggedIn.html" : "headerNoLogIn.html";

    fetch(headerFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            setupNavLinks(); // Event-Listener für Navigationslinks setzen
        })
        .catch(error => console.error("Fehler beim Laden des Headers:", error));

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data)
        .catch(error => console.error("Fehler beim Laden des Footers:", error));
}

/**
 * Setzt Event-Listener für Navigationslinks im Header.
 * Die Links verwenden `data-page`, um das Ziel der Navigation zu bestimmen.
 */
function setupNavLinks() {
    document.querySelectorAll("#header a[data-page]").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href");
            loadPage(page);
        });
    });
}

/**
 * Leitet den Benutzer zur angegebenen Seite weiter.
 *
 * @param {string} page - Die URL der Seite, die geladen werden soll.
 */
function loadPage(page) {
    window.location.href = page;
}

// Lädt das Layout, sobald die Seite vollständig geladen ist
document.addEventListener("DOMContentLoaded", loadLayout);
