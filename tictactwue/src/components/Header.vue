<script setup lang="ts"></script>

<template>
    <header class="header">
        <nav class="navbar">
            <ul class="navbar-list">
                <li class="nav-item" @click="$emit('navigate', 'home')">Home</li>
                <li class="nav-item" @click="$emit('navigate', 'about')">Play</li>
                <li class="nav-item" @click="$emit('navigate', 'contact')">Log in</li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
.header {
    background-color: #2e2e2e;
}

.nav-item {
    display: inline-block;
    cursor: pointer;
    padding: 14px 25px;
    transition: background-color 0.3s ease;
}
.nav-item:hover {
    background-color: #242424;
}
</style>