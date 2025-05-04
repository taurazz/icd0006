import type { Game, PlayerType, PositionType, BoardType } from './game';

export interface PlacePieceMove {
    type: 'PlacePiece';
    placeX: number;
    placeY: number;
  }
  
  export interface MoveGridMove {
    type: 'MoveGrid';
    deltaX: number;
    deltaY: number;
  }
  
  export interface MovePieceMove {
    type: 'MovePiece';
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }

export type AIMove = PlacePieceMove | MoveGridMove | MovePieceMove;


export default class AI {

    gameState: Game;

    constructor(gameState: Game) {
        this.gameState = gameState;
    }

    makeAIMove(currentPlayer: PlayerType, opponent: PlayerType): boolean {
        const possibleMoves = this.getPossibleAIMoves(currentPlayer);
        
        if (possibleMoves.length === 0) return false;
        
        let winningMove = possibleMoves.find(move => 
            this.isWinningMove(move, currentPlayer));
            
        if (winningMove) {
            this.executeAIMove(winningMove, currentPlayer);
            return true;
        }
        
        let blockingMove = possibleMoves.find(move => 
            this.isWinningMove(move, opponent));
            
        if (blockingMove) {
            this.executeAIMove(blockingMove, currentPlayer);
            return true;
        }
        
        const chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        this.executeAIMove(chosenMove, currentPlayer);
        return true;
    }
    
    getPossibleAIMoves(player: PlayerType) {
        const moves: AIMove[] = [];
        const gridPosition: PositionType = this.gameState.gridPosition;
        const gridSize: number = 3;
        const board: BoardType = this.gameState.board;
        const totalPieces: number = this.countPieces();
        const advancedMovesAllowed: boolean = totalPieces >= this.gameState.moveAfterNMoves * 2;
        
        // 1. Place piece moves for empty cells in grid
        for (let y = gridPosition.y; y < gridPosition.y + gridSize; y++) {
            for (let x = gridPosition.x; x < gridPosition.x + gridSize; x++) {
                if (this.gameState.isCellEmpty(x, y)) {
                    moves.push({
                        type: 'PlacePiece',
                        placeX: x,
                        placeY: y
                    });
                }
            }
        }
        
        // 2. If advanced moves are allowed, AI can move a piece or the grid
        if (advancedMovesAllowed) {
            // a) Grid moves
            const gridMoves: MoveGridMove[] = this.getValidGridMoves();
            gridMoves.forEach(({ deltaX, deltaY }) => {
                moves.push({
                    type: 'MoveGrid',
                    deltaX,
                    deltaY
                });
            });
            
            // b) Move an existing piece
            for (let y = gridPosition.y; y < gridPosition.y + gridSize; y++) {
                for (let x = gridPosition.x; x < gridPosition.x + gridSize; x++) {
                    if (board[y][x] === player) {
                        for (let ny = gridPosition.y; ny < gridPosition.y + gridSize; ny++) {
                            for (let nx = gridPosition.x; nx < gridPosition.x + gridSize; nx++) {
                                if (this.gameState.isCellEmpty(nx, ny)) {
                                    moves.push({
                                        type: 'MovePiece',
                                        fromX: x,
                                        fromY: y,
                                        toX: nx,
                                        toY: ny
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    }
    
    isWinningMove(move: AIMove, player: PlayerType) {
        const simulatedBoard: BoardType = this.simulateMove(move, player);
        return this.checkForWinInGrid(simulatedBoard, player);
    }
    
    simulateMove(move: AIMove, player: PlayerType) {
        const simulatedBoard: BoardType = Array(5);
        for (let y = 0; y < 5; y++) {
            simulatedBoard[y] = [...this.gameState.board[y]];
        }
        
        switch (move.type) {
            case 'PlacePiece':
                simulatedBoard[move.placeY][move.placeX] = player;
                break;
            case 'MovePiece':
                simulatedBoard[move.fromY][move.fromX] = null;
                simulatedBoard[move.toY][move.toX] = player;
                break;
            case 'MoveGrid':
                break;
        }
        
        return simulatedBoard;
    }
    
    checkForWinInGrid(board: BoardType, player: PlayerType): boolean {
        const gridPosition: PositionType = this.gameState.gridPosition;
        const gridSize: number = 3;
        
        const grid: BoardType = [];
        for (let y = 0; y < gridSize; y++) {
            grid[y] = [];
            for (let x = 0; x < gridSize; x++) {
                grid[y][x] = board[gridPosition.y + y][gridPosition.x + x];
            }
        }
        
        // Check rows
        for (let y = 0; y < gridSize; y++) {
            if (grid[y][0] === player && grid[y][1] === player && grid[y][2] === player) {
                return true;
            }
        }
        
        // Check columns
        for (let x = 0; x < gridSize; x++) {
            if (grid[0][x] === player && grid[1][x] === player && grid[2][x] === player) {
                return true;
            }
        }
        
        // Check diagonals
        if (grid[0][0] === player && grid[1][1] === player && grid[2][2] === player) {
            return true;
        }
        if (grid[0][2] === player && grid[1][1] === player && grid[2][0] === player) {
            return true;
        }
        
        return false;
    }
    
    getValidGridMoves(): MoveGridMove[] {
        const result: MoveGridMove[] = [];
        const gridPosition: PositionType = this.gameState.gridPosition;
        const boardSize: number = 5;
        const gridSize: number = 3;
        
        const candidates: { deltaX: number, deltaY: number }[] = [
            {deltaX: -1, deltaY: 0}, {deltaX: 1, deltaY: 0}, {deltaX: 0, deltaY: -1}, {deltaX: 0, deltaY: 1},
            {deltaX: -1, deltaY: -1}, {deltaX: -1, deltaY: 1}, {deltaX: 1, deltaY: -1}, {deltaX: 1, deltaY: 1}
        ];
        
        candidates.forEach(({deltaX, deltaY}) => {
            const nx: number = gridPosition.x + deltaX;
            const ny: number = gridPosition.y + deltaY;
            
            if (nx >= 0 && nx + gridSize <= boardSize &&
                ny >= 0 && ny + gridSize <= boardSize) {
                result.push({
                    type: 'MoveGrid',
                    deltaX,
                    deltaY
                });
            }
        });
        
        return result;
    }
    
    countPieces(): number {
        let count: number = 0;
        const board: BoardType = this.gameState.board;
        const boardSize: number = 5;
        
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                if (board[y][x] !== null) {
                    count++;
                }
            }
        }
        
        return count;
    }
    
    executeAIMove(move: AIMove, player: PlayerType): void {
        switch (move.type) {
            case 'PlacePiece':
                this.gameState.placePiece(move.placeX, move.placeY, player);
                this.gameState.finishTurn();
                break;
                
            case 'MoveGrid':
                this.gameState.moveGrid(move.deltaX, move.deltaY);
                break;
                
            case 'MovePiece':
                this.gameState.movePiece(move.fromX, move.fromY, move.toX, move.toY);
                this.gameState.finishTurn();
                break;
        }
    }
}
