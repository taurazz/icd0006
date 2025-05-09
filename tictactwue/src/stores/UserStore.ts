import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userData' , () => {
    const userName = ref<string>("");
    return { userName };
})