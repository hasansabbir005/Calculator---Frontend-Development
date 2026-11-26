const previousOperandText = document.getElementById('previousOperand');
const currentOperandText = document.getElementById('currentOperand');

let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandText.textContent = currentOperand;
  if (operation != null) {
    previousOperandText.textContent = `${previousOperand} ${operation}`;
  } else {
    previousOperandText.textContent = '';
  }
}

function appendNumber(number) {
  if (currentOperand === 'Error' || shouldResetScreen) {
    currentOperand = number === '.' ? '0.' : number;
    shouldResetScreen = false;
    updateDisplay();
    return;
  }

  if (number === '.' && currentOperand.includes('.')) return;
  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === 'Error') clearAll();
  if (currentOperand === '' && previousOperand === '') return;

  if (previousOperand !== '' && !shouldResetScreen) {
    compute();
  }

  operation = op;
  previousOperand = currentOperand;
  shouldResetScreen = true;
  updateDisplay();
}

function compute() {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return;

  let result;
  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      if (current === 0) {
        currentOperand = 'Error';
        previousOperand = '';
        operation = undefined;
        shouldResetScreen = true;
        updateDisplay();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }


  currentOperand = String(Math.round(result * 1e10) / 1e10);
  operation = undefined;
  previousOperand = '';
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLast() {
  if (currentOperand === 'Error' || shouldResetScreen) {
    clearAll();
    return;
  }
  if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.slice(0, -1);
  }
  updateDisplay();
}


document.querySelectorAll('[data-number]').forEach(btn => {
  btn.addEventListener('click', () => appendNumber(btn.dataset.number));
});

document.querySelectorAll('[data-operator]').forEach(btn => {
  btn.addEventListener('click', () => chooseOperation(btn.dataset.operator));
});

document.querySelector('[data-action="equals"]').addEventListener('click', compute);
document.querySelector('[data-action="clear"]').addEventListener('click', clearAll);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);


document.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
  } else if (e.key === '+' || e.key === '-') {
    chooseOperation(e.key);
  } else if (e.key === '*') {
    chooseOperation('×');
  } else if (e.key === '/') {
    e.preventDefault();
    chooseOperation('÷');
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    compute();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Escape') {
    clearAll();
  }
});