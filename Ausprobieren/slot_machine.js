const diamant = "../View/img/slot_machine_img/diamant.png";
const flame =  "../View/img/slot_machine_img/flame.png";
const moneybag = "../View/img/slot_machine_img/moneybag.png";
const bell =  "../View/img/slot_machine_img/bell.png";
const heart =   "../View/img/slot_machine_img/heart.png";
const card =  "../View/img/slot_machine_img/card.png";
const cherry = "../View/img/slot_machine_img/cherry.png";
const cloverleaf =  "../View/img/slot_machine_img/cloverleaf.png";
const star =  "../View/img/slot_machine_img/star.png";
const dice =  "../View/img/slot_machine_img/dice.png";
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
    return parts[4];
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
    const reels = document.querySelectorAll(".reel");
    let chosenReels = [];
    let count = 0;
    reels.forEach((reel, index) => {
        let duration = Math.random() * 2 + 1;
        reel.style.animation = `spinLoop ${duration}s infinite linear`;
        setTimeout(() => {
            reel.style.animation = "none";
            let stopPosition = getRandomSymbolOffset();
            reel.style.transform = `translateY(${stopPosition}px)`;
            let reelContainer = reel.parentElement;
            chosenReels.push(getVisibleImage(reelContainer));
            count++;
            if (count === chosenReels.length) {
                console.log(`Index: ${index} ${chosenReels}`);
            }
        }, (Math.random() * 2 + 2) * 1000 );
    });
    console.log(chosenReels);
}