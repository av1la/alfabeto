class TypingGame {

    constructor() {
        this.DIV = document.getElementById('gamebox');
        this.SCORE_ELEMENT = document.getElementById('score');
        this.DOMRECT = this.DIV.getBoundingClientRect();
        this.BORDER_SIZE = 2;
        this.ALPHABET_LETTER_SIZE = 17;
        this.BASE_MAKE_TIME = 800;
        this.BASE_MOVE_TIME = 30;
        this.CHAR_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        this.ACTIONS = {
            PAUSE: '1',
            UNPAUSE: '2',
            RESTART: '3'
        };

        this.gameState = {
            alphabetLetterList: [],
            makeInterval: null,
            moveInterval: null,
            score: 0,
            isGamePaused: false,
            isPlayerPaused: false,
            isSystemPaused: false,
            makeTime: this.BASE_MAKE_TIME,
            moveTime: this.BASE_MOVE_TIME,
            minX: this.DOMRECT.x + this.BORDER_SIZE,
            maxX: this.DOMRECT.x + this.DOMRECT.width - this.BORDER_SIZE - this.ALPHABET_LETTER_SIZE - 10,
            maxY: this.DOMRECT.y + this.DOMRECT.height - this.BORDER_SIZE
        };
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    clearIntervals() {
        clearInterval(this.gameState.makeInterval);
        clearInterval(this.gameState.moveInterval);
        this.gameState.makeInterval = null;
        this.gameState.moveInterval = null;
    }

    removeElement(element) {
        this.DIV.removeChild(element);
    }

    updateScoreDisplay() {
        this.SCORE_ELEMENT.innerText = `Score: ${this.gameState.score}`;
    }

    createAlphabetLetter(x) {
        const element = document.createElement('div');
        element.classList.add('alphabet-letter');
        element.style.left = `${x}px`;
        element.style.top = '0px';

        const char = this.CHAR_LIST[this.rand(0, this.CHAR_LIST.length)];
        element.innerHTML = char;

        this.DIV.appendChild(element);
        this.gameState.alphabetLetterList.push(element);
    }

    init() {
        this.makeIntervals();
        this.moveIntervals();
    }

    pauseGame() {
        if (!this.gameState.isGamePaused) {
            this.gameState.isPlayerPaused = true;
            this.gameState.isGamePaused = true;
            this.clearIntervals();
        }
    }

    unpauseGame() {
        if (this.gameState.isPlayerPaused && this.gameState.isGamePaused && !this.gameState.isSystemPaused) {
            this.gameState.isPlayerPaused = false;
            this.gameState.isGamePaused = false;
            this.init();
        }
    }

    systemPause() {
        if (!this.gameState.isGamePaused) {
            this.gameState.isSystemPaused = true;
            this.gameState.isGamePaused = true;
            this.clearIntervals();
        }
    }

    systemUnpause() {
        if (this.gameState.isSystemPaused && this.gameState.isGamePaused) {
            this.gameState.isSystemPaused = false;
            this.gameState.isGamePaused = false;
            this.init();
        }
    }

    resetGame() {
        this.clearIntervals();
        this.removeAllElements();
        this.resetScore();
        this.init();
    }

    makeIntervals() {
        this.gameState.makeInterval = setInterval(() => {
            const x = this.rand(this.gameState.minX, this.gameState.maxX);
            this.createAlphabetLetter(x);
        }, this.gameState.makeTime);
    }

    moveIntervals() {
        this.gameState.moveInterval = setInterval(() => {
            this.gameState.alphabetLetterList = this.gameState.alphabetLetterList.filter(element => {
                const rect = element.getBoundingClientRect();
                let top = rect.top + 3;

                element.style.top = `${top}px`;

                if (rect.top + rect.height >= this.gameState.maxY) {
                    this.removeElement(element);
                    return false;
                }

                return true;
            });
        }, this.gameState.moveTime);
    }

    removeAllElements() {
        this.gameState.alphabetLetterList.forEach(this.removeElement.bind(this));
        this.gameState.alphabetLetterList = [];
    }

    onKeyPress(event) {
        const keyName = event.key.toUpperCase();

        if (keyName === this.ACTIONS.PAUSE) {
            this.pauseGame();
        } else if (keyName === this.ACTIONS.UNPAUSE) {
            this.unpauseGame();
        } else if (keyName === this.ACTIONS.RESTART) {
            this.resetGame();
        } else {
            this.checkAndRemoveLetter(keyName);

            if (this.gameState.isGamePaused) {
                this.unpauseGame();
            }
        }
    }

    checkAndRemoveLetter(keyName) {
        if (!this.gameState.isGamePaused && this.gameState.alphabetLetterList.length > 0) {
            const alphabetLetter = this.gameState.alphabetLetterList[0];
            if (alphabetLetter.innerHTML === keyName) {
                this.removeElement(alphabetLetter);
                this.gameState.alphabetLetterList.shift();
                this.addScore(1);
            }
        }
    }

    addScore(value) {
        this.gameState.score += value;
        this.updateScoreDisplay();
    }

    resetScore() {
        this.gameState.score = 0;
        this.gameState.makeTime = this.BASE_MAKE_TIME;
        this.gameState.moveTime = this.BASE_MOVE_TIME;
        this.updateScoreDisplay();
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.systemPause();
        } else if (document.visibilityState === 'visible') {
            this.systemUnpause();
        }
    }
}

const game = new TypingGame();
game.init();

document.addEventListener('keypress', (event) => game.onKeyPress(event));
document.addEventListener('visibilitychange', () => game.handleVisibilityChange());
