// interact with the display of the calculator
// when buttons clicked display will show them

const display = document.querySelector('.display');
display.textContent = '' // as page loads empty the content

// event listeners and handlers for when buttons are clicked
const buttons = document.querySelectorAll('.keyrow button');

buttons.forEach(button => {
    button.addEventListener('click', handleButtonClickEvent);
    button.addEventListener('mouseover', handleButtonHoverEvent);
    button.addEventListener('mouseleave', handleButtonMouseleaveEvent);
    button.addEventListener('mousedown', handleButtonMousedownEvent);
    button.addEventListener('mouseup', handleButtonMouseupEvent);
});

function handleButtonHoverEvent(e) {
    this.classList.add('hover');
}

function handleButtonMouseleaveEvent(e) {
    this.classList.remove('hover');
}

function handleButtonMousedownEvent(e) {
    this.classList.add('clicked');
}

function handleButtonMouseupEvent(e) {
    this.classList.remove('clicked');
}

/* 
when button is clicked, add character to display or make appropriate changes
    0123456789.+-*%/^ => add character to display
    del => delete last characted
    c => clear the contents
    = (equal button) => clear the contents, calculate the result and then display it
*/

function handleButtonClickEvent(e) {
    const action = this.textContent;

    switch(action) {
        case 'del': 
            handleDeleteClickEvent();
            break;
        case  'C':
            handleClearClickEvent();
            break;
        case '=':
            handleEqualsClickEvent();
            break;
        default:
            handleCharClickEvent(action);
    }
}

function handleDeleteClickEvent() {
    const currentDisplayText = display.textContent;

    if (currentDisplayText.length == 0) return;

    display.textContent = currentDisplayText.slice(0, currentDisplayText.length-1);
}

function handleClearClickEvent() {
    display.textContent = '';
}

// input validation in handleCharClickEvent
// if char is a number and another number or nothing precedes it, then simply concatenate the char to the display
// if an operator is clicked and a number precedes it, then concatenate it
// else if another operator precedes it, replace the operator
// else if nothing precedes an operator, then don't add the operator

function handleCharClickEvent(newChar) {
    const currentDisplayText = display.textContent;
    const lastDisplayChar = currentDisplayText.charAt(currentDisplayText.length-1);

    // exceptions
    if (newChar.match(/[\+\-\*\/%\^]/)) { // newChar is + or - or * or / or % or ^
        if (lastDisplayChar.match(/[\+\-\*\/%\^]/)) {
            display.textContent = currentDisplayText.slice(0, currentDisplayText.length - 1).concat(newChar);
            return;
        }
        if (lastDisplayChar == '') {
            return;
        }
    }
    else if (newChar == '.') { 
        if (currentDisplayText.match(/\.[0-9]*$/)) { // a number already is a float, does not add another dot as it is an error otherwise
            return;
        }
    }

    // if all exceptions passed
    display.textContent = currentDisplayText.concat(newChar);
}

// equals is clicked: handle mathematical operation and display the correct value or 'ERROR' if something went wrong
// if there is only one number followed by an operator, then simply return the number

function handleEqualsClickEvent() {
    const currentDisplayText = display.textContent;

    // other than this exception, all other exceptions should have been handled by handleCharClickEvent
    if (currentDisplayText.match(/[\+\-\*\/%\^]$/)) {
        console.info('The expression shouldn\'t end with an operator!');
        return;
    }

    // if there are no operators then log it and return
    if (!currentDisplayText.match(/[\+\-\*\/%\^]/g)) {
        console.info('No operators => no evaluation');
        return;
    }

    // division by zero exception
    // regex: (any chars any nr of times) followed by (division) followed by (0 or 0000 or 0.0000 or any zero) followed by other stuff
    if (currentDisplayText.match(/^(.*\/)(0+\.?0*)([\+\-\*\/%\^].*)?$/g)) {
        console.warn('ERROR: division by zero not allowed');
        display.textContent = 'ERROR: division by zero not allowed';
        return;
    }

    // exceptions should be handled by handleCharClickEvent and handleEqualsClickEvent such that numbers array must be
    // larger than operations array by one element
    // operations are handled by order of entry, not the standard operator ordering in maths
    // an example: 5 + 3 * 7 - 50 ^ 2 = 8 * 7 - 50 ^ 2 = 56 - 50 ^ 2 = 6 ^ 2 = 36 

    const numbers = currentDisplayText.match(/[0-9\.]+/g).map(number => {
        return Number(number);
    });

    const operations = currentDisplayText.match(/[\+\-\*\/%\^]/g).map(operation => {
        switch (operation) {
            case '+': return add;
            case '-': return subtract;
            case '*': return multiply;
            case '/': return divide;
            case '%': return modulo;
            case '^': return power;
            default: return 'operationParseError';
        }
    })

    const returnValue = numbers.reduce((returnValue, currentNumber, currentIndex, array) => {
        if (returnValue) {
            return operate(operations[currentIndex-1], returnValue, currentNumber);
        }
        return currentNumber;
    }, null);

    display.textContent = String(returnValue);
    return;
}


// mathematical operations for when '=' equals button is clicked:

function operate(operator, a, b) {
    return operator(a, b);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function modulo(a, b) {
    return a % b;
}

function power(a, b) {
    return a ** b;
}