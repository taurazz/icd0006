<script setup lang="ts">

import Header from '../components/Header.vue';
import Login from '../components/Login.vue';

</script>

<template>
  <Header />
  <div class="container">
    <div class="rulesbox">
      <h1>How to play:</h1>
      <p>
      This is a variation of Tic-Tac-Toe that plays on a 5x5 board with an inner 3x3 grid. 
      Each player has 4 pieces and the goal is the same - <strong>get three in a row</strong> but only the pieces inside the grid count.
      Players take turns by placing pieces inside the grid and after placing two pieces they can choose between three options:
      </p>
      <ul class="list">
        <li>Place a piece inside the grid</li>
        <li>Move a piece already in the grid</li>
        <li>Move the grid</li>
      </ul>
      <p>
      Use the arrow buttons to move the grid, AI move button to let AI do the move for you and reset button to start the game over.
      </p>
      <Login />
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

.list {
  align-self: flex-start;
}
</style>
