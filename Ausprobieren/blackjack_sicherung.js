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

function updateUIPlayer() {
    document.getElementById("player-cards").textContent = "Spieler Karten: " + formatCards(playerCards);
    document.getElementById("player-score").textContent = "Spieler Punkte: " + getScore(playerCards);
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
}

function checkGameEnd() {
    let playerScore = getScore(playerCards)
    let dealerScore = getScore(dealerCards)

    if (playerScore > 21) {
        document.getElementById("result").textContent = "Spieler ist über 21! Dealer gewinnt.";
        Account -= betAmount [currentHandIndex]
        end()
        return true;
    }
    if (dealerScore > 21) {
        document.getElementById("result").textContent = "Dealer ist über 21! Spieler gewinnt.";
        Account += parseInt(betAmount [currentHandIndex])
        end()
        return true;
    }
    if (dealerScore >= 17) {
        if (playerScore > dealerScore) {
            document.getElementById("result").textContent = "Spieler gewinnt!";
            Account += parseInt(betAmount [currentHandIndex])
        } else if (playerScore < dealerScore) {
            document.getElementById("result").textContent = "Dealer gewinnt!";
            Account -= betAmount [currentHandIndex]
        } else {
            document.getElementById("result").textContent = "Unentschieden!";
            end()
        }
        end()
        return true;
    }
    return false;
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
    playerCards.push(deck.pop(), deck.pop());
    dealerCards.push(deck.pop(),);
    playerHands = [playerCards];
    currentHandIndex = 0;
    updateUIPlayer();
    updateUIDealer()
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
    return playerCards.length === 2 && playerCards[0].value === playerCards[1].value;
}

function canDouble() {
    return playerCards.length === 2;
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
    const secondHand = [playerCards.pop(),deck.pop()];
    playerHands[currentHandIndex] = [playerCards.pop(),deck.pop()];
    playerHands.push(secondHand);
    betAmount [currentHandIndex+1] = betAmount [currentHandIndex];
    currentHandIndex = 0;
    playerCards = playerHands[currentHandIndex];
    updateUIPlayer();
    splitButton.disabled = !canSplit();
});

function switchToNextHand() {
    if (currentHandIndex < playerHands.length - 1) {
        currentHandIndex++;
        playerCards = playerHands[currentHandIndex];
        updateUIPlayer();
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




