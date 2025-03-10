/**
 * Wartet, bis das DOM geladen ist, und initialisiert den Shop.
 */
document.addEventListener("DOMContentLoaded", function() {
    /** @const {HTMLElement} shopContainer - Der Container für die Shop-Artikel */
    const shopContainer = document.getElementById("shop-container");

    /** @const {Array<Object>} items - Die verfügbaren Shop-Artikel */
    const items = [
        { name: "Paket 1", amount: 200, price: "9.99€" },
        { name: "Paket 2", amount: 500, price: "24.99€" },
        { name: "Paket 3", amount: 1200, price: "49.99€" },
        { name: "Paket 4", amount: 5000, price: "149.99€" },
        { name: "Paket 5", amount: 10000, price: "399.99€" }
    ];

    // Erzeugt die Shop-Elemente dynamisch
    items.forEach(item => {
        /** @const {HTMLElement} box - Das Shop-Element für ein Paket */
        const box = document.createElement("div");
        box.classList.add("shop-box");
        box.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.amount} Chips</p>
            <p><strong>${item.price}</strong></p>
            <button class="buy-button" data-amount="${item.amount}">Kaufen</button>
        `;
        shopContainer.appendChild(box);
    });

    // Fügt Event-Listener zu den Kauf-Buttons hinzu
    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", function() {
            const amount = parseInt(this.getAttribute("data-amount"), 10);
            confirmPurchase(amount);
        });
    });
});

/**
 * Fragt den Benutzer, ob er den Kauf bestätigen möchte, und aktualisiert die Credits.
 * @param {number} amount - Die Anzahl der gekauften Chips
 */
function confirmPurchase(amount) {
    if (!confirm(`Möchtest du wirklich ${amount} Chips kaufen?`)) {
        return;
    }

    /** @const {string|null} userData - Die gespeicherten Benutzerdaten */
    const userData = sessionStorage.getItem("loggedInUser");
    if (!userData) {
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "logIn.html";
        return;
    }

    /** @const {Object} user - Das Benutzerobjekt aus dem Speicher */
    const user = JSON.parse(userData);
    user.credits += amount; // Erhöht die Credits um den gekauften Betrag
    sessionStorage.setItem("loggedInUser", JSON.stringify(user)); // Speichert die aktualisierten Daten

    // Serverseitige Aktualisierung der Credits
    updateCreditsOnServer(user.username, user.credits)
        .then(() => {
            alert("Kauf erfolgreich! Deine neuen Credits: " + user.credits);
        })
        .catch(error => {
            console.error("Fehler beim Aktualisieren der Credits:", error);
            alert("Fehler beim Kauf. Bitte versuche es später erneut.");
        });
}
