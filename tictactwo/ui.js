export default class UI {
    constructor(game) {
        this.game = game;
        this.boardElement = document.getElementById("board");
        this.statusElement = document.getElementById("status");
        this.timerElement = document.getElementById("timer");
        this.resetButton = document.getElementById("reset");
        this.aiToggle = document.getElementById("ai-toggle");

        this.boardElement.addEventListener("click", (e) => this.handleCellClick(e));
        this.resetButton.addEventListener("click", () => this.game.resetGame());
        this.aiToggle.addEventListener("click", () => this.game.toggleAI());
    }

    renderBoard(board) {
        this.boardElement.innerHTML = "";
        for (let x = 0; x < board.size; x++) {
            for (let y = 0; y < board.size; y++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.textContent = board.board[x][y] || "";
                this.boardElement.appendChild(cell);
            }
        }
    }

    handleCellClick(event) {
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;
        if (x !== undefined && y !== undefined) {
            this.game.handleMove(parseInt(x), parseInt(y));
        }
    }

    updateStatus(message) {
        this.statusElement.textContent = message;
    }

    updateTimer(time) {
        this.timerElement.textContent = `Time: ${time}s`;
    }
}
