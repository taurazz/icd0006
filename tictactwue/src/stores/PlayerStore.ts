import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('userData' , () => {
    const playerOne = ref<string>("Player X");
    const playerOneScore = ref<number>(0);
    const playerTwo = ref<string>("Player O");
    const playerTwoScore = ref<number>(0);
    return { playerOne, playerTwo, playerOneScore, playerTwoScore };
})