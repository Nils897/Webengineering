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
}

// Warten, bis das DOM geladen ist
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProfile);
} else {
    initProfile();
}