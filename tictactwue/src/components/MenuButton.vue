<script setup lang="ts"></script>

<template>
    <button @click="$emit('buttonClick')">
        <slot></slot>
    </button>
</template>

<style scoped></style>