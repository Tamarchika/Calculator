
class Calculator {
	constructor(currentOperand, prevOperand) {
		this.currentOperand = currentOperand;
		this.prevOperand = prevOperand;

		this.clear();
	}

	getDisplayNumber(number) {
		const stringNumber = number.toString();

		if (stringNumber !== '' && !isNaN(stringNumber)) {
			if (stringNumber.includes('.')) {
				return `${parseFloat(stringNumber.split('.')[0]).toLocaleString(
					'GE'
				)}.${stringNumber.split('.')[1]}`;
			} else {
				return parseFloat(stringNumber).toLocaleString('GE');
			}
		} else {
			return number;
		}
	}

	clear() {
		this.prevValue = '';
		this.currentValue = '';
		this.operation = undefined;
	}

	delete() {
		this.currentValue = this.currentValue.slice(0, -1);
	}

	appendNumber(number) {
		if (this.hasCalculated) {
			this.currentValue = '';
			this.hasCalculated = false;
		}

		this.currentValue += number;
	}

	chooseOperation(operation) {
		if (this.currentValue === '' || isNaN(this.currentValue)) return;
		if (this.prevValue !== '') {
			this.calculate();
		}

		if (operation === 'sqrt') {
			this.operation = operation;
			this.calculate();
		} else {
			this.prevValue = this.currentValue;
			this.currentValue = '';
			this.operation = operation;
		}
	}

	calculate() {
		let result;
		const prevValue = parseFloat(this.prevValue);
		const currentValue = parseFloat(this.currentValue);
		const operation = this.operation;

		const strPrevValue = prevValue.toString();
		const strCurrentValue = currentValue.toString();
		const dpNum1 = !!(prevValue % 1)
				? strPrevValue.length - strPrevValue.indexOf('.') - 1
				: 0,
			dpNum2 = !!(currentValue % 1)
				? strCurrentValue.length - strCurrentValue.indexOf('.') - 1
				: 0,
			multiplier = Math.pow(10, dpNum1 > dpNum2 ? dpNum1 : dpNum2),
			tempNum1 = Math.round(prevValue * multiplier),
			tempNum2 = Math.round(currentValue * multiplier);

            switch (operation) {
                case '/':
                    if (tempNum2 === 0) {
                        result = 'ERROR';
                    } else {
                        result = Number((tempNum1 / tempNum2).toString().substring(0,10));
                    }
                    break;
                case '*':
                    result = Number(((tempNum1 * tempNum2) / (multiplier * multiplier)).toString().substring(0,10));
                    break;
                case '+':
                        result = Number(((tempNum1 + tempNum2) / multiplier).toString().substring(0,10)) ;
                    break;
                case '-':
                    result = Number(((tempNum1 - tempNum2) / multiplier).toString().substring(0,10));
    
                    break;
                case '^':
                    result = Number((prevValue ** currentValue).toString().substring(0,10)); 
                    break;
                case 'sqrt':
                    if (currentValue < 0) {
                        result = 'Error';
                    } else {
                        result = Number((Math.sqrt(currentValue)).toString().substring(0,10));
                    }
                    break;
                case '%':
                    result = prevValue * currentValue / 100;
                    break;
                default:
                    return;
            }

		this.currentValue = result;
		this.prevValue = '';
		this.operation = undefined;
		this.hasCalculated = true;
	}
	updateDisplay() {
		this.currentOperand.innerText = this.getDisplayNumber(this.currentValue);
		if (this.operation !== undefined) {
			this.prevOperand.innerText = `${this.getDisplayNumber(this.prevValue)} ${
				this.operation
			}`;
		} else {
			this.prevOperand.innerText = '';
		}
	}

	addDecimal() {
		if (
			this.currentValue.toString().includes('.') ||
			isNaN(this.currentValue)
		)
			return;
		if (this.currentValue !== '') {
			this.currentValue = `${this.currentValue}.`;
		} else {
			this.currentValue = '0.';
		}
	}

	addNegativeSign() {
		if (this.currentValue === '') return;
		this.currentValue = parseFloat(this.currentValue) * -1;
	}
}

const numberBtns = document.querySelectorAll('[data-number]');
const operationBtns = document.querySelectorAll('[data-operation');
const clearBtn = document.querySelector('[data-all-clear]');
const delBtn = document.querySelector('[data-delete]');
const decimalBtn = document.querySelector('[data-decimal]');
const equalsBtn = document.querySelector('[data-equals]');
const negPosBtn = document.querySelector('[data-neg-pos]');
const prevOperand = document.querySelector('.prev-input');
const currentOperand = document.querySelector('.current-input');

const calculator = new Calculator(currentOperand, prevOperand);

numberBtns.forEach((numBtn) => {
	numBtn.addEventListener('click', (e) => {
		const number = e.target.dataset.value;
		calculator.appendNumber(number);
		calculator.updateDisplay();
	});
});

operationBtns.forEach((operationBtn) => {
	operationBtn.addEventListener(
		'click',
		(e) => {
			const operation = e.target.dataset.value;
			calculator.chooseOperation(operation);
			calculator.updateDisplay();
		},
		true
	);
});

clearBtn.addEventListener('click', (e) => {
	calculator.clear();
	calculator.updateDisplay();
});

delBtn.addEventListener('click', (e) => {
	calculator.delete();
	calculator.updateDisplay();
});

decimalBtn.addEventListener('click', (e) => {
	calculator.addDecimal();
	calculator.updateDisplay();
});

negPosBtn.addEventListener('click', (e) => {
	calculator.addNegativeSign();
	calculator.updateDisplay();
});

equalsBtn.addEventListener('click', (e) => {
	calculator.calculate();
	calculator.updateDisplay();
});
