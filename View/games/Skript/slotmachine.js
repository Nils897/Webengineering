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

let betCredits = 0;

/**
 * Wird zum Start der Seite ausgeführt und führt für alle Container der Klasse "reel" die Funktion "createReels" aus
 */
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".reel").forEach(reel => createReels(reel));
});

/**
 * Generiert die div-Container für die Räder der Slot-Maschine
 *
 * @param reelElement der Container in den die Reel-Container eingefügt werden sollen
 */
function createReels(reelElement) {
    reelElement.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        let container = document.createElement("div");
        container.className = "symbol";
        let img = document.createElement("img");
        let symbolLink = symbols[i % symbols.length];
        img.src = symbolLink;
        img.alt = symbolLink;
        img.width = 80;
        img.height = 80;
        container.appendChild(img);
        reelElement.appendChild(container);
    }
}

/**
 * wrid ausgeführt wenn man auf Setzen-Knopf drückt
 * setzt den Wert im Input-Feld, sperrt den Setzen-Konpf und aktiviert den Drehen-Knopf
 */
function bet() {
    changeClickEventFromSpinButton(true)
    let input = document.getElementById("input").value;
    betCredits += input;
    let inputField = document.getElementById("input");
    changeClickEventFromBetButton(false);
    let container = document.getElementById("buttons");
    let text = document.createElement("p");
    text.setAttribute("class", "input-text");
    text.setAttribute("id", "input-text");
    text.textContent = `${input} Credits gesetzt`;
    container.replaceChild(text, inputField);
}

/**
 * bestimmt ob Setzen-Knopf drückbar ist oder nicht
 *
 * @param shouldClickAvailable gibt an ob Knopf aktiviert werden kann oder nicht
 */
function changeClickEventFromBetButton(shouldClickAvailable) {
    if (shouldClickAvailable) {
        document.getElementById("betButton").setAttribute("onclick", "bet()");
    }
    else {
        document.getElementById("betButton").removeAttribute("onclick");
    }
}

/**
 * wird ausgeführt wenn der Drehen-Knopf gedrückt wird
 * Startet die Drehanimation und beendet sie nacheinander mit einem asynchronen Timeout
 * Wenn alle 5 Rollen stehen geblieben sind werden die Funktionen für das Resultat ausgeführt
 */
function spin() {
    increaseBlinkFrequenz(false);
    changeClickEventFromSpinButton(false);
    document.getElementById("output").innerText = "dreht...";
    const reels = document.querySelectorAll(".reel");
    let chosenReels = [];
    reels.forEach((reel) => {
        let duration = Math.random() * 2;
        reel.style.animation = `spinLoop ${duration}s infinite linear`;
        setTimeout(() => {
            reel.style.animation = "none";
            let stopPosition = getRandomSymbolOffset();
            reel.style.transform = `translateY(${stopPosition}px)`;
            let reelContainer = reel.parentElement;
            chosenReels.push(getVisibleImage(reelContainer));
            if (chosenReels.length === 5) {
                getResultOfSpin(chosenReels);
                changeClickEventFromSpinButton(false);
                changeClickEventFromBetButton(true);
                replaceTextWithInputField();
            }
        }, (Math.random() * 2 + 2) * 1000 );
    });
}

/**
 * bestimmt ob der Drehen-Knopf ausführbar ist oder nicht
 *
 * @param shouldClickAvailable bestimmt ob Knopf aktiviert werden kann oder nicht
 */
function changeClickEventFromSpinButton(shouldClickAvailable) {
    if (shouldClickAvailable) {
        document.getElementById("spinButton").setAttribute("onclick", "spin()");
    }
    else {
        document.getElementById("spinButton").removeAttribute("onclick");
    }
}

/**
 * bestimmt Position an dem Rolle stehen bleiben soll
 *
 * @returns {number} Anzahl der Pixel um die in Y-Richtung verschoben werden soll
 */
function getRandomSymbolOffset() {
    return Math.floor(Math.random() * 14) * -80;
}

/**
 * findet heraus, welches Bild an der jeweiligen Stelle am Ende zu sehen ist
 * @param reelContainer die betreffende Rolle
 * @returns {*|null} gibt den Link des entsprechenden Bildes zurück oder null falls kein Bild zu sehen ist
 */
function getVisibleImage(reelContainer) {
    const reel = reelContainer.querySelector('.reel');
    const images = reel.querySelectorAll('.symbol img');
    const containerRect = reelContainer.getBoundingClientRect();
    for (let img of images) {
        const imgRect = img.getBoundingClientRect();
        if ( imgRect.top >= containerRect.top && imgRect.bottom <= containerRect.bottom ) {
            return img.alt;
        }
    }
    return null;
}

/**
 * ersetzt den Setzen-Text durch das Eingabe-Feld nach dem Drehen
 */
function replaceTextWithInputField() {
    let container = document.getElementById("buttons");
    let text = document.getElementById("input-text");
    let inputField = document.createElement("input");
    inputField.setAttribute("id", "input");
    inputField.setAttribute("type", "number");
    inputField.setAttribute("min", "10");
    inputField.setAttribute("value", "10");
    container.replaceChild(inputField, text);
}

/**
 * Findet heraus wie oft jedes Bild zu sehen ist
 *
 * @param chosenReels Liste der Links der zu sehenden Bilder
 */
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

/**
 * Verändert die Blink-Frequenz der Blinklichter
 *
 * @param shouldBlinkBeIncreased gibt an ob die Frequenz verändert werden soll oder nicht
 */
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

/**
 * Gibt den Gewinn-Text aus und zeigt ihn an
 * Verrechnet den Gewinn mit dem Kontostand
 *
 * @param maxCount größte Zahl an gemeinsamen Bilder, die zu sehen sind
 */
function getAnswerString(maxCount) {
    let accountCredits = getAccountCredits();
    const userData = sessionStorage.getItem("loggedInUser");
    const user = JSON.parse(userData);
    switch(maxCount) {
        case 2:
            document.getElementById("output").innerText = "Gewinn! Einsatz zurück";
            increaseBlinkFrequenz(true);
            updateCreditsOnServer(user.username, accountCredits);
            betCredits = 0;
            break;
        case 3:
            document.getElementById("output").innerText = "Gewinn! Einsatz x3";
            increaseBlinkFrequenz(true);
            accountCredits += 3 * betCredits;
            updateCreditsOnServer(user.username, accountCredits);
            betCredits = 0;
            break;
        case 4:
            document.getElementById("output").innerText = "Gewinn! Einsatz x10";
            increaseBlinkFrequenz(true);
            accountCredits += 10 * betCredits;
            updateCreditsOnServer(user.username, accountCredits);
            betCredits = 0;
            break;
        case 5:
            document.getElementById("output").innerText = "Gewinn! Einsatz x100";
            increaseBlinkFrequenz(true);
            accountCredits += 100 * betCredits;
            updateCreditsOnServer(user.username, accountCredits);
            betCredits = 0;
            break;
        default:
            document.getElementById("output").innerText = "Niete";
            accountCredits -= betCredits;
            updateCreditsOnServer(user.username, accountCredits);
            betCredits = 0;
            break;
    }
}