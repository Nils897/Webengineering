// Referenzierte Elemente
const backgroundImage = document.querySelector('.background-image');
const slotMachineButton = document.querySelector('#slot-button');
const rouletteButton = document.querySelector('#roulette-button');
const blackJackButton = document.querySelector('#blackjack-button');
const gameView = document.querySelector('#game');

/**
 * Schließt das aktuell laufende Spiel und setzt die Ansicht zurück.
 *
 * @param {string} xOffset - Der horizontale Versatz für die Zoom-Animation beim Schließen.
 */
function closeGame(xOffset) {
    gameView.innerHTML = '';

    const zoomOutTiming = {
        duration: 1000,
        iterations: 1,
        easing: 'ease-out'
    };
    const zoomOut = [
        { transform: `scale(1.5) translateX(${xOffset})` },
        { transform: 'scale(1) translateX(0)' }
    ];

    backgroundImage.animate(zoomOut, zoomOutTiming);
    backgroundImage.style.transform = 'scale(1) translateX(0)';

    setTimeout(() => {
        gameView.style.display = 'none';
        document.querySelectorAll('.game-button').forEach((field) => {
            field.style.display = 'flex';
        });
    }, 1000);
}

/**
 * Startet das ausgewählte Spiel, führt eine Zoom-Animation durch
 * und lädt das Spiel in ein iframe.
 *
 * @param {string} game - Der Name des Spiels, das gestartet werden soll (z. B. 'slot', 'roulette', 'blackjack').
 */
function startGame(game) {
    const userData = sessionStorage.getItem("loggedInUser");
    if (!userData) {
        console.error("Kein eingeloggter Benutzer gefunden!");
        alert("Bitte logge dich zuerst ein!");
        window.location.href = "../logIn.html";
        return;
    }

    gameView.style.display = 'flex';

    document.querySelectorAll('.game-button').forEach((field) => {
        field.style.display = 'none';
    });

    const zoomInTiming = {
        duration: 1000,
        iterations: 1,
        easing: 'ease-out'
    };

    switch (game) {
        case 'slot': {
            const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.5) translateX(10%)' }
            ];
            backgroundImage.animate(zoomIn, zoomInTiming);
            backgroundImage.style.transform = 'scale(1.5) translateX(10%)';

            setTimeout(() => {
                gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="./games/slotmachine.html"></iframe>
                `;
                document.querySelector(".close-button").addEventListener("click", () => {
                    closeGame('10%');
                });
            }, 1000);
            break;
        }
        case 'roulette': {
            const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.5) translateX(-10%)' }
            ];
            backgroundImage.animate(zoomIn, zoomInTiming);
            backgroundImage.style.transform = 'scale(1.5) translateX(-10%)';

            setTimeout(() => {
                gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="./games/roulette.html"></iframe>
                `;
                document.querySelector(".close-button").addEventListener("click", () => {
                    closeGame('-10%');
                });
            }, 1000);
            break;
        }
        case 'blackjack': {
            const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.7) translateX(0)' }
            ];
            backgroundImage.animate(zoomIn, zoomInTiming);
            backgroundImage.style.transform = 'scale(1.7) translateX(0)';

            setTimeout(() => {
                gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="./games/blackjack.html"></iframe>
                `;
                document.querySelector(".close-button").addEventListener("click", () => {
                    closeGame('0%');
                });
            }, 1000);
            break;
        }
    }
}

// Event-Listener für die Buttons zum Starten der Spiele
slotMachineButton.addEventListener('click', () => {
    startGame('slot');
});
rouletteButton.addEventListener('click', () => {
    startGame('roulette');
});
blackJackButton.addEventListener('click', () => {
    startGame('blackjack');
});
