// creditsService.js

function getAccountCredits(){
    const userData = sessionStorage.getItem("loggedInUser");
    if (!userData) {
        console.error("Kein eingeloggter Benutzer gefunden!");
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "../../login.html"; // Zurück zur Login-Seite
        return;
    }
    const user = JSON.parse(userData);
    return user.credits;
}

function updateCreditsOnServer(username, credits) {
    // Aktualisiere auch den in sessionStorage gespeicherten Benutzer
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

// Falls du keine Module nutzt, mach die Funktionen global verfügbar:
window.getAccountCredits = getAccountCredits;
window.updateCreditsOnServer = updateCreditsOnServer;
