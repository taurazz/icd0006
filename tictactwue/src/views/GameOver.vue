<script setup lang="ts">

import Header from '../components/Header.vue';
import router from '../router';
import MenuButton from '../components/MenuButton.vue';
import { usePlayerStore } from '../stores/PlayerStore';
import { useGameStore } from '../stores/GameStore';

const playerStore = usePlayerStore();
const gameStore = useGameStore();

const getWinnerName = () => {
  if (gameStore.winner === 'X') {
    return playerStore.playerOne || 'Player 1';
  } else if (gameStore.winner === 'O') {
    return playerStore.playerTwo || 'Player 2';
  }
  return 'Unknown';
};

</script>

<template>
  <Header />
  <div class="container">
    <div class="rulesbox">
      <h1>Game Over</h1>
      <p>
         {{ getWinnerName() }} wins. The score is {{ playerStore.playerOneScore }} - {{ playerStore.playerTwoScore }}.
      </p>
      <MenuButton @buttonClick="() => { router.push('/play') }">Play again</MenuButton>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
}
.rulesbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: justify;
  justify-content: center;
  width: 50%;
}
</style>
