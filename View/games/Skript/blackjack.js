import cards from './cards.js';

/**
 * Blackjack-Spiel mit Split- und Double-Funktionalität.
 * Spieler können gegen den Dealer spielen, Einsätze tätigen, Karten ziehen, splitten oder verdoppeln.
 */

/* ----------------------------- KONSTANTEN ----------------------------- */

// Kartenfarben und Kartenwerte
const suits = ["pik", "herz", "karo", "kreuz"];
const values = [
    { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 },
    { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 },
    { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 },
    { name: "bube", value: 10 }, { name: "dame", value: 10 }, { name: "koenig", value: 10 },
    { name: "ass", value: 11 }
];

/* ----------------------------- SPIELSTATUS ----------------------------- */

let Account = getAccountCredits(); // Startguthaben vom Server
let deck = createDeck();            // Kartendeck
let playerCards = [];               // Aktuelle Kartenhand des Spielers
let dealerCards = [];               // Kartenhand des Dealers
let playerHands = [[0][0]];         // Alle Spielerhände (bei Splits mehrere)
let playerTurn = 0;                 // 1 = Spieler zieht Karten, 0 = Dealer zieht Karten
let currentHandIndex = 0;           // Index der aktiven Hand bei Splits
let handResults = [];               // Ergebnisse der Hände nach Spielende
let betAmount = [];                 // Einsatzbeträge der einzelnen Hände

/* ----------------------------- UI ELEMENTE ----------------------------- */

const betInput = document.createElement("input");
betInput.type = "number";
betInput.min = 1;
betInput.max = Account;
betInput.value = 10;

const betDisplay = document.createElement("p");
betDisplay.textContent = `Einsatz: `;

const doubleButton = document.createElement("button");
doubleButton.textContent = "Doppeln";
doubleButton.disabled = true;

const splitButton = document.createElement("button");
splitButton.textContent = "Splitten";
splitButton.disabled = true;

const betDiv = document.createElement("div");
betDiv.appendChild(betDisplay);
betDiv.appendChild(betInput);

const AccountDisplay = document.createElement("p");
AccountDisplay.textContent = `Konto: ${Account} Credits`;

document.querySelector(".bet-section").insertBefore(AccountDisplay, document.querySelector("#start-buttons"));
document.querySelector(".bet-section").insertBefore(betDiv, document.querySelector("#start-buttons"));
document.querySelector(".more-options").appendChild(doubleButton);
document.querySelector(".more-options").appendChild(splitButton);

/* ----------------------------- FUNKTIONEN ----------------------------- */

/**
 * Erzeugt und mischt ein neues Kartendeck.
 * @returns {Array} gemischtes Deck
 */
function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit: suit, name: value.name, value: value.value });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

/**
 * Berechnet den Gesamtwert einer Kartenhand.
 * Behandelt Asse flexibel (11 oder 1).
 * @param {Array} cards - Kartenhand
 * @returns {number} Punktzahl der Kartenhand
 */
function getScore(cards) {
    let score = cards.reduce((sum, card) => sum + card.value, 0);
    let aceCount = cards.filter(card => card.name === "Ass").length;
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}


/**
 * Aktualisiert die UI für alle Spielerhände.
 */
function updateUIPlayer() {
    const sideHandDivs = document.querySelectorAll("#side-hand");
    let sideHandIndex = 0;

    splitButton.disabled = !canSplit();

    playerHands.forEach((hand, index) => {
        let handDiv = index === currentHandIndex
            ? document.querySelector("#active-hand")
            : sideHandDivs[sideHandIndex++];

        handDiv.querySelector(".hand-cards").innerHTML = "";
        const label = handDiv.querySelector(".hand-text strong");
        const scoreText = handDiv.querySelectorAll(".hand-text p");

        const formattedCards = formatPlayerCards(hand, index);
        handDiv.querySelector(".hand-cards").appendChild(formattedCards);

        label.textContent = `Hand ${index + 1}` + (index === currentHandIndex ? " (Aktiv)" : "");
        if (handResults[index]) {
            scoreText[1].textContent = handResults[index];
        }
        const score = getScore(hand);
        scoreText[0].textContent = "Punkte: " + score;
    });
}

/**
 * Erstellt das Kartenlayout einer Spielerhand.
 * @param {Array} hand
 * @returns {HTMLElement} Container für die Karten
 */
function formatPlayerCards(hand) {
    let offsetY = 0;
    let offsetX = 0;
    let angle = 0;
    const cardContainer = document.createElement("div");

    hand.forEach((element, index) => {
        const card = document.createElement("img");
        card.src = cards[element.suit][element.name];
        angle = 5 * ((hand.length / 2) - index);

        card.classList.add("card");

        if (hand.length <= 2) {
            offsetY = 0;
            angle = 0;
            offsetX = offsetX < 0 ? 0 : offsetX;
        } else if (index === 0) {
            offsetY = 0;
        } else if (index < (hand.length / 2)) {
            offsetY -= 4;
        } else if (index > (hand.length / 2)) {
            offsetY += 4;
        }

        card.style.transform = `translateX(${(offsetX / (hand.length / 2))}vw) translateY(${(offsetY) / hand.length}vh) rotate(${-angle}deg)`;
        offsetX += 4;
        cardContainer.appendChild(card);
    });

    return cardContainer;
}

/**
 * Deckt die Karten des Dealers auf und zeigt dessen Punkte an.
 */
function revealDealerCards() {
    playerTurn = 0;
    let offsetY = 0;
    let offsetX = 0;
    let angle = 0;

    document.getElementById("dealer-cards").innerHTML = '';

    dealerCards.forEach((element, index) => {
        const card = document.createElement("img");
        card.src = cards[element.suit][element.name];
        angle = 5 * ((dealerCards.length / 2) - index);

        card.classList.add("card");

        if (dealerCards.length <= 2) {
            offsetY = 0;
            angle = 0;
        } else if (index === 0) {
            offsetY = 0;
        } else if (index < (dealerCards.length / 2)) {
            offsetY += 4;
        } else if (index > (dealerCards.length / 2)) {
            offsetY -= 4;
        }

        card.style.transform = `translateX(${offsetX / (dealerCards.length / 2)}vw)`;
        offsetX += 4;
        document.getElementById("dealer-cards").appendChild(card);
    });

    document.getElementById("dealer-score").textContent = "Dealer Punkte: " + getScore(dealerCards);
}

/**
 * Zeigt die verdeckte Hand des Dealers an (erste Karte sichtbar).
 */
function updateUIDealer() {
    let offset = 0;
    document.getElementById("dealer-cards").innerHTML = '';

    dealerCards.forEach((element, index) => {
        const card = document.createElement("img");

        card.style.transform = `translateX(${offset}vh) translateY(${offset}vh)`;

        if (index === 0) {
            card.src = cards[element.suit][element.name];
            card.classList.add("first-card");
        } else {
            card.src = "img/cards/card-back.svg";
            card.classList.add("card");
            offset++;
        }

        document.getElementById("dealer-cards").appendChild(card);
    });

    document.getElementById("dealer-score").textContent = "";
}

/**
 * Beendet das Spiel, aktualisiert das Konto und deckt ggf. ein neues Deck auf.
 */
function end() {
    AccountDisplay.textContent = `Konto: ${Account}€`;
    document.getElementById("stand").disabled = true;
    document.getElementById("hit").disabled = true;
    document.getElementById("restart").disabled = false;
    doubleButton.disabled = true;

    if (deck.length < 20) {
        deck = createDeck();
    }
    const userData = sessionStorage.getItem("loggedInUser");
    const user = JSON.parse(userData);
    updateCreditsOnServer(user.username, Account);
}

/**
 * Prüft das Spielende und wertet die Hände gegen den Dealer aus.
 */
function checkGameEnd() {
    const dealerScore = getScore(dealerCards);
    handResults = [];

    for (let i = 0; i < playerHands.length; i++) {
        const pScore = getScore(playerHands[i]);

        if (pScore > 21) {
            handResults[i] = "Verloren (über 21)";
            Account -= parseInt(betAmount[i]);
        } else if (dealerScore > 21) {
            handResults[i] = "Gewonnen (Dealer über 21)";
            Account += parseInt(betAmount[i]);
        } else if (pScore > dealerScore) {
            handResults[i] = "Gewonnen";
            Account += parseInt(betAmount[i]);
        } else if (pScore < dealerScore) {
            handResults[i] = "Verloren";
            Account -= parseInt(betAmount[i]);
        } else {
            handResults[i] = "Unentschieden";
        }
    }

    revealDealerCards();
    updateUIPlayer();
    end();
}

/**
 * Wechselt zur nächsten Hand bei Splits.
 */
function switchToNextHand() {
    if (currentHandIndex < playerHands.length - 1) {
        currentHandIndex++;
        playerCards = playerHands[currentHandIndex];
        updateUIPlayer();
        splitButton.disabled = !canSplit();
        doubleButton.disabled = !canDouble();
        document.getElementById("hit").disabled = false;
    } else {
        document.getElementById("stand").click();
    }
}

/**
 * Prüft, ob ein Split möglich ist.
 * @returns {boolean}
 */
function canSplit() {
    return playerHands[currentHandIndex].length === 2 &&
        playerHands[currentHandIndex][0].value === playerHands[currentHandIndex][1].value;
}

/**
 * Prüft, ob ein Double möglich ist.
 * @returns {boolean}
 */
function canDouble() {
    return playerHands[currentHandIndex].length === 2 && playerTurn === 1;
}

/**
 * Startet eine neue Runde.
 */
async function start() {
    handResults = [];
    betAmount[0] = betInput.value;
    playerTurn = 1;
    currentHandIndex = 0;

    document.querySelectorAll(".player-hand").forEach(hand => {
        hand.querySelector(".hand-cards").innerHTML = "";
        hand.querySelector(".hand-text strong").textContent = "";
        hand.querySelectorAll(".hand-text p").forEach(element => element.textContent = "");
    });

    playerCards = [];
    dealerCards = [];
    playerHands = [[0][0]];

    document.getElementById("start").disabled = true;
    document.getElementById("restart").disabled = true;

    updateUIDealer();
    await playerHit();
    playerHands = [playerCards];
    updateUIPlayer();
    await playerHit();
    playerHands = [playerCards];
    updateUIPlayer();
    await dealerHit();
    updateUIDealer();
    dealerHit();

    doubleButton.disabled = !canDouble();
    splitButton.disabled = !canSplit();

    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
}

/**
 * Führt einen Karten-Zug für den Dealer aus (inkl. Animation).
 */
async function dealerHit() {
    const hitDuration = { duration: 500, iterations: 1, easing: "ease" };
    const hitAnimation = [{ transform: "translateX(0)" }, { transform: "translateX(20vw)" }];
    const newCard = document.querySelector(".new-card");

    newCard.style.display = "block";
    await newCard.animate(hitAnimation, hitDuration).finished;
    newCard.style.display = "none";

    dealerCards.push(deck.pop());
    updateUIDealer();
}

/**
 * Führt einen Karten-Zug für den Spieler aus (inkl. Animation).
 */
async function playerHit() {
    const hitDuration = { duration: 500, iterations: 1, easing: "ease" };
    const hitAnimation = [{ transform: "translateX(0) translateY(0)" }, { transform: "translateX(20vw) translateY(40vh)" }];
    const newCard = document.querySelector(".new-card");

    newCard.style.display = "block";
    await newCard.animate(hitAnimation, hitDuration).finished;
    newCard.style.display = "none";

    playerCards.push(deck.pop());
}

/* ----------------------------- EVENT HANDLER ----------------------------- */

// Einsatz ändern
betInput.addEventListener("input", () => {
    betAmount[currentHandIndex] = betInput.value;
});

// Spiel starten
document.getElementById("start").addEventListener("click", start);

// Neue Runde starten
document.getElementById("restart").addEventListener("click", () => {
    playerCards = [];
    dealerCards = [];
    start();
});

// Doppeln
doubleButton.addEventListener("click", () => {
    if (!canDouble()) return;

    playerCards.push(deck.pop());
    betAmount[currentHandIndex] *= 2;
    updateUIPlayer();

    document.getElementById("hit").disabled = true;
    document.getElementById("stand").click();
});

// Splitten
splitButton.addEventListener("click", () => {
    if (!canSplit()) return;

    let card1 = playerCards[0];
    let card2 = playerCards[1];

    playerHands[currentHandIndex] = [card1, deck.pop()];
    const newHand = [card2, deck.pop()];

    playerHands.push(newHand);
    betAmount[currentHandIndex + 1] = betAmount[currentHandIndex];
    playerCards = playerHands[currentHandIndex];

    updateUIPlayer();
});

// Hit
document.getElementById("hit").addEventListener("click", async () => {
    await playerHit();
    updateUIPlayer();
    updateUIDealer();

    if (getScore(playerCards) > 21) {
        switchToNextHand();
    }
});

// Stand
document.getElementById("stand").addEventListener("click", async () => {
    doubleButton.disabled = true;

    if (!(currentHandIndex < playerHands.length - 1)) {
        while (getScore(dealerCards) < 17) {
            await dealerHit();
        }
        updateUIDealer();
        checkGameEnd();
    }

    switchToNextHand();
});
