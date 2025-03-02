document.addEventListener("DOMContentLoaded", function() {
    const shopContainer = document.getElementById("shop-container");

    const items = [
        { name: "Paket 1", amount: "200 Chips", price: "9.99€" },
        { name: "Paket 2", amount: "500 Chips", price: "24.99€" },
        { name: "Paket 3", amount: "1.200 Chips", price: "49.99€" },
        { name: "Paket 4", amount: "5.000 Chips", price: "149.99€" },
        { name: "Paket 5", amount: "10.000 Chips", price: "399.99€" }
    ];

    items.forEach(item => {
        const box = document.createElement("div");
        box.classList.add("shop-box");
        box.innerHTML = `
            <h2>${item.name}</h2>
            <p>${item.amount}</p>
            <p><strong>${item.price}</strong></p>
        `;
        shopContainer.appendChild(box);
    });
});
