export class Game {
    constructor() {
        this.board = Array(5).fill().map(() => Array(5).fill(null));
        this.currentPlayer = 'X';
        this.subgridPos = { x: 1, y: 1 }; // 3x3 grid position
        this.timer = 0;
        this.interval = null;
        this.aiEnabled = false;
    }

    init() {
        this.createBoard();
        this.setupDraggableSubgrid();
        this.updateStatus();
        this.startTimer();

        const subgrid = document.getElementById("subgrid");
        subgrid.style.left = `${this.subgridPos.x * 85}px`;
        subgrid.style.top = `${this.subgridPos.y * 85}px`;

        document.getElementById("reset").addEventListener("click", () => this.resetGame());
        document.getElementById("ai-toggle").addEventListener("click", () => this.toggleAI());
    }

    createBoard() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = "";

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener("click", () => this.handleMove(x, y));
                boardElement.appendChild(cell);
            }
        }
    }

    setupDraggableSubgrid() {
        const subgrid = document.getElementById("subgrid");
        let offsetX, offsetY, isDragging = false;

        subgrid.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - subgrid.offsetLeft;
            offsetY = e.clientY - subgrid.offsetTop;
            subgrid.style.pointerEvents = "auto";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Snap to board grid (80px per cell)
            newX = Math.round(newX / 85) * 85;
            newY = Math.round(newY / 85) * 85;

            // Ensure subgrid stays within 5x5 board limits
            if (newX >= 0 && newX <= 170 && newY >= 0 && newY <= 170) {
                subgrid.style.left = `${newX}px`;
                subgrid.style.top = `${newY}px`;
                this.subgridPos = { x: newX / 85, y: newY / 85 };
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false
            subgrid.style.pointerEvents = "none";
        });
    }

    handleMove(x, y) {
        // Check if move is within 3x3 grid
        if (x < this.subgridPos.x || x >= this.subgridPos.x + 3 ||
            y < this.subgridPos.y || y >= this.subgridPos.y + 3) return;

        if (this.board[y][x] === null) {
            this.board[y][x] = this.currentPlayer;
            this.updateBoard();
            if (this.checkWin()) {
                alert(`${this.currentPlayer} wins!`);
                this.resetGame();
                return;
            }
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();

            if (this.aiEnabled && this.currentPlayer === 'O') {
                this.aiMove();
            }
        }
    }

    updateBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            const x = cell.dataset.x;
            const y = cell.dataset.y;
            cell.textContent = this.board[y][x] || "";
        });
    }

    checkWin() {
        const gridX = this.subgridPos.x;
        const gridY = this.subgridPos.y;

        const grid = this.board.slice(gridY, gridY + 3).map(row => row.slice(gridX, gridX + 3));

        const lines = [
            ...grid, // Rows
            [grid[0][0], grid[1][0], grid[2][0]], // Columns
            [grid[0][1], grid[1][1], grid[2][1]],
            [grid[0][2], grid[1][2], grid[2][2]],
            [grid[0][0], grid[1][1], grid[2][2]], // Diagonals
            [grid[0][2], grid[1][1], grid[2][0]]
        ];

        return lines.some(line => line.every(cell => cell === this.currentPlayer));
    }

    updateStatus() {
        document.getElementById("status").textContent = `Player ${this.currentPlayer}'s turn`;
    }

    startTimer() {
        this.timer = 0;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            document.getElementById("timer").textContent = `Time: ${++this.timer}s`;
        }, 1000);
    }

    resetGame() {
        this.board = Array(5).fill().map(() => Array(5).fill(null));
        this.currentPlayer = 'X';
        this.updateBoard();
        this.updateStatus();
        this.startTimer();
    }

    toggleAI() {
        this.aiEnabled = !this.aiEnabled;
    }
}
