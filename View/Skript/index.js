function loadLayout() {
    const userData = sessionStorage.getItem("loggedInUser"); // localStorage statt sessionStorage
    const isLoggedIn = !!userData;

    const headerFile = isLoggedIn ? "headerLoggedIn.html" : "headerNoLogIn.html";

    fetch(headerFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            setupNavLinks(); // WICHTIG: Event-Listener neu setzen
        })
        .catch(error => console.error("Fehler beim Header:", error));

    fetch("footer.html")
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data)
        .catch(error => console.error("Fehler beim Footer:", error));
}

// Event-Listener für Seitenänderungen
function setupNavLinks() {
    document.querySelectorAll("#header a[data-page]").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href");
            loadPage(page);
        });
    });
}

function loadPage(page) {
    window.location.href = page;
}

document.addEventListener("DOMContentLoaded", loadLayout);