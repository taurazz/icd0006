export default class GameBoard {
    constructor(size = 3) {
        this.size = size;
        this.resetBoard();
    }

    resetBoard() {
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    }

    isCellEmpty(x, y) {
        return this.board[x][y] === null;
    }

    placePiece(x, y, player) {
        if (this.isCellEmpty(x, y)) {
            this.board[x][y] = player;
            return true;
        }
        return false;
    }

    checkWin(player) {
        const b = this.board;
        const s = this.size;

        // Check rows and columns
        for (let i = 0; i < s; i++) {
            if (b[i].every(cell => cell === player)) return true;
            if (b.map(row => row[i]).every(cell => cell === player)) return true;
        }

        // Check diagonals
        if (b.map((row, i) => row[i]).every(cell => cell === player)) return true;
        if (b.map((row, i) => row[s - 1 - i]).every(cell => cell === player)) return true;

        return false;
    }

    isFull() {
        return this.board.every(row => row.every(cell => cell !== null));
    }
}
