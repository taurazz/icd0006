<script setup lang="ts">

import Header from '../components/Header.vue';
import router from '../router';
import MenuButton from '../components/MenuButton.vue';

</script>

<template>
  <Header />
  <div class="container">
    <div class="rulesbox">
      <h1>Game Over</h1>
      <p>
        Blabla wins. The score is blabla.
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
