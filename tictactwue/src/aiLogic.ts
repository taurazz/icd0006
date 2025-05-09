import { useGameStore } from './stores/GameStore';

const gameStore = useGameStore();

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
export type PlayerType = 'X' | 'O';
export type BoardType = (string | null)[][];
export type PositionType = { x: number; y: number; };



    export function makeAIMove(currentPlayer: PlayerType, opponent: PlayerType): boolean {
        const possibleMoves = getPossibleAIMoves(currentPlayer);
        
        if (possibleMoves.length === 0) return false;
        
        let winningMove = possibleMoves.find(move => 
            isWinningMove(move, currentPlayer));
            
        if (winningMove) {
            executeAIMove(winningMove, currentPlayer);
            return true;
        }
        
        let blockingMove = possibleMoves.find(move => 
            isWinningMove(move, opponent));
            
        if (blockingMove) {
            executeAIMove(blockingMove, currentPlayer);
            return true;
        }
        
        const chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        executeAIMove(chosenMove, currentPlayer);
        return true;
    }
    
    export function getPossibleAIMoves(player: PlayerType) {
        const moves: AIMove[] = [];
        const gridPosition: PositionType =  gameStore.gridPosition;
        const gridSize: number = 3;
        const board: BoardType =    gameStore.board;
        const totalPieces: number = countPieces();
        const advancedMovesAllowed: boolean = totalPieces >=    gameStore.moveAfterNMoves * 2;
        
        // 1. Place piece moves for empty cells in grid
        for (let y = gridPosition.y; y < gridPosition.y + gridSize; y++) {
            for (let x = gridPosition.x; x < gridPosition.x + gridSize; x++) {
                if  gameStore.isCellEmpty(x, y)) {
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
            const gridMoves: MoveGridMove[] =   getValidGridMoves();
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
                                if  gameStore.isCellEmpty(nx, ny)) {
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
    
    export function isWinningMove(move: AIMove, player: PlayerType) {
        const simulatedBoard: BoardType =   simulateMove(move, player);
        return  checkForWinInGrid(simulatedBoard, player);
    }
    
    export function simulateMove(move: AIMove, player: PlayerType) {
        const simulatedBoard: BoardType = Array(5);
        for (let y = 0; y < 5; y++) {
            simulatedBoard[y] = [.. gameStore.board[y]];
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
    
    export function checkForWinInGrid(board: BoardType, player: PlayerType): boolean {
        const gridPosition: PositionType =  gameStore.gridPosition;
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
    
    export function getValidGridMoves(): MoveGridMove[] {
        const result: MoveGridMove[] = [];
        const gridPosition: PositionType =  gameStore.gridPosition;
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
    
    export function countPieces(): number {
        let count: number = 0;
        const board: BoardType =    gameStore.board;
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
    
    export function executeAIMove(move: AIMove, player: PlayerType): void {
        switch (move.type) {
            case 'PlacePiece':
                gameStore.placePiece(move.placeX, move.placeY, player);
                gameStore.finishTurn();
                break;
                
            case 'MoveGrid':
                gameStore.moveGrid(move.deltaX, move.deltaY);
                break;
                
            case 'MovePiece':
                gameStore.movePiece(move.fromX, move.fromY, move.toX, move.toY);
                gameStore.finishTurn();
                break;
        }
    }
