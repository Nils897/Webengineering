/**
 * Event-Listener für das Absenden des Login-Formulars.
 * Fängt den Submit-Event ab, sendet die Anmeldedaten an die API und verarbeitet die Antwort.
 */
document.addEventListener("submit", async (e) => {
    console.log("Login-Skript aktiviert");

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("FEHLER: Formular mit ID #login-form nicht gefunden!");
        return;
    }

    e.preventDefault(); // Standardverhalten deaktivieren
    console.log("Formular-Submit abgefangen");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log("Eingaben:", { username, password });

    try {
        /**
         * Sendet die Login-Daten an den Server.
         *
         * @const {Response} response - Die Antwort des Servers.
         */
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        /** @const {Object} result - Die JSON-Antwort des Servers. */
        const result = await response.json();

        if (!response.ok) {
            console.error("Login fehlgeschlagen:", result.message);
            alert("Fehler: " + result.message);
            return;
        }

        // Erfolg: Benutzer speichern und weiterleiten
        console.log("Erfolgreich eingeloggt:", result.user);
        sessionStorage.setItem("loggedInUser", JSON.stringify(result.user));
        window.location.href = "index.html";

    } catch (error) {
        console.error("Kritischer Fehler:", error);
        alert("Server nicht erreichbar!");
    }
});
