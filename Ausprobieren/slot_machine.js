const diamant = "../View/img/slot_machine_img/Slot_Machine_Diamant.png";
const flame =  "../View/img/slot_machine_img/Slot_Machine_Flamme.png";
const moneybag = "../View/img/slot_machine_img/Slot_Machine_Geldsack.png";
const bell =  "../View/img/slot_machine_img/Slot_Machine_Glocke.png";
const heart =   "../View/img/slot_machine_img/Slot_Machine_Herz.png";
const card =  "../View/img/slot_machine_img/Slot_Machine_Karte.png";
const cherry = "../View/img/slot_machine_img/Slot_Machine_Kirsche.png";
const cloverleaf =  "../View/img/slot_machine_img/Slot_Machine_Kleeblatt.png";
const star =  "../View/img/slot_machine_img/Slot_Machine_Stern.png";
const dice =  "../View/img/slot_machine_img/Slot_Machine_Würfel.png";
const symbols = [diamant, flame, bell, heart , card, star, cloverleaf, dice, moneybag, cherry];

document.addEventListener("DOMContentLoaded", function() {
    let ids = ["reel1", "reel2", "reel3"];
    ids.forEach(id => {
        let img = document.createElement("img");
        img.src = symbols[Math.floor(Math.random() * symbols.length)];
        img.width = 60;
        img.height = 60;
        document.getElementById(id).appendChild(img);
    });
});

function spin() {
    let symbolArray = [];
    for (let i = 0; i <= 2; i++) {
        let randomSymbol = Math.floor(Math.random() * symbols.length);
        symbolArray.push(randomSymbol);
    }
    document.querySelectorAll(".reel").forEach((reel, i) => {
        setTimeout(() => {
            reel.classList.add("spin");
            reel.querySelectorAll("img").forEach(img => img.remove());
            let img = document.createElement("img");
            img.src = symbols[symbolArray[i]];
            img.width = 60;
            img.height = 60;
            reel.appendChild(img);
            setTimeout(() => {
                reel.classList.remove("spin");
            }, 500);
        }, i * 200);
    });
    return getResult(symbolArray);
}

function getResult(symbolArray) {
    let result = "";
    if (symbolArray[0] === symbolArray[1] && symbolArray[0] === symbolArray[2] && symbolArray[1] === symbolArray[2]) {
        return result = "Alle Symbole sind gleich";
    }
    else if (symbolArray[0] === symbolArray[1] || symbolArray[0] === symbolArray[2] || symbolArray[1] === symbolArray[2]) {
        return result = "2 Symbole sind gleich";
    }
    else {
        return result = "Keine Symbole sind gleich";
    }
}

function spinReel() {
    document.getElementById("output").innerText = spin();
}