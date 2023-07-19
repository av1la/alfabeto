class TypingGame {
    /**
     * Construtor da classe TypingGame.
     *
     * Inicializa as variáveis do jogo e define o estado inicial.
     */
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

    /**
     * Função rand(min, max).
     *
     * Retorna um número aleatório entre min e max.
     */
    rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Função clearIntervals().
     *
     * Limpa os intervalos de geração e movimentação das letras.
     */
    clearIntervals() {
        clearInterval(this.gameState.makeInterval);
        clearInterval(this.gameState.moveInterval);
        this.gameState.makeInterval = null;
        this.gameState.moveInterval = null;
    }

    /**
     * Função removeElement(element).
     *
     * Remove um elemento específico da DIV do jogo.
     */
    removeElement(element) {
        this.DIV.removeChild(element);
    }

    /**
     * Função updateScoreDisplay().
     *
     * Atualiza a exibição do placar na página.
     */
    updateScoreDisplay() {
        this.SCORE_ELEMENT.innerText = `Score: ${this.gameState.score}`;
    }

    /**
     * Função createAlphabetLetter(x).
     *
     * Cria uma nova letra do alfabeto na posição x e adiciona-a à DIV do jogo.
     */
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

    /**
     * Função init().
     *
     * Inicializa o jogo configurando os intervalos de geração e movimentação das letras.
     */
    init() {
        this.makeIntervals();
        this.moveIntervals();
    }

    /**
     * Função pauseGame().
     *
     * Pausa o jogo se o jogador solicitou a pausa.
     */
    pauseGame() {
        if (!this.gameState.isGamePaused) {
            this.gameState.isPlayerPaused = true;
            this.gameState.isGamePaused = true;
            this.clearIntervals();
        }
    }

    /**
     * Função unpauseGame().
     *
     * Despausa o jogo se o jogador solicitou a retomada.
     */
    unpauseGame() {
        if (this.gameState.isPlayerPaused && this.gameState.isGamePaused && !this.gameState.isSystemPaused) {
            this.gameState.isPlayerPaused = false;
            this.gameState.isGamePaused = false;
            this.init();
        }
    }

    /**
     * Função systemPause().
     *
     * Pausa o jogo se o sistema solicitou a pausa.
     */
    systemPause() {
        if (!this.gameState.isGamePaused) {
            this.gameState.isSystemPaused = true;
            this.gameState.isGamePaused = true;
            this.clearIntervals();
        }
    }

    /**
     * Função systemUnpause().
     *
     * Despausa o jogo se o sistema solicitou a retomada.
     */
    systemUnpause() {
        if (this.gameState.isSystemPaused && this.gameState.isGamePaused) {
            this.gameState.isSystemPaused = false;
            this.gameState.isGamePaused = false;
            this.init();
        }
    }

    /**
     * Função resetGame().
     *
     * Reinicia o jogo, limpando todos os intervalos, removendo todas as letras e reiniciando o placar.
     */
    resetGame() {
        this.clearIntervals();
        this.removeAllElements();
        this.resetScore();
        this.init();
    }

    /**
     * Função makeIntervals().
     *
     * Define o intervalo para gerar novas letras.
     */
    makeIntervals() {
        this.gameState.makeInterval = setInterval(() => {
            const x = this.rand(this.gameState.minX, this.gameState.maxX);
            this.createAlphabetLetter(x);
        }, this.gameState.makeTime);
    }

    /**
     * Função moveIntervals().
     *
     * Define o intervalo para mover as letras para baixo.
     */
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

    /**
     * Função removeAllElements().
     *
     * Remove todas as letras da DIV do jogo.
     */
    removeAllElements() {
        this.gameState.alphabetLetterList.forEach(this.removeElement.bind(this));
        this.gameState.alphabetLetterList = [];
    }

    /**
     * Função onKeyPress(event).
     *
     * Lida com o evento de pressionar uma tecla, o que pode resultar em pausar, despausar, reiniciar o jogo
     * ou remover uma letra correspondente.
     */
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

            // Garante que o jogo retorne caso o jogador pressione a tecla correspondente na tela.
            if (this.gameState.isGamePaused) {
                this.unpauseGame();
            }
        }
    }

    /**
     * Função checkAndRemoveLetter(keyName).
     *
     * Verifica se a tecla pressionada corresponde à primeira letra na fila. Se sim, remove a letra e aumenta a pontuação.
     */
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

    /**
     * Função addScore(value).
     *
     * Adiciona uma quantidade específica de pontos à pontuação do jogador e atualiza a exibição do placar.
     */
    addScore(value) {
        this.gameState.score += value;
        this.updateScoreDisplay();
    }

    /**
     * Função resetScore().
     *
     * Reinicia a pontuação e as velocidades de geração e movimentação das letras para seus valores iniciais.
     * Também atualiza a exibição do placar.
     */
    resetScore() {
        this.gameState.score = 0;
        this.gameState.makeTime = this.BASE_MAKE_TIME;
        this.gameState.moveTime = this.BASE_MOVE_TIME;
        this.updateScoreDisplay();
    }

    /**
     * Função handleVisibilityChange().
     *
     * Lida com a mudança de visibilidade da página. Se a página ficar oculta, pausa o jogo.
     * Se a página ficar visível, retoma o jogo.
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.systemPause();
        } else if (document.visibilityState === 'visible') {
            this.systemUnpause();
        }
    }
}

// Iniciando o jogo...
const game = new TypingGame();
game.init();

document.addEventListener('keypress', (event) => game.onKeyPress(event));
document.addEventListener('visibilitychange', () => game.handleVisibilityChange());
