
export type PlayerType = 'x' | 'o';
export type PositionType = { x: number, y: number };
export type BoardType = (string | null)[][];
type GamePhaseType = 'placement' | 'movement';

export default class Game {
    board: (string | null)[][] = Array(5).fill(null).map(() => Array(5).fill(null));
    currentPlayer: PlayerType = 'x';	
    gridPos: PositionType = { x: 1, y: 1 };
    timer: number = 0;
    private selectedPiece: PositionType | null = null;
    gamePhase: GamePhaseType = 'placement';
    xPieces: number = 4;
    oPieces: number = 4;

    constructor() {
        this.resetGame();
    }

    placePiece(x: number, y: number): void {
        this.board[y][x] = this.currentPlayer;
        
        if (this.currentPlayer === 'x') {
            this.xPieces--;
        } else {
            this.oPieces--;
        }

        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    }

    resetGame(): void {
        this.board = Array(5).fill(null).map(() => Array(5).fill(null));
        this.currentPlayer = 'x';
        this.gamePhase = 'placement';
        this.selectedPiece = null;
        this.xPieces = 4;
        this.oPieces = 4;
        this.gridPos = { x: 1, y: 1 };
        this.timer = 0;
    }
}