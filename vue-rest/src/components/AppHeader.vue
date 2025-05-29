<script setup lang="ts">
import router from '@/router';
import { useUserDataStore } from '@/stores/userDataStore';

const userStore = useUserDataStore();

const handleLogout = () => {
  userStore.jwt = ''
  userStore.firstName = ''
  userStore.lastName = ''
  router.push('/')
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">GPS APP</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

      <div class="collapse navbar-collapse justify-content-between">
        <div class="navbar-nav">
          <a><RouterLink class="nav-link active" to="/">Home</RouterLink></a>
          <a><RouterLink class="nav-link" to="/session">Session</RouterLink></a>
        </div>
        <div v-if="!userStore.jwt" class="navbar-nav">
          <a><RouterLink class="nav-link" to="/register">Register</RouterLink></a>
          <a><RouterLink class="nav-link" to="/login">Login</RouterLink></a>
        </div>
        <div v-else class="navbar-nav">
          <a class="nav-link" @click="handleLogout">Log out</a>
        </div>
      </div>
    </div>
    </nav>
  </header>
</template>

<style scoped>
</style>
