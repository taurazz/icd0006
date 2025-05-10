<script setup lang="ts">

interface Props {
    board: (string | null)[][];
    gridPos: { x: number; y: number };
    gridSize: number;
}

const props = defineProps<Props>();

</script>

<template>
    <div class="board-container">
        <div class="icons">
            <img src="../assets/icons/arrow-up-left.svg" alt="arrow up-left" class="arrow" @click="$emit('arrow-click', -1, -1)"/>
            <img src="../assets/icons/arrow-up.svg" alt="arrow up" class="arrow" @click="$emit('arrow-click', 0, -1)"/>
            <img src="../assets/icons/arrow-up-right.svg" alt="arrow up-right" class="arrow" @click="$emit('arrow-click', 1, -1)"/>
        </div>
        <div class="mid">
            <img src="../assets/icons/arrow-left.svg" alt="arrow left" class="arrow" @click="$emit('arrow-click', -1, 0)"/>
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
            <img src="../assets/icons/arrow-right.svg" alt="arrow right" class="arrow" @click="$emit('arrow-click', 1, 0)"/>
        </div>
        <div class="icons">
            <img src="../assets/icons/arrow-down-left.svg" alt="arrow down-left" class="arrow" @click="$emit('arrow-click', -1, 1)"/>
            <img src="../assets/icons/arrow-down.svg" alt="arrow down" class="arrow" @click="$emit('arrow-click', 0, 1)"/>
            <img src="../assets/icons/arrow-down-right.svg" alt="arrow down-right" class="arrow" @click="$emit('arrow-click', 1, 1)"/>
        </div>
    </div>
</template>

<style scoped>
.board-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.board {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

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

.arrow {
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.mid {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.icons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

</style>