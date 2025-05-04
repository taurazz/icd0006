import { Game } from "./game";

export interface DirectionType {
    id: string;
    text: string;
    dx: number;
    dy: number;
}

let appContainer = document.getElementById("app")!;

export function createHeader(game: Game) {
    const header: HTMLHeadingElement = document.createElement("h1");
    header.textContent = "tic-tac-two";
    appContainer.appendChild(header);

    const status: HTMLDivElement = document.createElement("div");
    status.id = "status";
    status.textContent = `player ${game.currentPlayer}'s turn (pieces left: ${game.currentPlayer === 'X' ? game.xPieces : game.oPieces})`;
    appContainer.appendChild(status);

    const timer: HTMLDivElement = document.createElement("div");
    timer.id = "timer";
    timer.textContent = "time: 0s";
    appContainer.appendChild(timer);
}

export function setupControls(game: Game) {
    const controlsDiv: HTMLDivElement = document.createElement("div");
    controlsDiv.id = "controls";
    appContainer.appendChild(controlsDiv);
    
    const resetBtn: HTMLButtonElement = document.createElement("button");
    resetBtn.id = "reset";
    resetBtn.textContent = "reset";
    resetBtn.addEventListener("click", () => game.resetGame());
    controlsDiv.appendChild(resetBtn);

    const aiMoveBtn: HTMLButtonElement = document.createElement("button");
    aiMoveBtn.id = "ai-move";
    aiMoveBtn.textContent = "ai move";
    
    let debounce: boolean = false;
    aiMoveBtn.addEventListener("click", () => {
        if (debounce) return;
        debounce = true;
        game.aiMove();

        setTimeout(() => {
            debounce = false;
        }, 200);
    });
    
    controlsDiv.appendChild(aiMoveBtn);

    const gridControlsDiv: HTMLDivElement = document.createElement("div");
    gridControlsDiv.id = "grid-controls";
    gridControlsDiv.style.marginTop = "10px";
    
    const directions: DirectionType[] = [
        { id: "grid-up", text: "↑", dx: 0, dy: -1 },
        { id: "grid-left", text: "←", dx: -1, dy: 0 },
        { id: "grid-right", text: "→", dx: 1, dy: 0 },
        { id: "grid-down", text: "↓", dx: 0, dy: 1 },
        { id: "grid-up-left", text: "↖", dx: -1, dy: -1 },
        { id: "grid-up-right", text: "↗", dx: 1, dy: -1 },
        { id: "grid-down-left", text: "↙", dx: -1, dy: 1 },
        { id: "grid-down-right", text: "↘", dx: 1, dy: 1 }
    ];
    
    directions.forEach(dir => {
        if (!document.getElementById(dir.id)) {
        const btn: HTMLButtonElement = document.createElement("button");
        btn.id = dir.id;
        btn.textContent = dir.text;
        btn.classList.add("grid-control-btn");
        btn.addEventListener("click", () => game.moveGrid(dir.dx, dir.dy));
        gridControlsDiv.appendChild(btn);
        }
    });
    
    if (!document.getElementById("grid-controls")) {
        controlsDiv.appendChild(gridControlsDiv);
    }
}

export function createBoard(game: Game) {
    const boardContainer: HTMLDivElement = document.createElement("div");
    boardContainer.id = "board-container";
    appContainer.appendChild(boardContainer);

    const board: HTMLDivElement = document.createElement("div");
    board.id = "board";
    boardContainer.appendChild(board);

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell: HTMLDivElement = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x.toString();
            cell.dataset.y = y.toString();
            cell.addEventListener("click", () => game.handleCellClick(x, y));
            board.appendChild(cell);
        }
    }
}

export function setupGrid() {
    const grid = document.createElement("div");
    grid.id = "grid";
    document.getElementById("board-container")!.appendChild(grid);
}
