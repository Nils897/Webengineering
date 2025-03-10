/**
 * Fügt einen Event-Listener zum Registrierungsformular hinzu, um die Registrierung zu verarbeiten.
 * Die Benutzerdaten werden an den Server gesendet, und bei Erfolg erfolgt eine Weiterleitung.
 */
document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Verhindert das Standard-Formularverhalten

    /** @const {string} firstName - Der Vorname des Benutzers */
    const firstName = document.getElementById("firstName").value;
    /** @const {string} lastName - Der Nachname des Benutzers */
    const lastName = document.getElementById("lastName").value;
    /** @const {string} username - Der gewählte Benutzername */
    const username = document.getElementById("username").value;
    /** @const {string} email - Die E-Mail-Adresse des Benutzers */
    const email = document.getElementById("email").value;
    /** @const {string} password - Das eingegebene Passwort */
    const password = document.getElementById("password").value;
    /** @const {string} passwordWdh - Die Wiederholung des eingegebenen Passworts */
    const passwordWdh = document.getElementById("passwordWdh").value;

    // Überprüfung, ob die Passwörter übereinstimmen
    if (password !== passwordWdh) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    try {
        /** @const {Response} response - Die Antwort des Servers */
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, username, email, password })
        });

        /** @const {Object} result - Das Ergebnis der Serverantwort */
        const result = await response.json();

        if (response.ok) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(result.user)); // Speichert die Benutzerdaten
            window.location.href = "index.html"; // Weiterleitung zur Startseite
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Fehler bei der Verbindung zum Server"); // Fehlerbehandlung
    }
});
