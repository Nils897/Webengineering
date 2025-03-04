function loadLayout() {
    // Überprüfe, ob der Benutzer eingeloggt ist
    localStorage.setItem("isLoggedIn", "true"); // für anmelden
    // für abmelden: localStorage.removeItem("isLoggedIn");

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Wähle den Header je nach Login-Zustand
    const headerFile = isLoggedIn ? "headerLoggedIn.html" : "headerNoLogIn.html";

    // Lade den Header
    fetch(headerFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            setupNavLinks(); // Navigation aktivieren, nachdem der Header geladen wurde
        })
        .catch(error => console.error("Fehler beim Laden des Headers:", error));

    // Lade den Footer
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
            const container = document.getElementById("content");
            container.innerHTML = data;

            // Suche alle Script-Tags im geladenen Inhalt
            const scripts = container.querySelectorAll("script");
            scripts.forEach(oldScript => {
                const newScript = document.createElement("script");
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                // Entferne das alte Script, um Doppelungen zu vermeiden
                oldScript.parentNode.removeChild(oldScript);
                document.body.appendChild(newScript);
            });
        })
        .catch(error => console.error("Fehler beim Laden der Seite:", error));
}

document.addEventListener("DOMContentLoaded", loadLayout);
