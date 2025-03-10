/**
 * Initialisiert das Benutzerprofil, indem die Benutzerdaten aus dem SessionStorage geladen
 * und in die entsprechenden HTML-Elemente eingefügt werden.
 * Falls kein Benutzer eingeloggt ist, wird eine Weiterleitung zur Login-Seite durchgeführt.
 */
function initProfile() {
    const userData = sessionStorage.getItem("loggedInUser");

    if (!userData) {
        console.error("Kein eingeloggter Benutzer gefunden!");
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "login.html"; // Zurück zur Login-Seite
        return;
    }

    /** @const {Object} user - Die aus dem SessionStorage gelesenen Benutzerdaten. */
    const user = JSON.parse(userData);

    // Setze die Benutzerdaten in die entsprechenden span-Elemente
    document.getElementById("firstNameHeader").textContent = user.firstName;
    document.getElementById("lastNameHeader").textContent = user.lastName;
    document.getElementById("firstName").textContent = user.firstName;
    document.getElementById("lastName").textContent = user.lastName;
    document.getElementById("username").textContent = user.username;
    document.getElementById("email").textContent = user.email;
    document.getElementById("credits").textContent = `${user.credits} Credits`;

    // Event-Listener für den Logout-Button setzen
    document.getElementById("Logout").addEventListener("click", logout);
}

/**
 * Führt den Logout-Prozess durch, indem die Benutzerdaten aus dem SessionStorage entfernt
 * und der Benutzer zur Startseite weitergeleitet wird.
 */
function logout() {
    sessionStorage.removeItem("loggedInUser"); // Entferne den eingeloggten Benutzer
    alert("Du wurdest ausgeloggt."); // Optional: Eine Bestätigung anzeigen
    window.location.href = "index.html"; // Weiterleiten zur Startseite
}

// Warten, bis das DOM geladen ist, und dann das Profil initialisieren
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProfile);
} else {
    initProfile();
}
