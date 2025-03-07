document.addEventListener("submit", async (e) => {
    console.log("Login-Skript aktiviert");

    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("FEHLER: Formular mit ID #login-form nicht gefunden!");
        return;
    }


        e.preventDefault(); // WICHTIG: Standardverhalten deaktivieren
        console.log("Formular-Submit abgefangen");

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        console.log("Eingaben:", { username, password });

        try {
            // API-Request senden
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            // Antwort verarbeiten
            const result = await response.json();

            if (!response.ok) {
                console.error("Login fehlgeschlagen:", result.message);
                alert("Fehler: " + result.message);
                return;
            }

            // Erfolg: Weiterleitung mit Verzögerung
            console.log("Erfolgreich eingeloggt:", result.user);
            sessionStorage.setItem("loggedInUser", JSON.stringify(result.user));
            window.location.href = "index.html";

        } catch (error) {
            console.error("Kritischer Fehler:", error);
            alert("Server nicht erreichbar!");
        }

});