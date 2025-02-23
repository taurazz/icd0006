export default class AI {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
    }

    findBestMove(player, opponent) {
        const { board, size } = this.gameBoard;

        // if next move is winning
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (this.gameBoard.isCellEmpty(x, y)) {
                    board[x][y] = player;
                    if (this.gameBoard.checkWin(player)) {
                        board[x][y] = null;
                        return { x, y };
                    }
                    board[x][y] = null;
                }
            }
        }

        // block opponents winning move
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (this.gameBoard.isCellEmpty(x, y)) {
                    board[x][y] = opponent;
                    if (this.gameBoard.checkWin(opponent)) {
                        board[x][y] = null;
                        return { x, y };
                    }
                    board[x][y] = null;
                }
            }
        }

        // otherwise choose a random move
        const emptyCells = [];
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (this.gameBoard.isCellEmpty(x, y)) {
                    emptyCells.push({ x, y });
                }
            }
        }
        return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
    }
}
