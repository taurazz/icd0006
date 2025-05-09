import { createRouter, createWebHistory } from 'vue-router'
import Rules from '../views/Rules.vue'
import Play from '../views/Play.vue'
import GameOver from '../views/GameOver.vue'

const routes = [
    {
        path: '/', 
        name: 'Rules', 
        component: Rules
    },
    {
        path: '/play', 
        name: 'Play', 
        component: Play
    },
        {
        path: '/gameover', 
        name: 'GameOver', 
        component: GameOver
    },
]; 

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router;