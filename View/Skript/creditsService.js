// creditsService.js

/**
 * Holt die Credits des eingeloggten Benutzers aus dem sessionStorage.
 * Falls kein Benutzer eingeloggt ist, wird eine Fehlermeldung ausgegeben
 * und zur Login-Seite weitergeleitet.
 *
 * @returns {number|undefined} Die Anzahl der Credits oder undefined, wenn kein Benutzer eingeloggt ist.
 */
function getAccountCredits() {
    const userData = sessionStorage.getItem("loggedInUser");
    if (!userData) {
        console.error("Kein eingeloggter Benutzer gefunden!");
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "../logIn.html";
        return;
    }
    const user = JSON.parse(userData);
    return user.credits;
}

/**
 * Aktualisiert die Credits des Benutzers sowohl lokal im sessionStorage
 * als auch auf dem Server.
 *
 * @param {string} username - Der Benutzername des eingeloggten Nutzers.
 * @param {number} credits - Die neue Anzahl an Credits.
 * @returns {Promise<Object|void>} Eine Promise mit der Server-Antwort oder void im Fehlerfall.
 */
function updateCreditsOnServer(username, credits) {
    const userData = sessionStorage.getItem("loggedInUser");
    if (userData) {
        const user = JSON.parse(userData);
        user.credits = credits;
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    return fetch("/api/writeCredits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, credits })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Credits updated on server:", data);
            return data;
        })
        .catch(err => {
            console.error("Error updating credits:", err);
        });
}

window.getAccountCredits = getAccountCredits;
window.updateCreditsOnServer = updateCreditsOnServer;
