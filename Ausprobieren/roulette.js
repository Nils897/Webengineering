const rouletteBall = document.querySelector('.roulette-ball');
const ball = document.querySelector('.ball');
const wheel = document.querySelector('.roulette-wheel');
const numbersContainer = document.querySelector('.roulette-numbers');



let numbers = ['00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2', '0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1'];
const redNumbers = ['27', '25', '12', '19', '18', '21', '16', '23', '14', '9', '30', '7', '32', '5', '34', '3', '36', '1'];
const blackNumbers = ['10', '29', '8', '31', '6', '33', '4', '35', '2', '0', '28', '26', '11', '20', '17', '22', '15', '24', '13'];

//other betting options
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

// Add numbers to the roulette wheel
const angleStep = 360 / numbers.length;
numbers.forEach((number, index) => {
    const numberElement = document.createElement('div');
    numberElement.classList.add('roulette-number');
    numberElement.textContent = number;
    const angle = index * angleStep;
    numberElement.style.transform = `rotate(${angle}deg) translate(22.5vh) rotate(90deg)`;
    numbersContainer.appendChild(numberElement);
    numbersContainer.style.transform = `rotate(-85.2deg)`;
});



function determineGroup(number) {
    //first, second and third twelve
    if (number <= 12) {
        firstTwelve.push(number.toString());
    }
    else if (number >= 12 && number <= 24) {
        secondTwelve.push(number.toString());
    }
    else{
        thirdTwelve.push(number.toString());
    }

    //first and second half
    if (number <= 18) {
        firstHalf.push(number.toString());
    }
    else {
        secondHalf.push(number.toString());
    }

    //first, second and third row
    if (number % 3 === 1) {
        firstRow.push(number.toString());
    }
    else if (number % 3 === 2) {
        secondRow.push(number.toString());
    }
    else {
        thirdRow.push(number.toString());
    }

    //odd and even numbers
    if (number % 2 === 0) {
        evenNumbers.push(number.toString());
    }  
    else {
        oddNumbers.push(number.toString());
    }

}

function placeBettingField(){
    //Add numbers to the betting section
    const numbersBlock = document.querySelector('.numbers-block');
    
    //Add the zero and double zero
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

    //add numbers from 1 to 36
    let currentNumber = 1;
    while (currentNumber <= 36) {
    let row = document.createElement('div');
    row.classList.add('numbers-row');
    for (let i = 0; i < 3; i++) {
        //create the number html element
        let numberElement = document.createElement('div');
        numberElement.id = currentNumber;

        //add click event listener to place the bet
        let bettingNumber = [currentNumber.toString()];
        numberElement.addEventListener('click', () => bet(bettingNumber, bettingNumber[0]));
        numberElement.classList.add('number');

        //decide the color of the number field
        if(redNumbers.includes(currentNumber.toString())) {
            numberElement.style.backgroundColor = 'red';
        }
        else if(blackNumbers.includes(currentNumber.toString())) {
            numberElement.style.backgroundColor = 'black';
        }
        
        //write the number in the field (and rotate it)
        let numberSpan = document.createElement('span');
        numberSpan.textContent = currentNumber;
        numberElement.appendChild(numberSpan);
        row.appendChild(numberElement);

        //determine the groups of the numbers
        determineGroup(currentNumber);

        currentNumber++;
    }
    numbersBlock.appendChild(row);
    }
    //add the 2 to 1 row
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





//gets the winning number and spins the ball to that number (number must be a string)
function spinBall(number) {
    // spins the ball 5 times before landing on the final angle
    let angle = 9.47 * numbers.indexOf(number);
    angle = angle + 360 * 5;
    const spinningBall = [
        { transform: `rotate(${0}deg)`, scale: 1 },
        { transform: `rotate(${angle}deg)`, scale: 0.8 }
    ]

    // the ball takes 1s to spin 360 degrees and eases out towards the end
    const spinningBallTiming = {
        duration: angle * (1000 / 360),
        iterations: 1,
        easing: 'ease-out' 
    }
    rouletteBall.animate(spinningBall, spinningBallTiming);
    rouletteBall.style.transform = `rotate(${angle}deg)`;
    rouletteBall.style.scale = 0.8;
}


function placeChip(id){
    //remove all chips from the field
    document.querySelectorAll('.chip').forEach(chip => chip.remove());
    const chip = document.createElement('div');
    chip.classList.add('chip');
    //add possibility to remove the chip
    chip.addEventListener('click', (event) => {
        document.querySelector('.betting-settings').innerHTML = '';
        event.stopPropagation();
        chip.remove();
    });
    //add the chip to the selected field
    document.getElementById(id).appendChild(chip);

    
}


function bet(numbers, id) {
    //make form appear to place bet
    const bettingSettings = document.querySelector('.betting-settings');
    bettingSettings.innerHTML = `
    <form id="bet-form">
        <label for="bet-amount">Bet amount:</label>
        <input id="bet-amount" type="number" id="bet-amount" min="1" max="${/*account balance*/ 1000}" value="1">
        <button type="submit">Place bet</button>
    </form>
    `;
    placeChip(id);
    document.getElementById('bet-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = document.getElementById('bet-amount').value;
        game(numbers, amount);
    });
}


function game(numbers, amount){
    document.querySelector('.betting-settings').innerHTML = '';
    //interaction with backend here
    spinBall(numbers[0]);
}


placeBettingField();





