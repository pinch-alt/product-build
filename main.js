
class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const number = this.getAttribute('number');
        const color = this.getAttribute('color');

        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.style.setProperty('--ball-color', color);
        ball.textContent = number;

        const style = document.createElement('style');
        style.textContent = `
            .ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                background: radial-gradient(circle at 20px 20px, var(--ball-color), #333);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2);
                animation: appear 0.5s ease-out forwards;
            }

            @keyframes appear {
                from {
                    transform: scale(0);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(ball);
    }
}

customElements.define('lotto-ball', LottoBall);

const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

const colors = [
    'var(--ball-color-1)',
    'var(--ball-color-2)',
    'var(--ball-color-3)',
    'var(--ball-color-4)',
    'var(--ball-color-5)',
    'var(--ball-color-6)',
];

function generateNumbers() {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoBall.setAttribute('color', colors[index]);
        lottoNumbersContainer.appendChild(lottoBall);
    });
}

generateBtn.addEventListener('click', generateNumbers);

// Generate initial numbers on page load
generateNumbers();
