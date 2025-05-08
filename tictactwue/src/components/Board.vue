<script setup lang="ts">

interface Props {
    board: (string | null)[][];
    gridPos: { x: number; y: number };
    gridSize: number;
}

const props = defineProps<Props>();

</script>

<template>
    <div class="board">
        <div class="row" v-for="(row, rowIndex) in props.board" :key="rowIndex">
            <div class="cell" v-for="(cell, colIndex) in row" :key="colIndex" @click="$emit('cell-click', colIndex, rowIndex)">
                <p class="grid" 
                v-if="props.gridPos.x <= colIndex && colIndex < props.gridPos.x + props.gridSize
                && props.gridPos.y <= rowIndex && rowIndex < props.gridPos.y + props.gridSize">
                    {{ cell || ' ' }}</p>
                <p v-else>{{ cell || ' ' }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

.row {
    display: flex;
    flex-direction: row;
}

.cell {
    width: 60px;
    height: 60px;
    margin: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid aquamarine;
    cursor: pointer;
    font-size: 36px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.cell:hover {
    border: 2px solid aquamarine;
}

.cell:has(.grid) {
    background-color: rgb(39, 75, 63);
    transition: background-color 0.3s ease;
}

</style>