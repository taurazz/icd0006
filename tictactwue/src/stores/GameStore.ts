import { ref } from 'vue';
import { defineStore } from 'pinia';
import { usePlayerStore } from './PlayerStore';
import router from '../router';

export const useGameStore = defineStore('game', () => {
    const board = ref<(string | null)[][]>(Array(5).fill(null).map(() => Array(5).fill(null)));
    const currentPlayer = ref<'X' | 'O'>('X');
    const gridPos = ref<{ x: number, y: number }>({ x: 1, y: 1 });
    const selectedPiece = ref<{ x: number, y: number } | null>(null);
    const xPieces = ref<number>(4);
    const oPieces = ref<number>(4);
    const playerStore = usePlayerStore();
    const winner = ref<'X' | 'O' | null>(null);

    function handleCellClick(x: number, y: number) {

        if (x < gridPos.value.x || x >= gridPos.value.x + 3 ||
            y < gridPos.value.y || y >= gridPos.value.y + 3) {
                return;
            }

        if (!canDoAdvancedMoves(currentPlayer.value)) {
            handlePlacePiece(x, y);
        } else if (canDoAdvancedMoves(currentPlayer.value)) {
            if (board.value[y][x] === null && selectedPiece.value === null) {
                handlePlacePiece(x, y);
            } else {
                handleMovePiece(x, y);
            }
        }

    }
    
    function handlePlacePiece(x: number, y: number): void {
        if (currentPlayer.value === 'X' && xPieces.value == 0 || currentPlayer.value === 'O' && oPieces.value == 0) {
            return;
        }
        if (board.value[y][x] === null) {
            placePiece(x, y, currentPlayer.value);
        }
    }

    function placePiece(x: number, y: number, player: 'X' | 'O'): void {
        board.value[y][x] = player;
        
        if (currentPlayer.value === 'X') {
            xPieces.value--;
        } else {
            oPieces.value--;
        }

        finishTurn();
    }

    function handleMovePiece(x: number, y: number): void {
        if (selectedPiece.value === null) {
            // Select a piece
            if (board.value[y][x] === currentPlayer.value) {
                selectedPiece.value = { x, y };
            }
        } else {
            // Move to empty cell
            if (board.value[y][x] === null) {
                movePiece(selectedPiece.value.x, selectedPiece.value.y, x, y);
            } else {
                // Deselect the piece if clicked on another piece
                selectedPiece.value = null;
                
                // If clicked on own piece, select it
                if (board.value[y][x] === currentPlayer.value) {
                    selectedPiece.value = { x, y };
                }
            }
        }
    }

    function movePiece(fromX: number, fromY: number, toX: number, toY: number): void {
        board.value[toY][toX] = board.value[fromY][fromX];
        board.value[fromY][fromX] = null;
        selectedPiece.value = null;
        finishTurn();
    }

    function moveGrid(dx: number, dy: number): void {
        if (!canDoAdvancedMoves(currentPlayer.value)) return;
        
        const newX = gridPos.value.x + dx;
        const newY = gridPos.value.y + dy;
        
        if (newX >= 0 && newX + 3 <= 5 && newY >= 0 && newY + 3 <= 5) {
            gridPos.value = { x: newX, y: newY };

            finishTurn();
        }
    }

    function finishTurn(): void {
        if (checkWin()) {
            winner.value = currentPlayer.value;

            if (currentPlayer.value == 'X') {
                playerStore.playerOneScore += 1;
            } else if (currentPlayer.value == 'O') {
                playerStore.playerTwoScore += 1;
            }
            resetGame();
            router.push('/gameover')
            
        }
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
        selectedPiece.value = null;
    }

    function checkWin(): boolean {
        const gridX: number = gridPos.value.x;
        const gridY: number = gridPos.value.y;

        // get the grid from the board
        const grid: (string | null)[][] = [];
        for (let y = 0; y < 3; y++) {
            grid[y] = [];
            for (let x = 0; x < 3; x++) {
                grid[y][x] = board.value[gridY + y][gridX + x];
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


    function canDoAdvancedMoves(player: 'X' | 'O'): boolean {
        return player === 'X'
            ? xPieces.value < 3
            : oPieces.value < 3;
    }
    
    function resetGame(): void {
        board.value = Array(5).fill(null).map(() => Array(5).fill(null));
        currentPlayer.value = 'X';
        selectedPiece.value = null;
        xPieces.value = 4;
        oPieces.value = 4;
        gridPos.value = { x: 1, y: 1 };

    }

    return { board, currentPlayer, gridPos, selectedPiece, xPieces, oPieces, winner,
        handleCellClick, placePiece, movePiece, moveGrid, resetGame, checkWin, finishTurn, handlePlacePiece };
})