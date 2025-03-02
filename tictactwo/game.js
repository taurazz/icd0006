import { createHeader, setupControls, createBoard, setupGrid } from './ui.js';

export class Game {
    constructor() {
        this.board = Array(5).fill().map(() => Array(5).fill(null));
        this.currentPlayer = 'X';
        this.gridPos = { x: 1, y: 1 }; // 3x3 grid position
        this.timer = 0;
        this.interval = null;
        this.moveCount = 0;
        this.selectedPiece = null;
        this.gamePhase = 'placement'; // 'placement', 'movement'
        this.ai = null;
        this.xPieces = 5;
        this.oPieces = 5;
    }

    init() {
        createHeader(this);
        createBoard(this);
        setupGrid();
        this.updateStatus();
        this.startTimer();
        setupControls(this);
        this.updateMoveOptions();

        const grid = document.getElementById("grid");
        grid.style.left = `${this.gridPos.x * 85}px`;
        grid.style.top = `${this.gridPos.y * 85}px`;

        // Create the AI instance with a reference to this game
        import('./ai.js').then(module => {
            const AI = module.default;
            this.ai = new AI(this);
        });
    }



    handleCellClick(x, y) {
        // Always ensure the move is within the 3x3 grid
        if (x < this.gridPos.x || x >= this.gridPos.x + 3 ||
            y < this.gridPos.y || y >= this.gridPos.y + 3) return;

        if (this.gamePhase === 'placement') {
            this.handlePlacePiece(x, y);
        } else if (this.gamePhase === 'movement') {
            if (this.board[y][x] === null && this.selectedPiece === null) {
                this.handlePlacePiece(x, y);
            } else {
                this.handleMovePiece(x, y);
            }
        }
    }

    handlePlacePiece(x, y) {
        if (this.currentPlayer === 'X' && this.xPieces == 0 || this.currentPlayer === 'O' && this.oPieces == 0) {
            return;
        }
        if (this.board[y][x] === null) {
            this.placePiece(x, y, this.currentPlayer);
            this.finishTurn();
        }
    }

    handleMovePiece(x, y) {
        if (!this.selectedPiece) {
            // Select a piece
            if (this.board[y][x] === this.currentPlayer) {
                this.selectedPiece = { x, y };
                document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`).classList.add('selected');
            }
        } else {
            // Move to empty cell
            if (this.board[y][x] === null) {
                this.movePiece(this.selectedPiece.x, this.selectedPiece.y, x, y);
                this.finishTurn();
            } else {
                // Deselect if clicking on another piece or same piece
                document.querySelector(`.cell[data-x="${this.selectedPiece.x}"][data-y="${this.selectedPiece.y}"]`).classList.remove('selected');
                this.selectedPiece = null;
                
                // If clicked on own piece, select it
                if (this.board[y][x] === this.currentPlayer) {
                    this.selectedPiece = { x, y };
                    document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`).classList.add('selected');
                }
            }
        }
    }

    placePiece(x, y, player) {
        this.board[y][x] = player;
        this.updateBoard();
        this.moveCount++;
        
        if (this.currentPlayer === 'X') {
            this.xPieces--;
        } else {
            this.oPieces--;
        }

        // After both players have placed at least two pieces, switch to movement phase
        if (this.xPieces <= 3 && this.oPieces <= 3) {
            this.setGamePhase('movement');
        } else {
            this.gamePhase = 'placement';
        }

        this.updateMoveOptions();
        }
    

    movePiece(fromX, fromY, toX, toY) {
        if (this.selectedPiece) {
            document.querySelector(`.cell[data-x="${fromX}"][data-y="${fromY}"]`).classList.remove('selected');
        }
        
        // Move the piece
        this.board[toY][toX] = this.board[fromY][fromX];
        this.board[fromY][fromX] = null;
        this.selectedPiece = null;
        this.updateBoard();
    }

    moveGrid(dx, dy) {
        // Check if advanced moves are allowed
        if (this.moveCount < 4) return;
        
        const newX = this.gridPos.x + dx;
        const newY = this.gridPos.y + dy;
        
        // Validate new position is within bounds
        if (newX >= 0 && newX + 3 <= 5 && newY >= 0 && newY + 3 <= 5) {
            this.gridPos = { x: newX, y: newY };
            
            // Update visual position
            const grid = document.getElementById("grid");
            grid.style.left = `${newX * 85}px`;
            grid.style.top = `${newY * 85}px`;

            this.finishTurn();
        }
        
    }

    finishTurn() {
        // Check for win
        if (this.checkWin()) {
            this.updateBoard();
            alert(`${this.currentPlayer} wins!`);
            this.resetGame();
            return;
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
        
        // Reset selection if any
        if (this.selectedPiece) {
            document.querySelector(`.cell[data-x="${this.selectedPiece.x}"][data-y="${this.selectedPiece.y}"]`).classList.remove('selected');
            this.selectedPiece = null;
        }
    }

    updateBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            cell.textContent = this.board[y][x] || "";
            
            // Highlight cells within the current subgrid
            if (x >= this.gridPos.x && x < this.gridPos.x + 3 &&
                y >= this.gridPos.y && y < this.gridPos.y + 3) {
                cell.classList.add('in-grid');
            } else {
                cell.classList.remove('in-grid');
            }
        });
    }

    checkWin() {
        const gridX = this.gridPos.x;
        const gridY = this.gridPos.y;

        // Extract the current 3x3 grid from the board
        const grid = [];
        for (let y = 0; y < 3; y++) {
            grid[y] = [];
            for (let x = 0; x < 3; x++) {
                grid[y][x] = this.board[gridY + y][gridX + x];
            }
        }

        // Check rows
        for (let y = 0; y < 3; y++) {
            if (grid[y][0] && grid[y][0] === grid[y][1] && grid[y][1] === grid[y][2]) {
                return true;
            }
        }
        
        // Check columns
        for (let x = 0; x < 3; x++) {
            if (grid[0][x] && grid[0][x] === grid[1][x] && grid[1][x] === grid[2][x]) {
                return true;
            }
        }
        
        // Check diagonals
        if (grid[0][0] && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
            return true;
        }
        if (grid[0][2] && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
            return true;
        }
        
        return false;
    }

    updateStatus() {
        document.getElementById("status").textContent = `player ${this.currentPlayer}'s turn (pieces left: ${this.currentPlayer === 'X' ? this.xPieces : this.oPieces})`;
        this.updateMoveOptions();
    }
    
    updateMoveOptions() {
        const gridControls = document.getElementById("grid-controls");
        const advancedMovesEnabled = this.currentPlayer === 'X' ? this.xPieces <= 3 : this.oPieces <= 3;
        if (gridControls) gridControls.style.opacity = advancedMovesEnabled ? "1" : "0.5";
    }

    setGamePhase(phase) {
        // Only allow advanced moves after both players have placed 2 pieces
        if (phase !== 'placement' && this.moveCount < 4) {
            return;
        }
        
        this.gamePhase = phase;
        
        // Clear any selected piece when changing phases
        if (this.selectedPiece) {
            document.querySelector(`.cell[data-x="${this.selectedPiece.x}"][data-y="${this.selectedPiece.y}"]`).classList.remove('selected');
            this.selectedPiece = null;
        }
        
        this.updateMoveOptions();
    }

    startTimer() {
        this.timer = 0;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            document.getElementById("timer").textContent = `time: ${++this.timer}s`;
        }, 1000);
    }

    resetGame() {
        this.board = Array(5).fill().map(() => Array(5).fill(null));
        this.currentPlayer = 'X';
        this.moveCount = 0;
        this.gamePhase = 'placement';
        this.selectedPiece = null;
        this.xPieces = 5;
        this.oPieces = 5;
        
        this.updateBoard();
        this.updateStatus();
        this.startTimer();
        this.gridPos = { x: 1, y: 1 };

        const grid = document.getElementById("grid");
        grid.style.left = `${this.gridPos.x * 85}px`;
        grid.style.top = `${this.gridPos.y * 85}px`;
    }

    aiMove() {
        if (!this.ai) return;
        
        const opponent = this.currentPlayer === 'X' ? 'O' : 'X';
        this.ai.makeAIMove(this.currentPlayer, opponent);
    }
    
    // Helper methods for AI integration
    isCellEmpty(x, y) {
        return this.board[y][x] === null;
    }
    
    // Properties needed for AI
    get gridPosition() {
        return this.gridPos;
    }
    
    get moveAfterNMoves() {
        return 2; // Each player places 2 pieces before advanced moves
    }
}
