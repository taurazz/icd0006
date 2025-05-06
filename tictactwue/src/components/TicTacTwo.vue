<script setup lang="ts">
import { reactive } from 'vue';
import Game from '../bll/game.ts';
import Board from './Board.vue';

const game = reactive(new Game());</script>

<template>
    <Board :board=game.board @cell-click="(x: number, y: number) => game.placePiece(x, y)"/>
</template>

<style scoped></style>