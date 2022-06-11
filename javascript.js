// interact with the display of the calculator
// when buttons clicked display will show them
const display = document.querySelector('.display');

// event listeners and handlers for when buttons are clicked

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