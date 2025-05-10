<script setup lang="ts">
import MenuButton from './MenuButton.vue';
import { useGameStore } from '../stores/GameStore.ts';
import { usePlayerStore } from '../stores/PlayerStore.ts';

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

</script>


<template>
    <div class="sideMenu">        
        <h1>tictactwo</h1>
        <p class="text">
            next move: {{ nextMove() }}<br>
            your piece: {{ gameStore.currentPlayer }}<br>
            pieces left: {{ piecesLeft() }}
        </p>
        
        <MenuButton>ai move</MenuButton>
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