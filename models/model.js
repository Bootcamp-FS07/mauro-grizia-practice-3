class Model {
    static model = null;
    #playerIcons = ["X", "O"];
    #dimensions;
    #state

    constructor(dimensions) {
        if (Model.model !== null) {
            throw new Error("Only one instance allowed. Use getInstance()");
        } else {
            this.#state = {
                turn: 0,
                names: ["P1", "P2"],
                scores: [0, 0],
                board: null,
                currentCell: Array(2).fill(null),
                isGameFinished: false
            };
            this.#dimensions = dimensions;

            Model.model = this;
        }
    }

    isWinner (st) {
        const lines = [
            [[-1, -1], [1, 1]],     // \
            [[0, -1], [0, 1]],      // |
            [[1, -1], [-1, 1]],     // /
            [[-1, 0], [1, 0]]       // -
        ];
        const linePoints = [1, 1, 1, 1];
        const currentIcon = st.board[st.currentCell[0] * this.#dimensions + st.currentCell[1]];
        
        let isAWinner = false;
    
        // Check every direction for 3 in a row
        for (let i = 0; !isAWinner && i < lines.length; i++) {
            let isDone = false;
            
            // Check left
            for (let j = 0; !isDone && j < this.#dimensions; j++) {
                const vectorL = lines[i][0];
                const lineSize = this.#dimensions;
                const cell = st.currentCell;
                const newCoords = [cell[0] + vectorL[0] * (j + 1), cell[1] + vectorL[1] * (j + 1)];
                const idxBoard = newCoords[0] * lineSize + newCoords[1];
                const icon = st.board[idxBoard];

                if (newCoords[0] > -1 && newCoords[1] > -1 && icon) {
                    if (icon === currentIcon) {
                        linePoints[i]++;
                    } else {
                        isDone = true;
                    }
                } else {
                    isDone = true;
                }
            }
            isDone = false;
    
            // Check right
            for (let j = 0; !isDone && j < this.#dimensions; j++) {
                const vectorR = lines[i][1];
                const lineSize = this.#dimensions;
                const cell = st.currentCell;
                const newCoords = [cell[0] + vectorR[0] * (j + 1), cell[1] + vectorR[1] * (j + 1)];
                const idxBoard = newCoords[0] * lineSize + newCoords[1];
                const icon = st.board[idxBoard];
                
                if (newCoords[0] > -1 && newCoords[1] > -1 && icon) {
                    if (icon === currentIcon) {
                        linePoints[i]++;
                    } else {
                        isDone = true;
                    }
                } else {
                    isDone = true;
                }
            }
            
            if (linePoints[i] === this.#dimensions) {
                isAWinner = true;
            }
        }
    
        return isAWinner;
    };
    
    isBoardFull() {
        return this.#state.board.every((elem) => {return elem !== null});
    }
    finishGame() {
        this.#state.isGameFinished = true;
    }
    updateTurn() {
        const st = { ...this.#state };
        
        this.#state.turn = (st.turn + 1) % 2;
    }
    startGame (dimensions, names, isNewScore) {
        this.#state = {
            turn: 0,
            scores: isNewScore? [0, 0] : this.#state.scores,
            names: names?? ["P1", "P2"],
            board: Array(dimensions * dimensions).fill(null),
            currentCell: Array(2).fill(null),
            isGameFinished: false
        };
        this.#dimensions = dimensions;
    }
    takeTurn (event) {
        const target = event.currentTarget;
        const st = { ...this.#state };
        const coords = target.id.split("-");
    
        coords[0] = Number(coords[0]);
        coords[1] = Number(coords[1]);
    
        target.textContent = this.#playerIcons[st.turn];
        st.board[coords[0] * this.#dimensions + coords[1]] = this.#playerIcons[st.turn];
        st.currentCell = coords;
    
        const isFull = this.isBoardFull();
        const isAWinner = this.isWinner(st);
    
        if (isAWinner) {
            st.scores[st.turn]++;

            return `Winner player: ${st.turn + 1}`;
        } else {
            if (isFull) {
                return `There is a tie!`;
            } else {
                return "";
            }
        }
    }

    static getInstance(dimensions) {
        if (Model.model === null) {
            Model.model = new Model(dimensions?? 3);
        }

        return Model.model;
    }
    getPlayerIcons() {
        return this.#playerIcons;
    }
    getDimensions() {
        return this.#dimensions;
    }
    getState() {
        return this.#state
    }
    setState(state) {
        this.#state = state;
    }
}