
const div = document.getElementById('gamebox');
const domrect = div.getBoundingClientRect();
const borderSize = 2;
const alphabetLetterSize = 17;

const minX = domrect.x + borderSize;
const maxX = domrect.x + domrect.width - borderSize - alphabetLetterSize - 10;
const maxY = domrect.height - borderSize + 10;
const makeTime = 800;
const moveTime = 30;

const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let alphabetLetterList = [];
let makeInterval = null;
let moveInterval = null;

function init() {
    makeInterval = setInterval(() => {
        const x = rand(minX, maxX);
        createAlphabetLetter(x);    
    }, makeTime);

    moveInterval = setInterval(() => {
        alphabetLetterList.forEach(element => {
            const rect = element.getBoundingClientRect();
            let top = rect.top + 3;

            element.style.top = `${top}px`;

            if (rect.top + rect.height >= maxY) {
                div.removeChild(element);
                const index = alphabetLetterList.indexOf(element);
                alphabetLetterList.splice(index, 1);
            }
        });
    }, moveTime);
}

function pause() {
    clearInterval(makeInterval);
    clearInterval(moveInterval);

    makeInterval = null;
    moveInterval = null;
}

function unpause() {
    if (makeInterval == null && moveInterval == null) {
        init();
    }
}

function reset() {
    clearInterval(makeInterval);
    clearInterval(moveInterval);

    makeInterval = null;
    moveInterval = null;

    alphabetLetterList.forEach((element) => {
        div.removeChild(element);
    });

    alphabetLetterList = [];
    init();
}

(async function() {

    init();

    document.addEventListener ('keypress', (event) => {
        const keyName = event.key.toUpperCase();

        if (keyName === '1') {
            pause()
        } else if (keyName === '2') {
            unpause()
        } else if (keyName === '3') {
            reset()
        }

        if (alphabetLetterList.length > 0) {
            const alphabetLetter = alphabetLetterList[0];
            if (alphabetLetter.innerHTML === keyName) {
                div.removeChild(alphabetLetter);
                alphabetLetterList.splice(0, 1);
            }
        }
    });
}());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function createAlphabetLetter(x) {
    const element = document.createElement('div');
    element.classList.add('alphabet-letter');
    element.style.left = `${x}px`;
    element.style.top = '0px';
    
    const char = charList[rand(0, charList.length)];
    element.innerHTML = char;

    div.appendChild(element);
    alphabetLetterList.push(element);
}