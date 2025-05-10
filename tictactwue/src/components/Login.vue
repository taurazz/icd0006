<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';
import MenuButton from './MenuButton.vue';
import { usePlayerStore } from '../stores/PlayerStore';

const store = usePlayerStore();
const playerOne = ref('');
const playerTwo = ref('');

const startGame = () => {
    store.playerOne = playerOne.value.trim() || 'Player X';
    store.playerTwo = playerTwo.value.trim() || 'Player O';
    router.push({
        name: 'Play',
    });
}
</script>

<template>
    <p>Enter player names</p>
      <form @submit.prevent="startGame">
        <div class="nameforms">
            <input v-model="playerOne" class="form-control" placeholder="Player X">
            <input v-model="playerTwo" class="form-control" placeholder="Player O">
        </div>
    </form>

    <MenuButton @buttonClick="startGame">Start a new game</MenuButton>
</template>

<style scoped>
.nameforms{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    margin: 20px;
}

.form-control {
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #646cff;
  border-radius: 8px;
  width: 160px;
  transition: border-color 0.3s ease;
}
</style>