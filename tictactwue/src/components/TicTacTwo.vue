<script setup lang="ts">
import Board from './Board.vue';
import SideMenu from './SideMenu.vue';
import { useGameStore } from '../stores/GameStore.ts';

const gameStore = useGameStore();
</script>

<template>
    <div class="gamePage">
        <SideMenu/>
        <Board :board=gameStore.board 
        :grid-pos=gameStore.gridPos 
        :grid-size=3
        @cell-click="(x: number, y: number) => gameStore.handleCellClick(x, y)"
        @arrow-click="(dx: number, dy: number) => gameStore.moveGrid(dx, dy)"/>
    </div>
</template>

<style scoped>
.gamePage {
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>