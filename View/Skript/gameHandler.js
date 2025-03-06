//Referenzierte Elemente
const backgroundImage = document.querySelector('.background-image');
const slotMachineButton = document.querySelector('#slot-button');
const rouletteButton = document.querySelector('#roulette-button');
const blackJackButton = document.querySelector('#blackjack-button');
const gameView = document.querySelector('#game');


function closeGame(xOffset){
    /* schließt das Spiel und geht zur ursprünglichen Position zurück */
    gameView.innerHTML = '';
    //Rauszoomen
    const zoomOutTiming = {
        duration: 1000,
        iterations: 1,
        easing: 'ease-out'
    };
    const zoomOut = [
        { transform: `scale(1.5) translateX(${xOffset})` },
        { transform: 'scale(1) translateX(0)' }];

    backgroundImage.animate(zoomOut, zoomOutTiming);
    backgroundImage.style.transform = 'scale(1) translateX(0)';
    //Darstellen der Buttons
    setTimeout(() =>{
        gameView.style.display = 'none';
        document.querySelectorAll('.game-button').forEach((field) => {
            field.style.display = 'flex';
        });
    }, 1000);

}

function startGame(game) {
    /* zoomt in das Bild und lädt das gewählte Spiel */

    gameView.style.display = 'flex';
    //Buttons verschwinden lassen
    document.querySelectorAll('.game-button').forEach((field) => {
        field.style.display = 'none';
    });
    const zoomInTiming = {
        duration: 1000,
        iterations: 1,
        easing: 'ease-out'
    };

    switch (game) {
        case 'slot':
            {
                //An die richtige Position zoomen
                const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.5) translateX(10%)' }]
                backgroundImage.animate(zoomIn, zoomInTiming);
                backgroundImage.style.transform = 'scale(1.5) translateX(10%)';
                //Spiel starten, wenn Animation beendet ist
                setTimeout(() => {
                    gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="./games/slotmachine.html"></iframe>
                    `;
                    //Spiel schließen bei Klicken auf den close-Button
                    document.querySelector(".close-button").addEventListener("click", () => {
                        closeGame('10%');
                    })
                }, 1000);
                break;
            }
        case 'roulette':
            {
                //An die richtige Position zoomen
                const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.5) translateX(-10%)' }]
                backgroundImage.animate(zoomIn, zoomInTiming);
                backgroundImage.style.transform = 'scale(1.5) translateX(-10%)';
                //Spiel starten, wenn Animation beendet ist
                setTimeout(() => {
                    gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="./games/roulette.html"></iframe>
                    `;
                    document.querySelector(".close-button").addEventListener("click", () => {
                        closeGame('-10%');
                    })
                }, 1000);
                break;
            }
        case 'blackjack':
            {
                //An die richtige Position zoomen
                const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.7) translateX(0)' }]
                backgroundImage.animate(zoomIn, zoomInTiming);
                backgroundImage.style.transform = 'scale(1.7) translateX(0)';
                //Spiel starten, wenn Animation beendet ist
                setTimeout(() => {
                    gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="./games/blackjack.html"></iframe>
                    `;
                    //Spiel schließen bei Klicken auf den close-Button
                    document.querySelector(".close-button").addEventListener("click", () => {
                        closeGame('0%');
                    })
                }, 1000);
                break;
            }
    }
}

//Spiele beim Klicken auf die jeweiligen Buttons starten
slotMachineButton.addEventListener('click', () => {
    startGame('slot');
});
rouletteButton.addEventListener('click', () => {
    startGame('roulette');
});
blackJackButton.addEventListener('click', () => {
    startGame('blackjack');
});