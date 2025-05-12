<script setup lang="ts">
import Header from './components/AppHeader.vue';
import Footer from './components/AppFooter.vue';

</script>

<template>
  <Header/>
  <main class="container">
    <RouterView/>
  </main>
  <Footer/>
</template>

<style scoped>
</style>
