
class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['number', 'color'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const number = this.getAttribute('number') || '';
        const color = this.getAttribute('color') || '#444';

        this.shadowRoot.innerHTML = `
            <style>
                .ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    background: radial-gradient(circle at 20px 20px, ${color}, #333);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.2);
                    animation: appear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    user-select: none;
                }

                @keyframes appear {
                    from {
                        transform: scale(0) rotate(-180deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotate(0);
                        opacity: 1;
                    }
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }
}

customElements.define('lotto-ball', LottoBall);

const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const historyList = document.getElementById('history-list');

const colors = [
    '#ff8c00', // Orange
    '#ff2d55', // Pink
    '#4caf50', // Green
    '#2196f3', // Blue
    '#9c27b0', // Purple
    '#ffeb3b', // Yellow
];

let history = [];

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

function generateNumbers() {
    const currentBalls = lottoNumbersContainer.querySelectorAll('lotto-ball');
    if (currentBalls.length > 0) {
        const currentNumbers = Array.from(currentBalls).map(ball => ball.getAttribute('number'));
        addToHistory(currentNumbers);
    }

    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        setTimeout(() => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            lottoBall.setAttribute('color', colors[index % colors.length]);
            lottoNumbersContainer.appendChild(lottoBall);
        }, index * 100);
    });
}

function addToHistory(numbers) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    history.unshift({ numbers, time });
    if (history.length > 10) history.pop();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        const numbersContainer = document.createElement('div');
        numbersContainer.classList.add('history-numbers');
        
        item.numbers.forEach(num => {
            const ball = document.createElement('div');
            ball.classList.add('history-ball');
            ball.textContent = num;
            numbersContainer.appendChild(ball);
        });
        
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('history-time');
        timeSpan.textContent = item.time;
        
        historyItem.appendChild(numbersContainer);
        historyItem.appendChild(timeSpan);
        historyList.appendChild(historyItem);
    });
}

generateBtn.addEventListener('click', generateNumbers);

// Initial Setup
initTheme();
generateNumbers();
