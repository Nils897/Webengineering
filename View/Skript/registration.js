document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordWdh = document.getElementById("passwordWdh").value;

    if (password !== passwordWdh) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, username, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Speichere Benutzerdaten im sessionStorage
            sessionStorage.setItem("loggedInUser", JSON.stringify(result.user));
            // Weiterleitung zur Startseite
            window.location.href = "index.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Fehler bei der Verbindung zum Server");
    }
});