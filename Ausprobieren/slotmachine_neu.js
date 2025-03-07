const diamant = "../View/games/img/slotmachineSymbols/diamant.png";
const flame =  "../View/games/img/slotmachineSymbols/flame.png";
const moneybag = "../View/games/img/slotmachineSymbols/moneybag.png";
const bell =  "../View/games/img/slotmachineSymbols/bell.png";
const heart =   "../View/games/img/slotmachineSymbols/heart.png";
const card =  "../View/games/img/slotmachineSymbols/card.png";
const cherry = "../View/games/img/slotmachineSymbols/cherry.png";
const cloverleaf =  "../View/games/img/slotmachineSymbols/cloverleaf.png";
const star =  "../View/games/img/slotmachineSymbols/star.png";
const dice =  "../View/games/img/slotmachineSymbols/dice.png";
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
        img.width = 80;
        img.height = 80;
        container.appendChild(img);
        reelElement.appendChild(container);
    }
}

function getAltOfImage(imgLink) {
    let parts = imgLink.split("/");
    return parts[5];
}

function getRandomSymbolOffset() {
    return Math.floor(Math.random() * 14) * -80;
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
    increaseBlinkFrequenz(false);
    changeClickEventFromButton(false);
    document.getElementById("output").innerText = "dreht...";
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
                changeClickEventFromButton(true);
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

function increaseBlinkFrequenz(shouldBlinkBeIncreased) {
    if (shouldBlinkBeIncreased) {
        document.querySelectorAll(".light").forEach(light => {
            light.style.animation = "blink 0.1s infinite";
        });
    }
    else {
        document.querySelectorAll(".light").forEach(light => {
            light.style.animation = "blink 0.5s infinite";
        });
    }
}

function getAnswerString(maxCount) {
    switch(maxCount) {
        case 2:
            document.getElementById("output").innerText = "Einsatz zurück";
            increaseBlinkFrequenz(true);
            break;
        case 3:
            document.getElementById("output").innerText = "Einsatz x3";
            increaseBlinkFrequenz(true);
            break;
        case 4:
            document.getElementById("output").innerText = "Einsatz x10";
            increaseBlinkFrequenz(true);
            break;
        case 5:
            document.getElementById("output").innerText = "Einsatz x100";
            increaseBlinkFrequenz(true);
            break;
        default:
            document.getElementById("output").innerText = "Niete";
            break;
    }
}