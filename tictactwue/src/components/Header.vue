<script setup lang="ts">
import { ref } from 'vue';
import { usePlayerStore } from '../stores/PlayerStore';

const store = usePlayerStore();
const playerOne = ref(store.playerOne);
const playerOneScore = ref(store.playerOneScore);
const playerTwo = ref(store.playerTwo);
const playerTwoScore = ref(store.playerTwoScore);
</script>

<template>
    <header class="header">
        <nav class="navbar">
            <ul class="navbar-list">
                <li class="nav-item"><RouterLink class="nav-link" to="/">Rules</RouterLink></li>
                <li class="nav-item"><RouterLink class="nav-link" to="/play">Game</RouterLink></li>
            </ul>
            <div class="navbar-right">
                <div class="player-one">
                    <p>{{ playerOne }}: {{ playerOneScore }} wins</p>
                </div>
                <div class="player-two">
                    <p>{{ playerTwo }}: {{ playerTwoScore }} wins</p>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>
.header {
    background-color: #2e2e2e;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    height: 70px;
}

.nav-item {
    display: inline-block;

}
.nav-item:hover {
    background-color: #242424;
}

.nav-link {
    display: block;
    cursor: pointer;
    padding: 14px 20px;
    transition: background-color 0.3s ease;
}

.navbar-right {
    display: flex;
    gap: 20px;
    padding-right: 40px;
}
</style>