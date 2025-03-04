// Karten-Deck mit Namen und Werten
const suits = ["Pik", "Herz", "Karo", "Kreuz"];
const values = [
    { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 },
    { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 },
    { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 },
    { name: "Bube", value: 10 }, { name: "Dame", value: 10 }, { name: "König", value: 10 },
    { name: "Ass", value: 11 }
];
let Account = 100
let handResults = [];


function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit: suit, name: value.name, value: value.value });
        }
    }
    return deck.sort(() => Math.random() - 0.5); // Mischen
}

let deck = createDeck();
let playerCards = [];
let dealerCards = [];

function getScore(cards) {
    let score = cards.reduce((sum, card) => sum + card.value, 0);
    let aceCount = cards.filter(card => card.name === "Ass").length;

    // Falls Score über 21 ist, wandeln wir Asse von 11 zu 1 um
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

function formatCards(cards) {
    return cards.map(card => `${card.suit} ${card.name}`).join(", ");
}

// Aktualisierte updateUIPlayer-Funktion: Zeigt alle Hände an
function updateUIPlayer() {
    const playerContainer = document.getElementById("player-cards");
    playerContainer.innerHTML = ""; // Vorherigen Inhalt löschen
    if (canSplit() === false) {
        splitButton.disabled = true;
    }
    else {
        splitButton.disabled = false;
    }
    playerHands.forEach((hand, index) => {
        const handDiv = document.createElement("div");
        let label = "Hand " + (index + 1);
        if (index === currentHandIndex) {
            label += " (Aktiv)";
        }
        const score = getScore(hand);
        handDiv.innerHTML = `<strong>${label}</strong>: ${formatCards(hand)} – Punkte: ${score}`;
        if (handResults[index]) {
            handDiv.innerHTML += ` – Ergebnis: ${handResults[index]}`;
        }
        playerContainer.appendChild(handDiv);
    });
}

function updateUIDealer(){
    document.getElementById("dealer-cards").textContent = "Dealer Karten: " + formatCards(dealerCards);
    document.getElementById("dealer-score").textContent = "Dealer Punkte: " + getScore(dealerCards);
}

function end() {
    AccountDisplay.textContent = `Konto: ${Account}€`;
    document.getElementById("stand").disabled = true;
    document.getElementById("hit").disabled = true;
    document.getElementById("restart").disabled = false;
    doubleButton.disabled = true;
    deck = createDeck();
}

function checkGameEnd() {
    // Dealer zieht (falls noch nicht geschehen) – hier sollte der Dealer bereits fertig sein (score >= 17)
    let dealerScore = getScore(dealerCards);
    handResults = []; // Ergebnisse zurücksetzen
    for (let i = 0; i < playerHands.length; i++) {
        let pScore = getScore(playerHands[i]);
        if (pScore > 21) {
            handResults[i] = "Verloren (über 21)";
            Account -= parseInt(betAmount[i]);
        } else if (dealerScore > 21) {
            handResults[i] = "Gewonnen (Dealer über 21)";
            Account += parseInt(betAmount[i]);
        } else {
            if (pScore > dealerScore) {
                handResults[i] = "Gewonnen";
                Account += parseInt(betAmount[i]);
            } else if (pScore < dealerScore) {
                handResults[i] = "Verloren";
                Account -= parseInt(betAmount[i]);
            } else {
                handResults[i] = "Unentschieden";
            }
        }
    }
    updateUIPlayer();
    end();
}



document.getElementById("restart").addEventListener("click", function() {
    while (playerCards.length > 0) {
        playerCards.pop();
    }
    while (dealerCards.length > 0) {
        dealerCards.pop();
    }
    betDisplay.textContent = `Einsatz: ${betSlider.value}€`;
    start();
})


function start (){
    // Ergebnisse der einzelnen Hände zurücksetzen
    handResults = [];
    document.getElementById("result").textContent = "";

    // Karten neu austeilen
    playerCards = [];
    dealerCards = [];
    playerCards.push(deck.pop(), deck.pop());
    dealerCards.push(deck.pop());

    playerHands = [playerCards];
    currentHandIndex = 0;

    updateUIPlayer();
    updateUIDealer();
    dealerCards.push(deck.pop());

    doubleButton.disabled = !canDouble();
    splitButton.disabled = !canSplit();
    document.getElementById("restart").disabled = true;
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    document.getElementById("start").disabled = true;
}



// Hinzufügen eines Einsatz-Sliders und der Double- und Split-Buttons

const betSlider = document.createElement("input");
betSlider.type = "range";
betSlider.min = 1;
betSlider.max = 100;
betSlider.value = 10;
const betDisplay = document.createElement("p");
betDisplay.textContent = `Einsatz: ${betSlider.value}€`;
let betAmount = [];
betAmount [0] = betSlider.value;


const doubleButton = document.createElement("button");
doubleButton.textContent = "Doppeln";
doubleButton.disabled = true;

const splitButton = document.createElement("button");
splitButton.textContent = "Splitten";
splitButton.disabled = true;

document.body.insertBefore(betSlider, document.getElementById("bet"));
document.body.insertBefore(betDisplay, document.getElementById("bet"));
document.body.insertBefore(doubleButton, document.getElementById("hit"));
document.body.insertBefore(splitButton, document.getElementById("hit"));

betSlider.addEventListener("input", () => {
    betAmount [currentHandIndex] = betSlider.value;
    betDisplay.textContent = `Einsatz: ${betAmount [currentHandIndex]}€`;
});

let playerHands = [[0][0]];
let currentHandIndex = 0;

function canSplit() {
    return playerHands[currentHandIndex].length === 2 && playerHands[currentHandIndex][0].value === playerHands[currentHandIndex][1].value;
}

function canDouble() {
    return playerHands[currentHandIndex].length === 2;
}

document.getElementById("start").addEventListener("click", function() {
    start();
});

doubleButton.addEventListener("click", function() {
    if (!canDouble()) return;
    playerCards.push(deck.pop());
    betAmount [currentHandIndex] = betAmount [currentHandIndex]*2;
    updateUIPlayer();
    betDisplay.textContent = `Einsatz: ${betAmount [currentHandIndex]}€`;
    doubleButton.disabled = true;
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").click();
});

splitButton.addEventListener("click", function() {
    if (!canSplit()) return;
    // Beim Splitten: Die beiden Karten der aktuellen Hand trennen
    let card1 = playerCards[0];
    let card2 = playerCards[1];
    // Setze die aktive Hand neu: erste Hand erhält die erste Karte plus ein zusätzliches Blatt vom Deck
    playerHands[currentHandIndex] = [card1, deck.pop()];
    // Neue Hand mit der zweiten Karte plus ebenfalls eine Karte ziehen
    const newHand = [card2, deck.pop()];
    playerHands.push(newHand);
    // Ziehe auch für den Einsatz jeweils den gleichen Betrag ab
    betAmount[currentHandIndex + 1] = betAmount[currentHandIndex];
    // Setze die aktive Hand wieder (zum Beispiel bleibt die erste Hand aktiv)
    playerCards = playerHands[currentHandIndex];
    updateUIPlayer();
});


function switchToNextHand() {
    if (currentHandIndex < playerHands.length - 1) {
        currentHandIndex++;
        playerCards = playerHands[currentHandIndex];
        updateUIPlayer();
        if (canSplit() === false) {
            splitButton.disabled = true;
        }
        else {
            splitButton.disabled = false;
        }
    } else {
        document.getElementById("stand").click();
    }
}

document.getElementById("hit").addEventListener("click", function() {
    playerCards.push(deck.pop());
    updateUIPlayer();
    if (getScore(playerCards) > 21) {
        switchToNextHand();
    }
});

document.getElementById("stand").addEventListener("click", function() {
    if (!(currentHandIndex < playerHands.length - 1)){
        while (getScore(dealerCards) < 17) {
            dealerCards.push(deck.pop());

        }
        updateUIDealer();
        checkGameEnd();
    }

    switchToNextHand();
});



//Konto bums

const AccountDisplay = document.createElement("p");
AccountDisplay.textContent = `Konto: ${Account}€`;
document.body.insertBefore(AccountDisplay, document.getElementById("bet"));




