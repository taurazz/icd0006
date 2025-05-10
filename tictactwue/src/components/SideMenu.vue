<script setup lang="ts">
import MenuButton from './MenuButton.vue';
import { useGameStore } from '../stores/GameStore.ts';
import { usePlayerStore } from '../stores/PlayerStore.ts';
import { makeAIMove } from '../aiLogic.ts';

const gameStore = useGameStore();
const playerStore = usePlayerStore();

const piecesLeft = () => {
    if (gameStore.currentPlayer === 'X') {
        return gameStore.xPieces;
    } else {
        return gameStore.oPieces;
    }
}

const nextMove = () => {
    if (gameStore.currentPlayer === 'X') {
        return playerStore.playerOne;
    } else {
        return playerStore.playerTwo;
    }
}

const opponent = () => {
    if (gameStore.currentPlayer === 'X') {
        return 'O';
    } else {
        return 'X';
    }
}

</script>


<template>
    <div class="sideMenu">        
        <h1>tictactwo</h1>
        <p class="text">
            next move: {{ nextMove() }}<br>
            your piece: {{ gameStore.currentPlayer }}<br>
            pieces left: {{ piecesLeft() }}
        </p>
        
        <MenuButton @buttonClick="() => makeAIMove(gameStore.currentPlayer, opponent())">ai move</MenuButton>
        <MenuButton @buttonClick="() => gameStore.resetGame()">reset</MenuButton>

    </div>
</template>

<style scoped>
.sideMenu {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    width: 15%;
    text-align: center;;
    margin: 50px;
}
.text {
    font-size:larger;
}
</style>