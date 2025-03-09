document.addEventListener("DOMContentLoaded", function() {
    const shopContainer = document.getElementById("shop-container");

    const items = [
        { name: "Paket 1", amount: 200, price: "9.99€" },
        { name: "Paket 2", amount: 500, price: "24.99€" },
        { name: "Paket 3", amount: 1200, price: "49.99€" },
        { name: "Paket 4", amount: 5000, price: "149.99€" },
        { name: "Paket 5", amount: 10000, price: "399.99€" }
    ];

    items.forEach(item => {
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

    // Event-Listener für alle Buttons
    document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", function() {
            const amount = parseInt(this.getAttribute("data-amount"));
            confirmPurchase(amount);
        });
    });
});

// Funktion für den Kaufprozess
function confirmPurchase(amount) {
    if (!confirm(`Möchtest du wirklich ${amount} Chips kaufen?`)) {
        return;
    }

    const userData = sessionStorage.getItem("loggedInUser");
    if (!userData) {
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "logIn.html";
        return;
    }

    const user = JSON.parse(userData);
    user.credits += amount;
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    // Serverseitige Aktualisierung der Credits
    updateCreditsOnServer(user.username, user.credits)
        .then(response => {
            alert("Kauf erfolgreich! Deine neuen Credits: " + user.credits);
        })
        .catch(error => {
            console.error("Fehler beim Aktualisieren der Credits:", error);
            alert("Fehler beim Kauf. Bitte versuche es später erneut.");
        });
}
