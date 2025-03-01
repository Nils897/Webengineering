const overlay = document.querySelector('#overlay img');
const slotField = document.querySelector('#slot-field');
const rouletteField = document.querySelector('#roulette-field');
const blackJackField = document.querySelector('#blackjack-field');
const gameView = document.querySelector('#game');


function closeGame(xOffset){
    gameView.innerHTML = '';
    const zoomOutTiming = {
        duration: 1000,
        iterations: 1,
        easing: 'ease-out'
    };
    const zoomOut = [
        { transform: `scale(1.5) translateX(${xOffset})` },
        { transform: 'scale(1) translateX(0)' }];

    overlay.animate(zoomOut, zoomOutTiming);
    overlay.style.transform = 'scale(1) translateX(0)';
    setTimeout(() =>{
        gameView.style.display = 'none';
        document.querySelectorAll('.clickable-field').forEach((field) => {
            field.style.display = 'flex';
        });
    }, 1000);

}

function startGame(game) {
    gameView.style.display = 'flex';
    document.querySelectorAll('.clickable-field').forEach((field) => {
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
                const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.5) translateX(10%)' }]
                overlay.animate(zoomIn, zoomInTiming);
                overlay.style.transform = 'scale(1.5) translateX(10%)';
                setTimeout(() => {
                    console.log('slot machine game started');
                }, 1000);
                break;
            }
        case 'roulette':
            {
                const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.5) translateX(-10%)' }]
                overlay.animate(zoomIn, zoomInTiming);
                overlay.style.transform = 'scale(1.5) translateX(-10%)';
                setTimeout(() => {
                    gameView.innerHTML = `
                    <button class="close-button">&#10006;</button>
                    <iframe src="roulette.html"></iframe>
                    `;
                    document.querySelector(".close-button").addEventListener("click", () => {
                        closeGame('-10%');
                    })
                }, 1000);
                break;
            }
        case 'blackjack':
            {
                const zoomIn = [
                { transform: 'scale(1) translateX(0)' },
                { transform: 'scale(1.7) translateX(0)' }]
                overlay.animate(zoomIn, zoomInTiming);
                overlay.style.transform = 'scale(1.7) translateX(0)';
                setTimeout(() => {
                    console.log('Blackjack game started');
                }, 1000);
                break;
            }
    }
}

slotField.addEventListener('click', () => {
    startGame('slot');
});
rouletteField.addEventListener('click', () => {
    startGame('roulette');
});
blackJackField.addEventListener('click', () => {
    startGame('blackjack');
});