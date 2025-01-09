class View {
    #model;

    constructor(model) {
        this.#model = model;
    }

    toggleGameEnabling () {
        const containerGame = document.querySelector("#container-game");
        const st = { ...this.#model.getState() };

        if (st.isGameFinished) {
            containerGame.classList.add("disabled");
        } else {
            containerGame.classList.remove("disabled");
        }
    }
    updateTurn () {
        const containerTurn = document.querySelector("#container-turn");
        const st = { ...this.#model.getState() };
    
        containerTurn.textContent = `Turn player: ${st.turn + 1}`;
    }
    updateScore () {
        const lbP1 = document.querySelector("#lb-p1");
        const lbP2 = document.querySelector("#lb-p2");
        const st = { ...this.#model.getState() };

        lbP1.textContent = `P1: ${st.names[0]} - Score ${st.scores[0]}`;
        lbP2.textContent = `P2: ${st.names[1]} - Score ${st.scores[1]}`;
    }
    takeTurn(event) {
        return this.#model.takeTurn(event);
    }
    removeListeners() {
        const cells = document.querySelectorAll(".cell-game");
    
        cells.forEach((cell) => {
            cell.removeEventListener("click", (e) => takeTurn(e));
        });
    }
    showGameResults(strResults) {
        alert(strResults);
    }
    finishGame(strResults) {
        this.#model.finishGame();
        this.removeListeners();
        this.updateScore();
        this.toggleGameEnabling();
        this.showGameResults(strResults)
    }
    handleClick(event) {
        const strResults = this.takeTurn(event);

        if (!strResults) {
            this.#model.updateTurn(); 
            this.updateTurn();
        } else {
            this.finishGame(strResults);
        }
    }
    startGame() {
        const containerStart = document.querySelector("#container-start");
        const containerGameData = document.querySelector("#container-game-data");
        const containerGame = document.querySelector("#container-game");
        const containerTurn = document.querySelector("#container-turn");
        
        this.updateScore();
        containerGame.style.setProperty("--cells-per-row", this.#model.getDimensions());
        this.updateTurn();
        this.toggleGameEnabling();
        
        for (let i = 0; i < this.#model.getDimensions(); i++) {
            for (let j = 0; j < this.#model.getDimensions(); j++) {
                const elem = document.createElement("DIV");
    
                elem.id = `${i}-${j}`;
                elem.className = "cell-game";
                elem.addEventListener("click", (e) => this.handleClick(e));
                containerGame.appendChild(elem);
            }
        }
        containerStart.classList.add("hidden");
        containerGameData.classList.remove("hidden");
        containerTurn.classList.remove("hidden");
    }
    init() {
        const btStart = document.querySelector("#bt-start");
        const btStartNew = document.querySelector("#bt-start-new");
        const btRestart = document.querySelector("#bt-restart");
        
        const inP1 = document.querySelector("#in-player1");
        const inP2 = document.querySelector("#in-player2");
        const slDim = document.querySelector("#sl-dimensions");
        
        btStart.addEventListener("click", (event) => {
            this.#model.startGame(Number(slDim.value), [inP1.value, inP2.value], false);
            this.startGame();
        });
        btStartNew.addEventListener("click", (event) => {
            const cells = document.querySelectorAll(".cell-game");

            cells.forEach((cell) => {
                cell.remove();
            });

            this.#model.startGame(Number(slDim.value), [inP1.value, inP2.value], false);
            this.startGame();
        });
        btRestart.addEventListener("click", (event) => {
            const cells = document.querySelectorAll(".cell-game");

            this.#model.startGame(Number(slDim.value), [inP1.value, inP2.value], true);
            
            Array.from(cells).forEach((cell) => {
                cell.remove();
            })
            this.startGame();
        })
    }
}