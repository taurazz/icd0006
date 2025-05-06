<script setup lang="ts">
import type { BoardType } from '../bll/game.ts';

interface Props {
    board: BoardType;
}

const props = defineProps<Props>();

</script>

<template>
    <div class="board">
        <div class="row" v-for="(row, rowIndex) in props.board" :key="rowIndex">
            <div class="cell" v-for="(cell, colIndex) in row" :key="colIndex" @click="$emit('cell-click', colIndex, rowIndex)">
                {{ cell || ' ' }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.board {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex-direction: row;
}

.cell {
    width: 50px;
    height: 50px;
    margin: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid aquamarine;
    cursor: pointer;
    font-size: 36px;
    font-family: monospace;
}
</style>