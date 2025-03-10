function initProfile() {
    const userData = sessionStorage.getItem("loggedInUser");

    if (!userData) {
        console.error("Kein eingeloggter Benutzer gefunden!");
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "login.html"; // Zurück zur Login-Seite
        return;
    }

    const user = JSON.parse(userData);

    // Setze die Benutzerdaten in die entsprechenden span-Elemente
    document.getElementById("firstNameHeader").textContent = user.firstName;
    document.getElementById("lastNameHeader").textContent = user.lastName;
    document.getElementById("firstName").textContent = user.firstName;
    document.getElementById("lastName").textContent = user.lastName;
    document.getElementById("username").textContent = user.username;
    document.getElementById("email").textContent = user.email;
    document.getElementById("credits").textContent = user.credits + " Credits";

    document.getElementById("Logout").addEventListener("click", logout);
}

function logout(){
    // Entferne den eingeloggten Benutzer
    sessionStorage.removeItem("loggedInUser");
    // Optional: eine Bestätigung oder Meldung anzeigen
    alert("Du wurdest ausgeloggt.");
    // Weiterleiten zur Login-Seite
    window.location.href = "index.html";
}

// Warten, bis das DOM geladen ist
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProfile);
} else {
    initProfile();
}