import cards from './cards.js';

// Karten-Deck mit Namen und Werten
const suits = ["pik", "herz", "karo", "kreuz"];
const values = [
    { name: "2", value: 2 }, { name: "3", value: 3 }, { name: "4", value: 4 },
    { name: "5", value: 5 }, { name: "6", value: 6 }, { name: "7", value: 7 },
    { name: "8", value: 8 }, { name: "9", value: 9 }, { name: "10", value: 10 },
    { name: "bube", value: 10 }, { name: "dame", value: 10 }, { name: "koenig", value: 10 },
    { name: "ass", value: 11 }
];
let Account = getAccountCredits();


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
    const sideHandDivs = document.querySelectorAll("#side-hand");
    let sideHandIndex = 0;
    if (canSplit() === false) {
        splitButton.disabled = true;
    }
    else {
        splitButton.disabled = false;
    }
    playerHands.forEach((hand, index) => {
        let handDiv;
        if (index === currentHandIndex) {
            handDiv = document.querySelector("#active-hand");
        }
        else {
            handDiv = sideHandDivs[sideHandIndex];
            sideHandIndex++;
        }
        handDiv.querySelector(".hand-cards").innerHTML = "";
        let label = handDiv.querySelector(".hand-text strong");
        const scoreText = handDiv.querySelectorAll(".hand-text p");
        //Karten platzieren
        let formattedCards = formatPlayerCards(hand, index);
        handDiv.querySelector(".hand-cards").appendChild(formattedCards);
        //Punkte und Hand anzeigen
        label.textContent = "Hand " + (index + 1);
        if (index === currentHandIndex) {
            label.textContent += " (Aktiv)";
        }
        if(handResults[index]){
            scoreText[1].textContent = `Ergebnis: ${handResults[index]}`;
        }
        const score = getScore(hand);
        scoreText[0] .textContent = "Punkte: " + score;
        
    });
}


function formatPlayerCards(hand){
    let offsetY = 0;
    let offsetX = 0;
    let angle = 0;
    const cardContainer = document.createElement("div");
    hand.forEach((element, index) => {
        let card = document.createElement("img");
        card.src = cards[element.suit][element.name];
        angle = 5 * ((hand.length/2) - index);
        card.classList.add("card");
        if(hand.length <= 2){
            offsetY = 0;
            angle = 0;
            offsetX = offsetX < 0 ? 0 : offsetX; 
        }
        else if(index === 0){
            offsetY = 0;
        }
        else if(index < (hand.length/2)){
            offsetY -= 4;
        }
        else if(index > (hand.length/2)) {
            offsetY += 4;
        }
        card.style.transform = `translateX(${(offsetX/(hand.length/2))}vw) translateY(${(offsetY)/hand.length}vh) rotate(${-angle}deg)`;
        offsetX += 4;
        cardContainer.appendChild(card); 
    });
    return cardContainer;
}


function revealDealerCards() {
    let offsetY = 0;
    let offsetX = 0;
    let angle = 0;
    document.getElementById("dealer-cards").innerHTML = '';
    dealerCards.forEach((element, index) => {
        let card = document.createElement("img");
        card.src = cards[element.suit][element.name];
        angle = 5 * ((dealerCards.length/2) - index);
        card.classList.add("card");
        if(dealerCards.length <= 2){
            offsetY = 0;
            angle = 0;
        }
        else if(index === 0){
            offsetY = 0;
        }
        else if(index < (dealerCards.length/2)){
            offsetY += 4;
        }
        else if(index > (dealerCards.length/2)) {
            offsetY -= 4;
        }
        card.style.transform = `translateX(${offsetX/(dealerCards.length/2)}vw)`;
        offsetX += 4;
        document.getElementById("dealer-cards").appendChild(card);
        
    });
    document.getElementById("dealer-score").textContent = "Dealer Punkte: " + getScore(dealerCards);
}

function updateUIDealer(){
    let offset = 0;
    document.getElementById("dealer-cards").innerHTML = '';
    dealerCards.forEach((element, index) => {
        let card = document.createElement("img");
        card.style.transform = `translateX(${offset}vh) translateY(${offset}vh)`;
        if(index === 0){
            card.src = cards[element.suit][element.name];
            card.classList.add("first-card");
        }
        else {
            card.src = "img/cards/card-back.svg";
            card.classList.add("card");
            offset++;
        }
        document.getElementById("dealer-cards").appendChild(card);
        
    });
    document.getElementById("dealer-score").textContent = "";
}

function end() {
    AccountDisplay.textContent = `Konto: ${Account}€`;
    document.getElementById("stand").disabled = true;
    document.getElementById("hit").disabled = true;
    document.getElementById("restart").disabled = false;
    doubleButton.disabled = true;
    if (deck.length<20){
        deck = createDeck();
    }
    const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));
    updateCreditsOnServer(userData.username, Account);
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
    revealDealerCards();
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
    start();
})

async function start (){
    // Ergebnisse der einzelnen Hände zurücksetzen
    handResults = [];
    document.querySelectorAll(".player-hand").forEach(hand => {
        hand.querySelector(".hand-cards").innerHTML = "";
        hand.querySelector(".hand-text strong").textContent = "";
        hand.querySelectorAll(".hand-text p").forEach(element => element.textContent = "");
    });
    // Karten neu austeilen
    playerCards = [];
    dealerCards = [];
    
    document.getElementById("start").disabled = true;
    document.getElementById("restart").disabled = true;

    updateUIDealer();
    currentHandIndex = 0;
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

// Hinzufügen eines Einsatz-Inputs und der Double- und Split-Buttons

const betInput = document.createElement("input");
betInput.type = "number";
betInput.min = 1;
betInput.max = Account;
betInput.value = 10;
const betDisplay = document.createElement("p");
betDisplay.textContent = `Einsatz: `;
let betAmount = [];
betAmount [0] = betInput.value;


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

betInput.addEventListener("input", () => {
    betAmount [currentHandIndex] = betInput.value;
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

document.getElementById("hit").addEventListener("click", async function() {
    await playerHit();
    updateUIPlayer();
    updateUIDealer();
    if (getScore(playerCards) > 21) {
        switchToNextHand();
    }
});

document.getElementById("stand").addEventListener("click", async function() {
    if (!(currentHandIndex < playerHands.length - 1)){
        while (getScore(dealerCards) < 17) {
            await dealerHit();
        }
        updateUIDealer();
        checkGameEnd();
        
    }

    switchToNextHand();
});


async function dealerHit(){
    /* Animation, wenn der Dealer Karten zieht */
    const hitDuration = {
        duration: 500,
        iterations: 1,
        easing: "ease"
    };

    const hitAnimation = [
        {transform: "translateX(0)", display: "block"},
        {transform: "translateX(20vw)", display: "none"}
    ];

    const newCard = document.querySelector(".new-card");
    await newCard.animate(hitAnimation, hitDuration).finished; // Wait for animation to finish
    dealerCards.push(deck.pop());
    
    updateUIDealer();

}

async function playerHit(){
    /* Animation, wenn der Dealer Karten zieht */
    const hitDuration = {
        duration: 500,
        iterations: 1,
        easing: "ease"
    };

    const hitAnimation = [
        {transform: "translateX(0) translateY(0)", display: "block"},
        {transform: "translateX(20vw) translateY(40vh)", display: "none"}
    ];

    const newCard = document.querySelector(".new-card");
    await newCard.animate(hitAnimation, hitDuration).finished; // Wait for animation to finish
    playerCards.push(deck.pop());

}









