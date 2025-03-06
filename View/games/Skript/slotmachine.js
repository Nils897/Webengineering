const diamant = "img/slotmachineSymbols/diamant.png";
const flame =  "img/slotmachineSymbols/flame.png";
const moneybag = "img/slotmachineSymbols/moneybag.png";
const bell =  "img/slotmachineSymbols/bell.png";
const heart =   "img/slotmachineSymbols/heart.png";
const card =  "img/slotmachineSymbols/card.png";
const cherry = "img/slotmachineSymbols/cherry.png";
const cloverleaf =  "img/slotmachineSymbols/cloverleaf.png";
const star =  "img/slotmachineSymbols/star.png";
const dice =  "img/slotmachineSymbols/dice.png";
const symbols = [diamant, flame, bell, heart , card, star, cloverleaf, dice, moneybag, cherry];

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".reel").forEach(reel => createReels(reel));
});

function createReels(reelElement) {
    reelElement.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        let container = document.createElement("div");
        container.className = "symbol";
        let img = document.createElement("img");
        let symbolLink = symbols[i % symbols.length];
        img.src = symbolLink;
        img.alt = getAltOfImage(symbolLink);
        img.width = 100;
        img.height = 100;
        container.appendChild(img);
        reelElement.appendChild(container);
    }
}

function getAltOfImage(imgLink) {
    let parts = imgLink.split("/");
    return parts[2];
}

function getRandomSymbolOffset() {
    return Math.floor(Math.random() * 14) * -100;
}

function getVisibleImage(reelContainer) {
    const reel = reelContainer.querySelector('.reel');
    const images = reel.querySelectorAll('.symbol img');
    const containerRect = reelContainer.getBoundingClientRect();

    for (let img of images) {
        const imgRect = img.getBoundingClientRect();

        if (
            imgRect.top >= containerRect.top &&
            imgRect.bottom <= containerRect.bottom
        ) {
            return img.alt;
        }
    }
    return null;
}

function spin() {
    let shouldClickAvailabe = false;
    changeClickEventFromButton(shouldClickAvailabe);
    document.getElementById("output").innerText = "";
    const reels = document.querySelectorAll(".reel");
    let chosenReels = [];
    reels.forEach((reel, index) => {
        let duration = Math.random() * 2;
        reel.style.animation = `spinLoop ${duration}s infinite linear`;
        setTimeout(() => {
            reel.style.animation = "none";
            let stopPosition = getRandomSymbolOffset();
            reel.style.transform = `translateY(${stopPosition}px)`;
            let reelContainer = reel.parentElement;
            chosenReels.push(getVisibleImage(reelContainer));
            if (chosenReels.length === 5) {
                console.log(`Index: ${index} ${chosenReels}`);
                getResultOfSpin(chosenReels);
                shouldClickAvailabe = true;
                changeClickEventFromButton(shouldClickAvailabe);
            }
        }, (Math.random() * 2 + 2) * 1000 );
    });
}

function changeClickEventFromButton(shouldClickAvailable) {
    if (shouldClickAvailable) {
        document.getElementById("spinButton").setAttribute("onclick", "spin()");
    }
    else {
        document.getElementById("spinButton").removeAttribute("onclick");
    }
}

function getResultOfSpin(chosenReels) {
    const counts = chosenReels.reduce((akk, num) => {
        akk[num] = (akk[num] || 0) + 1;
        return akk;
    }, {});

    let maxNum = null;
    let maxCount = 0;

    for (const [num, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxNum = num;
            maxCount = count;
        }
    }
    getAnswerString(maxCount);
}

function getAnswerString(maxCount) {
    switch(maxCount) {
        case 2:
            document.getElementById("output").innerText = "2 Symbole sind gleich"
            break;
        case 3:
            document.getElementById("output").innerText = "3 Symbole sind gleich"
            break;
        case 4:
            document.getElementById("output").innerText = "4 Symbole sind gleich"
            break;
        case 5:
            document.getElementById("output").innerText = "5 Symbole sind gleich"
            break;
        default:
            document.getElementById("output").innerText = "Keine Symbole sind gleich"
            break;
    }
}