let rouletteBall;
let ball;
let wheel;
let numbersContainer;
let account = getAccountCredits();

let activeBets = []; // Speichert alle aktiven Wetten

let numbers = ['00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2', '0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1'];
const redNumbers = ['27', '25', '12', '19', '18', '21', '16', '23', '14', '9', '30', '7', '32', '5', '34', '3', '36', '1'];
const blackNumbers = ['10', '29', '8', '31', '6', '33', '4', '35', '2', '28', '26', '11', '20', '17', '22', '15', '24', '13'];

// Gruppen, auf die der Nutzer setzen kann
const firstRow = [];
const secondRow = [];
const thirdRow = [];
const rows = [firstRow, secondRow, thirdRow];
const firstTwelve = [];
const secondTwelve = [];
const thirdTwelve = [];
const firstHalf = [];
const secondHalf = [];
const oddNumbers = [];
const evenNumbers = [];


function addRouletteWheelNumbers(){
    /* Zahlen zu Roulette-Rad hinzufügen */
    const angleStep = 360 / numbers.length;
    numbers.forEach((number, index) => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('roulette-number');
        numberElement.textContent = number;
        const angle = index * angleStep;
        numberElement.style.transform = `rotate(${angle}deg) translate(32vh) rotate(90deg)`;
        numbersContainer.appendChild(numberElement);
        numbersContainer.style.transform = `rotate(-84.5deg)`;
    });
}

function determineGroup(number) {
    /* Zuordnung einer Zahl zu bestimmten Gruppen */
    // Zwölfer-Blöcke
    if (number <= 12) {
        firstTwelve.push(number.toString());
    }
    else if (number >= 12 && number <= 24) {
        secondTwelve.push(number.toString());
    }
    else if(number >= 24 && number <= 36) {
        thirdTwelve.push(number.toString());
    }
    else {
        secondHalf.push(number.toString());
    }

    // Reihen
    if (number % 3 === 1) {
        firstRow.push(number.toString());
    }
    else if (number % 3 === 2) {
        secondRow.push(number.toString());
    }
    else {
        thirdRow.push(number.toString());
    }

    // Gerade/ungerade Zahlen
    if (number % 2 === 0) {
        evenNumbers.push(number.toString());
    }
    else {
        oddNumbers.push(number.toString());
    }

    // 1-18 / 19-36 Felder
    if (number <= 18){
        firstHalf.push(number.toString());
    }
    else {
        secondHalf.push(number.toString());
    }
}

function placeBettingField(){
    /* Zahlen in den Wettbereich einfügen */
    const numbersBlock = document.querySelector('.numbers-block');

    // '0' und '00'
    let zeroRow = document.createElement('div');
    zeroRow.classList.add('numbers-row');
    let zeroElement = document.createElement('div');
    zeroElement.id = '0';
    zeroElement.addEventListener('click', () => bet(['0'], '0'));
    zeroElement.classList.add('number');
    let zeroSpan = document.createElement('span');
    zeroSpan.textContent = '0';
    zeroElement.appendChild(zeroSpan);
    let doubleZeroElement = document.createElement('div');
    doubleZeroElement.id = '00';
    doubleZeroElement.addEventListener('click', () => bet(['00'], '00'));
    doubleZeroElement.classList.add('number');
    let doubleZeroSpan = document.createElement('span');
    doubleZeroSpan.textContent = '00';
    doubleZeroElement.appendChild(doubleZeroSpan);
    zeroRow.appendChild(doubleZeroElement);
    zeroRow.appendChild(zeroElement);
    numbersBlock.appendChild(zeroRow);

    // Zahlen 1 bis 36
    let currentNumber = 1;
    while (currentNumber <= 36) {
        let row = document.createElement('div');
        row.classList.add('numbers-row');
        for (let i = 0; i < 3; i++) {
            let numberElement = document.createElement('div');
            numberElement.id = currentNumber;
            let bettingNumber = [currentNumber.toString()];
            numberElement.addEventListener('click', () => bet(bettingNumber, bettingNumber[0]));
            numberElement.classList.add('number');

            // Farbe des Felds bestimmen
            if(redNumbers.includes(currentNumber.toString())) {
                numberElement.style.backgroundColor = 'red';
            }
            else if(blackNumbers.includes(currentNumber.toString())) {
                numberElement.style.backgroundColor = 'black';
            }

            let numberSpan = document.createElement('span');
            numberSpan.textContent = currentNumber;
            numberElement.appendChild(numberSpan);
            row.appendChild(numberElement);

            // Zahl in Gruppen einordnen
            determineGroup(currentNumber);
            currentNumber++;
        }
        numbersBlock.appendChild(row);
    }
    // 2-to-1 Felder
    let twoToOneRow = document.createElement('div');
    twoToOneRow.classList.add('numbers-row');
    for (let i = 0; i < 3; i++) {
        let numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.id = '2to1-' + i;
        numberElement.addEventListener('click', () => bet(rows[i], '2to1-' + i));
        let numberSpan = document.createElement('span');
        numberSpan.textContent = '2 to 1';
        numberElement.appendChild(numberSpan);
        twoToOneRow.appendChild(numberElement);
    }
    numbersBlock.appendChild(twoToOneRow);
}

function spinBall(number) {
    /* Dreht die Kugel, sodass sie auf der Gewinnerzahl stehen bleibt */
    let angle = 9.47 * numbers.indexOf(number) + 4.5;
    angle = angle + 360 * 5;
    const duration = angle * (1000 / 360);
    const spinningBall = [
        { transform: `rotate(0deg)`, scale: 1 },
        { transform: `rotate(${angle}deg)`, scale: 0.8 }
    ];

    const spinningBallTiming = {
        duration: duration,
        iterations: 1,
        easing: 'ease-out'
    };
    rouletteBall.animate(spinningBall, spinningBallTiming);
    rouletteBall.style.transform = `rotate(${angle}deg)`;
    rouletteBall.style.scale = 0.8;
    return duration;
}

function placeChip(id){
    /* Platziert einen Chip auf dem ausgewählten Feld */
    const chip = document.createElement('div');
    chip.classList.add('chip');
    chip.addEventListener('click', (event) => {
        event.stopPropagation();
        chip.remove();
        // Optional: Hier könnte man auch den entsprechenden Einsatz aus activeBets entfernen
    });
    document.getElementById(id).appendChild(chip);
}

function bet(numbers, id) {
    /* Lässt den Nutzer einen Einsatz platzieren.
       Neu: Falls bereits ein Wettformular offen ist, wird kein weiteres geöffnet. */
    if (document.getElementById('bet-form')) return;

    const bettingSettings = document.querySelector('.betting-settings');
    bettingSettings.innerHTML = `
    <form id="bet-form">
        <label for="bet-amount">Bet amount:</label>
        <input type="number" id="bet-amount" min="1" max="1000" value="1">
        <button type="submit">Place bet</button>
    </form>
    `;
    placeChip(id);
    document.getElementById('bet-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = parseInt(document.getElementById('bet-amount').value);
        activeBets.push({ numbers, amount, id });
        bettingSettings.innerHTML = ''; // Formular ausblenden, nachdem der Einsatz gesetzt wurde
        updateSpinButton();
    });
}

function updateSpinButton(){
    /* Fügt einen Spin-Button hinzu, wenn noch keiner existiert */
    const bettingSettings = document.querySelector('.betting-settings');
    if (!document.getElementById('spin-button')) {
        const spinButton = document.createElement('button');
        spinButton.id = 'spin-button';
        spinButton.textContent = 'Spin';
        spinButton.addEventListener('click', () => {
            game();
        });
        bettingSettings.appendChild(spinButton);
    }
}

function getWinningNumber(){
    /* Gibt eine zufällige Gewinnerzahl zurück */
    let winnerIndex = Math.floor(Math.random() * numbers.length);
    return numbers[winnerIndex];
}

function getWinningAmount(amount, betLength){
    /* Berechnet den Gewinn in Relation zum Einsatz */
    if (betLength === 18){
        return 2 * amount;
    }
    if (betLength === 12) {
        return 3 * amount;
    }
    if(betLength === 1){
        return 36 * amount;
    }
    return amount;
}

function winningText(winAmount, win){
    /* Zeigt den Gewinn oder Verlust an */
    const bettingSettings = document.querySelector('.betting-settings');
    const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));
    updateCreditsOnServer(userData.username, account);
    if(win){
        bettingSettings.innerHTML = `
            <p>Du hast <span class="win-amount">${winAmount} Credits</span> gewonnen!</p>
        `;
    }
    else {
        bettingSettings.innerHTML = `
            <p>Du hast <span class="lose-amount">${winAmount} Credits</span> verloren!</p>
        `;
    }
}

function game(){
    /* Führt das Spiel aus und wertet alle aktiven Wetten aus */
    const bettingSettings = document.querySelector('.betting-settings');
    bettingSettings.innerHTML = '';
    let winningNumber = getWinningNumber();
    let duration = spinBall(winningNumber);
    setTimeout(() => {
        let totalWin = 0;
        activeBets.forEach(bet => {
            if(bet.numbers.includes(winningNumber)){
                totalWin += getWinningAmount(bet.amount, bet.numbers.length);
            }
            totalWin -= bet.amount;
        });
        if(totalWin > 0){
            account+=totalWin;
            winningText(totalWin, true);
        } else {
            let totalBet = -totalWin;
            account+=totalWin;
            winningText(totalBet, false);
        }
        // Entferne alle Chips vom Spielfeld
        document.querySelectorAll('.chip').forEach(chip => chip.remove());
        activeBets = [];
    }, duration);
}

function startRoulette(){
    /* Initialisiert Werte und baut den Tisch auf */
    rouletteBall = document.querySelector('.roulette-ball');
    ball = document.querySelector('.ball');
    wheel = document.querySelector('.roulette-wheel');
    numbersContainer = document.querySelector('.roulette-numbers');
    placeBettingField();
    addRouletteWheelNumbers();
}

startRoulette();
