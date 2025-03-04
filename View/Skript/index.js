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
