const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let operator = null;
let firstOperand = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    currentInput = digit;
    waitingForSecondOperand = false;
  } else {
    // Prevent leading zeros like 00, but allow 0.x decimals
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentInput = '0.';
    waitingForSecondOperand = false;
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  if (operator && waitingForSecondOperand) {
    // Allows operator change before typing next number
    operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    currentInput = String(result);
    firstOperand = result;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
}

function calculate(first, second, operator) {
  if (operator === '+') {
    return first + second;
  } else if (operator === '-') {
    return first - second;
  } else if (operator === '*') {
    return first * second;
  } else if (operator === '/') {
    if (second === 0) {
      alert("Error: Division by zero");
      return first;
    }
    return first / second;
  }
  return second;
}

function resetCalculator() {
  currentInput = '0';
  operator = null;
  firstOperand = null;
  waitingForSecondOperand = false;
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('number')) {
      inputDigit(button.getAttribute('data-number'));
      updateDisplay();
    } else if (button.classList.contains('operator')) {
      handleOperator(button.getAttribute('data-operator'));
      updateDisplay();
    } else if (button.id === 'decimal') {
      inputDecimal();
      updateDisplay();
    } else if (button.id === 'clear') {
      resetCalculator();
      updateDisplay();
    } else if (button.id === 'equals') {
      if (operator && !waitingForSecondOperand) {
        handleOperator(null);
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
        updateDisplay();
      }
    }
  });
});

// Initialize display
updateDisplay();

