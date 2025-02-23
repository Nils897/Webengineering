// Karten-Deck mit Namen und Werten
const suits = ["Pik", "Herz", "Karo", "Kreuz"];
const values = [
    { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 },
    { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 },
    { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 },
    { name: "Bube", value: 10 }, { name: "Dame", value: 10 }, { name: "König", value: 10 },
    { name: "Ass", value: 11 }
];

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

function checkGameEnd() {
    let playerScore = getScore(playerCards);
    let dealerScore = getScore(dealerCards);

    if (playerScore > 21) {
        document.getElementById("result").textContent = "Spieler ist über 21! Dealer gewinnt.";
        document.getElementById("restart").disabled = false;
        return true;
    }
    if (dealerScore > 21) {
        document.getElementById("result").textContent = "Dealer ist über 21! Spieler gewinnt.";
        document.getElementById("restart").disabled = false;
        return true;
    }
    if (dealerScore >= 17) {
        if (playerScore > dealerScore) {
            document.getElementById("result").textContent = "Spieler gewinnt!";
        } else if (playerScore < dealerScore) {
            document.getElementById("result").textContent = "Dealer gewinnt!";
        } else {
            document.getElementById("result").textContent = "Unentschieden!";
        }
        document.getElementById("restart").disabled = false;
        return true;
    }
    return false;
}

// Spieler zieht eine Karte
document.getElementById("hit").addEventListener("click", function() {
    playerCards.push(deck.pop());
    updateUIPlayer();
    if (getScore(playerCards) > 21) {
        updateUIDealer();
        checkGameEnd();
    }
});

// Spieler passt, jetzt ist der Dealer dran
document.getElementById("stand").addEventListener("click", function() {
    while (getScore(dealerCards) < 17) {
        dealerCards.push(deck.pop());

    }
    updateUIDealer();
    checkGameEnd();
});

document.getElementById("restart").addEventListener("click", function() {
  while (playerCards.length > 0) {
      playerCards.pop();
  }
  while (dealerCards.length > 0) {
      dealerCards.pop();
  }
    start();
})


function start (){
    playerCards.push(deck.pop(), deck.pop());
    dealerCards.push(deck.pop(),);
    updateUIPlayer();
    updateUIDealer()
    dealerCards.push(deck.pop());
    document.getElementById("restart").disabled = true;
}
start();