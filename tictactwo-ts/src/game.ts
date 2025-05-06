import AI from './ai';
import { createHeader, setupControls, createBoard, setupGrid } from './ui';

export type PlayerType = 'X' | 'O';
export type PositionType = { x: number, y: number };
export type BoardType = (string | null)[][];
type GamePhaseType = 'placement' | 'movement';


export class Game {
    board: (string | null)[][];
    currentPlayer: PlayerType;
    gridPos: PositionType;
    timer: number;
    interval: number | undefined;
    moveCount: number;
    private selectedPiece: PositionType | null;
    gamePhase: GamePhaseType;
    ai: AI | null;
    xPieces: number;
    oPieces: number;
    private lastClickTime: number;
    private clickCooldown: number;
    private isProcessingClick: boolean;
    private isProcessingMove: boolean;

    constructor() {
        this.board = Array(5).fill(null).map(() => Array(5).fill(null));
        this.currentPlayer = 'X';
        this.gridPos = { x: 1, y: 1 };
        this.timer = 0;
        this.interval = undefined;
        this.moveCount = 0;
        this.selectedPiece = null;
        this.gamePhase = 'placement';
        this.ai = null;
        this.xPieces = 4;
        this.oPieces = 4;
        this.lastClickTime = 0;
        this.clickCooldown = 200;
        this.isProcessingClick = false;
        this.isProcessingMove = false; 
    }

    init(): void {
        createHeader(this);
        createBoard(this);
        setupGrid();
        this.updateStatus();
        this.startTimer();
        setupControls(this);
        this.updateMoveOptions();

        const grid = document.getElementById("grid")!;
        grid.style.left = `${this.gridPos.x * 85}px`;
        grid.style.top = `${this.gridPos.y * 85}px`;

        import('./ai').then(module => {
            const AI = module.default;
            this.ai = new AI(this);
        });
    }



    handleCellClick(x: number, y: number) {
        const now = Date.now();
        if (now - this.lastClickTime < this.clickCooldown || this.isProcessingClick) {
            return;
        }

        this.lastClickTime = now;
        this.isProcessingClick = true;

        if (x < this.gridPos.x || x >= this.gridPos.x + 3 ||
            y < this.gridPos.y || y >= this.gridPos.y + 3) {
                this.isProcessingClick = false;
                return;
            }

        if (this.gamePhase === 'placement') {
            this.handlePlacePiece(x, y);
        } else if (this.gamePhase === 'movement') {
            if (this.board[y][x] === null && this.selectedPiece === null) {
                this.handlePlacePiece(x, y);
            } else {
                this.handleMovePiece(x, y);
            }
        }

        setTimeout(() => {
            this.isProcessingClick = false;
        }, 50);
    }

    handlePlacePiece(x: number, y: number): void {
        if (this.currentPlayer === 'X' && this.xPieces == 0 || this.currentPlayer === 'O' && this.oPieces == 0) {
            return;
        }
        if (this.board[y][x] === null) {
            this.placePiece(x, y, this.currentPlayer);
            this.finishTurn();
        }
    }

    handleMovePiece(x: number, y: number): void {
        if (!this.selectedPiece) {
            // Select a piece
            if (this.board[y][x] === this.currentPlayer) {
                this.selectedPiece = { x, y };
                document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`)!.classList.add('selected');
            }
        } else {
            // Move to empty cell
            if (this.board[y][x] === null) {
                this.movePiece(this.selectedPiece.x, this.selectedPiece.y, x, y);
                this.finishTurn();
            } else {
                // Deselect if clicking on another piece or same piece
                document.querySelector(`.cell[data-x="${this.selectedPiece.x}"][data-y="${this.selectedPiece.y}"]`)!.classList.remove('selected');
                this.selectedPiece = null;
                
                // If clicked on own piece, select it
                if (this.board[y][x] === this.currentPlayer) {
                    this.selectedPiece = { x, y };
                    document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`)!.classList.add('selected');
                }
            }
        }
    }

    placePiece(x: number, y: number, player: PlayerType): void {
        this.board[y][x] = player;
        this.updateBoard();
        this.moveCount++;
        
        if (this.currentPlayer === 'X') {
            this.xPieces--;
        } else {
            this.oPieces--;
        }

        if (this.xPieces <= 3 && this.oPieces <= 3) {
            this.setGamePhase('movement');
        } else {
            this.gamePhase = 'placement';
        }
    }
    

    movePiece(fromX: number, fromY: number, toX: number, toY: number): void {
        if (this.selectedPiece) {
            document.querySelector(`.cell[data-x="${fromX}"][data-y="${fromY}"]`)!.classList.remove('selected');
        }
        
        this.board[toY][toX] = this.board[fromY][fromX];
        this.board[fromY][fromX] = null;
        this.selectedPiece = null;
        this.updateBoard();
    }

    moveGrid(dx: number, dy: number): void {
        if (this.isProcessingMove) {
            return;
        }
        
        this.isProcessingMove = true;
        
        if (this.moveCount < 4) {
            this.isProcessingMove = false;
            return;
        }
        
        const newX = this.gridPos.x + dx;
        const newY = this.gridPos.y + dy;
        
        if (newX >= 0 && newX + 3 <= 5 && newY >= 0 && newY + 3 <= 5) {
            this.gridPos = { x: newX, y: newY };
            
            const grid = document.getElementById("grid")!;
            grid.style.left = `${newX * 85}px`;
            grid.style.top = `${newY * 85}px`;

            this.finishTurn();
        }

        setTimeout(() => {
            this.isProcessingMove = false;
        }, 300);
        
    }

    finishTurn(): void {
        if (this.checkWin()) {
            this.updateBoard();

            setTimeout(() => {
                alert(`${this.currentPlayer} wins!`);
                this.resetGame();
            }, 1000);

            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
        this.updateMoveOptions();
        
        if (this.selectedPiece) {
            document.querySelector(`.cell[data-x="${this.selectedPiece.x}"][data-y="${this.selectedPiece.y}"]`)!.classList.remove('selected');
            this.selectedPiece = null;
        }
    }

    updateBoard(): void {
        document.querySelectorAll<HTMLDivElement>(".cell").forEach(cell => {
            const xCell = cell.dataset.x;
            const yCell = cell.dataset.y;

            if (xCell !== undefined && yCell !== undefined) {
                const x = parseInt(xCell);
                const y = parseInt(yCell);
            
                cell.textContent = this.board[y][x] || "";
                
                if (x >= this.gridPos.x && x < this.gridPos.x + 3 &&
                    y >= this.gridPos.y && y < this.gridPos.y + 3) {
                    cell.classList.add('in-grid');
                } else {
                    cell.classList.remove('in-grid');
                }
            }
        });
    }

    checkWin(): boolean {
        const gridX: number = this.gridPos.x;
        const gridY: number = this.gridPos.y;

        // get the grid from the board
        const grid: (string | null)[][] = [];
        for (let y = 0; y < 3; y++) {
            grid[y] = [];
            for (let x = 0; x < 3; x++) {
                grid[y][x] = this.board[gridY + y][gridX + x];
            }
        }

        // Check rows
        for (let y = 0; y < 3; y++) {
            if (grid[y][0] && grid[y][0] === grid[y][1] && grid[y][1] === grid[y][2]) {
                this.highlightWinningCells([
                    {x: gridX, y: gridY + y},
                    {x: gridX + 1, y: gridY + y},
                    {x: gridX + 2, y: gridY + y}
                ]);
                return true;
            }
        }
        
        // Check columns
        for (let x = 0; x < 3; x++) {
            if (grid[0][x] && grid[0][x] === grid[1][x] && grid[1][x] === grid[2][x]) {
                this.highlightWinningCells([
                    {x: gridX + x, y: gridY},
                    {x: gridX + x, y: gridY + 1},
                    {x: gridX + x, y: gridY + 2}
                ]);
                return true;
            }
        }
        
        // Check diagonals
        if (grid[0][0] && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
            this.highlightWinningCells([
                {x: gridX, y: gridY},
                {x: gridX + 1, y: gridY + 1},
                {x: gridX + 2, y: gridY + 2}
            ]);
            return true;
        }
        if (grid[0][2] && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
            this.highlightWinningCells([
                {x: gridX + 2, y: gridY},
                {x: gridX + 1, y: gridY + 1},
                {x: gridX, y: gridY + 2}
            ]);
            return true;
        }
        
        return false;
    }

    highlightWinningCells(cells: PositionType[]): void {
        document.querySelectorAll('.cell.winner').forEach(cell => {
            cell.classList.remove('winner');
        });
        
        cells.forEach(cell => {
            const cellElement = document.querySelector(`.cell[data-x="${cell.x}"][data-y="${cell.y}"]`);
            if (cellElement) {
                cellElement.classList.add('winner');
            }
        });
    }

    updateStatus(): void {
        document.getElementById("status")!.textContent 
        = `player ${this.currentPlayer}'s turn (pieces left: ${this.currentPlayer === 'X' ? this.xPieces : this.oPieces})`;
    }
    
    updateMoveOptions() {
        const gridControls = document.getElementById("grid-controls");
        const advancedMovesEnabled = this.currentPlayer === 'X' ? this.xPieces < 3 : this.oPieces < 3;
        if (gridControls) gridControls.style.opacity = advancedMovesEnabled ? "1" : "0.5";
    }

    setGamePhase(phase: GamePhaseType): void {
    
        if (phase !== 'placement' && this.moveCount < 4) {
            return;
        }
        
        this.gamePhase = phase;
        
        if (this.selectedPiece) {
            document.querySelector(`.cell[data-x="${this.selectedPiece.x}"][data-y="${this.selectedPiece.y}"]`)!.classList.remove('selected');
            this.selectedPiece = null;
        }
        
        this.updateMoveOptions();
    }

    startTimer(): void {
        this.timer = 0;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            document.getElementById("timer")!.textContent = `time: ${++this.timer}s`;
        }, 1000);
    }

    resetGame(): void {
        this.board = Array(5).fill(null).map(() => Array(5).fill(null));
        this.currentPlayer = 'X';
        this.moveCount = 0;
        this.gamePhase = 'placement';
        this.selectedPiece = null;
        this.xPieces = 4;
        this.oPieces = 4;
        
        this.updateBoard();
        this.updateStatus();
        this.updateMoveOptions();
        this.startTimer();
        this.gridPos = { x: 1, y: 1 };

        const grid = document.getElementById("grid")!;
        grid.style.left = `${this.gridPos.x * 85}px`;
        grid.style.top = `${this.gridPos.y * 85}px`;

        document.querySelectorAll('.cell.winner').forEach(cell => {
            cell.classList.remove('winner');
        });
    }

    aiMove(): void {
        if (!this.ai) return;
        
        const opponent = this.currentPlayer === 'X' ? 'O' : 'X';
        this.ai.makeAIMove(this.currentPlayer, opponent);
    }
    
    isCellEmpty(x: number, y: number): boolean {
        return this.board[y][x] === null;
    }
    
    get gridPosition() {
        return this.gridPos;
    }
    
    get moveAfterNMoves(): number {
        return 2;
    }
}
