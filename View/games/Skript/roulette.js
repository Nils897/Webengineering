/* -----------------------------------
 * Globale Variablen und Konstanten
 * ----------------------------------- */

// Spielfelder und UI-Elemente
let rouletteBall;
let ball;
let wheel;
let numbersContainer;

// Spielstatus
let account = getAccountCredits();
let activeBets = []; // Speichert alle aktiven Wetten

// Roulette-Zahlen
let numbers = ['00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2', '0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1'];
const redNumbers = ['27', '25', '12', '19', '18', '21', '16', '23', '14', '9', '30', '7', '32', '5', '34', '3', '36', '1'];
const blackNumbers = ['10', '29', '8', '31', '6', '33', '4', '35', '2', '28', '26', '11', '20', '17', '22', '15', '24', '13'];

// Gruppen für Wettmöglichkeiten
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


/* -----------------------------------
 * Initialisierung des Spiels
 * ----------------------------------- */

/**
 * Startet das Roulette-Spiel. Initialisiert Spielflächen und UI-Komponenten.
 */
function startRoulette() {
    rouletteBall = document.querySelector('.roulette-ball');
    ball = document.querySelector('.ball');
    wheel = document.querySelector('.roulette-wheel');
    numbersContainer = document.querySelector('.roulette-numbers');

    placeBettingField();
    addRouletteWheelNumbers();
}

startRoulette();


/* -----------------------------------
 * Funktionen für das Spielfeld
 * ----------------------------------- */

/**
 * Fügt dem Roulette-Rad alle Zahlen hinzu.
 */
function addRouletteWheelNumbers() {
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

/**
 * Erstellt das Wettfeld für alle Zahlen und Sonderwetten.
 */
function placeBettingField() {
    const numbersBlock = document.querySelector('.numbers-block');

    // '0' und '00' Felder
    let zeroRow = document.createElement('div');
    zeroRow.classList.add('numbers-row');

    let zeroElement = createNumberElement('0');
    let doubleZeroElement = createNumberElement('00');

    zeroRow.appendChild(doubleZeroElement);
    zeroRow.appendChild(zeroElement);
    numbersBlock.appendChild(zeroRow);

    // Zahlen 1 bis 36 in Reihen anlegen
    let currentNumber = 1;

    while (currentNumber <= 36) {
        let row = document.createElement('div');
        row.classList.add('numbers-row');

        for (let i = 0; i < 3; i++) {
            let numberElement = createNumberElement(currentNumber.toString());
            row.appendChild(numberElement);

            determineGroup(currentNumber);
            currentNumber++;
        }

        numbersBlock.appendChild(row);
    }

    // "2-to-1" Felder für die Reihenwetten
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

/**
 * Erstellt ein Zahlenfeld-Element für die Wettfläche.
 * @param {string} number - Die Nummer des Feldes.
 * @returns {HTMLElement} - Das erstellte DOM-Element.
 */
function createNumberElement(number) {
    let numberElement = document.createElement('div');
    numberElement.id = number;
    numberElement.classList.add('number');

    numberElement.addEventListener('click', () => bet([number], number));

    // Bestimme die Hintergrundfarbe
    if (redNumbers.includes(number)) {
        numberElement.style.backgroundColor = 'red';
    } else if (blackNumbers.includes(number)) {
        numberElement.style.backgroundColor = 'black';
    }

    let numberSpan = document.createElement('span');
    numberSpan.textContent = number;

    numberElement.appendChild(numberSpan);

    return numberElement;
}


/* -----------------------------------
 * Funktionen zur Gruppenzuordnung
 * ----------------------------------- */

/**
 * Ordnet eine Zahl den verschiedenen Wettgruppen zu.
 * @param {number} number - Die Zahl, die zugeordnet werden soll.
 */
function determineGroup(number) {
    // Zwölfer-Blöcke
    if (number <= 12) {
        firstTwelve.push(number.toString());
    } else if (number > 12 && number <= 24) {
        secondTwelve.push(number.toString());
    } else if (number > 24 && number <= 36) {
        thirdTwelve.push(number.toString());
    } else {
        secondHalf.push(number.toString());
    }

    // Reihen
    if (number % 3 === 1) {
        firstRow.push(number.toString());
    } else if (number % 3 === 2) {
        secondRow.push(number.toString());
    } else {
        thirdRow.push(number.toString());
    }

    // Gerade/Ungerade
    if (number % 2 === 0) {
        evenNumbers.push(number.toString());
    } else {
        oddNumbers.push(number.toString());
    }

    // 1-18 / 19-36
    if (number <= 18) {
        firstHalf.push(number.toString());
    } else {
        secondHalf.push(number.toString());
    }
}


/* -----------------------------------
 * Funktionen für das Setzen und Drehen
 * ----------------------------------- */

/**
 * Lässt den Nutzer einen Einsatz platzieren.
 * @param {string[]} numbers - Die Zahlen, auf die gesetzt wird.
 * @param {string} id - Die ID des Feldes.
 */
function bet(numbers, id) {
    if (document.getElementById('bet-form')) return;

    const bettingSettings = document.querySelector('.betting-settings');

    bettingSettings.innerHTML = `
        <form id="bet-form">
            <label for="bet-amount">Einsatz:</label>
            <input type="number" id="bet-amount" min="1" max="${account}" value="1">
            <button type="submit">Setzen</button>
        </form>
    `;

    placeChip(id);

    document.getElementById('bet-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const amount = parseInt(document.getElementById('bet-amount').value);
        activeBets.push({ numbers, amount, id });

        bettingSettings.innerHTML = '';
        updateSpinButton();
    });
}

/**
 * Platziert einen Chip auf dem gewählten Feld.
 * @param {string} id - Die ID des Feldes.
 */
function placeChip(id) {
    const chip = document.createElement('div');
    chip.classList.add('chip');

    chip.addEventListener('click', (event) => {
        event.stopPropagation();
        chip.remove();
        // Optional: Einsatz aus activeBets entfernen
    });

    document.getElementById(id).appendChild(chip);
}

/**
 * Fügt den Spin-Button hinzu, falls noch keiner existiert.
 */
function updateSpinButton() {
    const bettingSettings = document.querySelector('.betting-settings');

    if (!document.getElementById('spin-button')) {
        const spinButton = document.createElement('button');
        spinButton.id = 'spin-button';
        spinButton.textContent = 'Drehen';

        spinButton.addEventListener('click', () => {
            game();
        });

        bettingSettings.appendChild(spinButton);
    }
}

/**
 * Startet die Kugel-Animation und bestimmt den Gewinner.
 * @returns {number} - Die Dauer der Animation.
 */
function spinBall(number) {
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


/* -----------------------------------
 * Spiellogik und Auswertung
 * ----------------------------------- */

/**
 * Startet das Spiel, dreht das Rad und wertet die Wetten aus.
 */
function game() {
    const bettingSettings = document.querySelector('.betting-settings');
    bettingSettings.innerHTML = '';

    let winningNumber = getWinningNumber();
    let duration = spinBall(winningNumber);

    setTimeout(() => {
        let totalWin = 0;

        activeBets.forEach(bet => {
            if (bet.numbers.includes(winningNumber)) {
                totalWin += getWinningAmount(bet.amount, bet.numbers.length);
            }
            totalWin -= bet.amount;
        });

        account += totalWin;

        if (totalWin > 0) {
            winningText(totalWin, true);
        } else {
            let totalBet = -totalWin;
            winningText(totalBet, false);
        }

        document.querySelectorAll('.chip').forEach(chip => chip.remove());
        activeBets = [];

    }, duration);
}

/**
 * Gibt eine zufällige Gewinnerzahl zurück.
 * @returns {string} - Die Gewinnerzahl.
 */
function getWinningNumber() {
    let winnerIndex = Math.floor(Math.random() * numbers.length);
    return numbers[winnerIndex];
}

/**
 * Berechnet den Gewinn in Relation zum Einsatz.
 * @param {number} amount - Einsatzbetrag.
 * @param {number} betLength - Anzahl abgedeckter Zahlen.
 * @returns {number} - Gewinnbetrag.
 */
function getWinningAmount(amount, betLength) {
    if (betLength === 18) return 2 * amount;
    if (betLength === 12) return 3 * amount;
    if (betLength === 1) return 36 * amount;
    return amount;
}

/**
 * Zeigt Gewinn- oder Verlustmeldung an.
 * @param {number} winAmount - Betrag des Gewinns/Verlusts.
 * @param {boolean} win - Gibt an, ob gewonnen oder verloren wurde.
 */
function winningText(winAmount, win) {
    const bettingSettings = document.querySelector('.betting-settings');
    const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));

    updateCreditsOnServer(userData.username, account);

    bettingSettings.innerHTML = win
        ? `<p>Du hast <span class="win-amount">${winAmount} Credits</span> gewonnen!</p>`
        : `<p>Du hast <span class="lose-amount">${winAmount} Credits</span> verloren!</p>`;
}
