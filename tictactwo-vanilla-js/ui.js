    export function createHeader(game) {
        const header = document.createElement("h1");
        header.textContent = "tic-tac-two";
        document.body.appendChild(header);

        const status = document.createElement("div");
        status.id = "status";
        status.textContent = `player ${game.currentPlayer}'s turn (pieces left: ${game.currentPlayer === 'X' ? game.xPieces : game.oPieces})`;
        document.body.appendChild(status);

        const timer = document.createElement("div");
        timer.id = "timer";
        timer.textContent = "time: 0s";
        document.body.appendChild(timer);
    }

    export function setupControls(game) {
        const controlsDiv = document.createElement("div");
        controlsDiv.id = "controls";
        document.body.appendChild(controlsDiv);
        
        const resetBtn = document.createElement("button");
        resetBtn.id = "reset";
        resetBtn.textContent = "reset";
        resetBtn.addEventListener("click", () => game.resetGame());
        controlsDiv.appendChild(resetBtn);

        const aiMoveBtn = document.createElement("button");
        aiMoveBtn.id = "ai-move";
        aiMoveBtn.textContent = "ai move";
        
        let debounce = false;
        aiMoveBtn.addEventListener("click", () => {
            if (debounce) return;
            debounce = true;
            game.aiMove();

            setTimeout(() => {
                debounce = false;
            }, 200);
        });
        
        controlsDiv.appendChild(aiMoveBtn);

        
        // Add grid movement buttons
        const gridControlsDiv = document.createElement("div");
        gridControlsDiv.id = "grid-controls";
        gridControlsDiv.style.marginTop = "10px";
        
        const directions = [
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
            const btn = document.createElement("button");
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

    export function createBoard(game) {
        const boardContainer = document.createElement("div");
        boardContainer.id = "board-container";
        document.body.appendChild(boardContainer);

        const board = document.createElement("div");
        board.id = "board";
        boardContainer.appendChild(board);

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener("click", () => game.handleCellClick(x, y));
                board.appendChild(cell);
            }
        }
    }

    export function setupGrid() {
        const grid = document.createElement("div");
        grid.id = "grid";
        document.getElementById("board-container").appendChild(grid);
    }
