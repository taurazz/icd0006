<script setup lang="ts">
import { ref } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'
import { AccountService } from '@/services/AccountService'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useUserDataStore()

const email = ref('')
const password = ref('')

const error = ref<string | null>(null)

const doLogin = async () => {
  const response = await AccountService.login(email.value, password.value)
  console.log(response)
  if (response.data) {
    store.jwt = response.data.token
    store.firstName = response.data.firstName
    store.lastName = response.data.lastName
    router.push('/')
  } else {
    console.log('login failed')
    error.value = response.errors?.[0] || 'Login failed'
  }
}
</script>

<template>
  <div class="log-in-container">
    <h1>Log in</h1>
    <form class="login" @submit.prevent="doLogin">
      <div v-if="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <input v-model="email" type="email" aria-required="true" class="form-control" />
        <label class="form-label" for="form2Example1">Email address</label>
      </div>

      <div data-mdb-input-init class="form-outline mb-4">
        <input v-model="password" type="password" aria-required="true" class="form-control" />
        <label class="form-label" for="form2Example2">Password</label>
      </div>

      <button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        class="btn btn-primary btn-block mb-4"
      >
        Sign in
      </button>

      <div class="text-center">
        <p>Not a member? <RouterLink to="/register">Register</RouterLink></p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.log-in-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login {
  width: 100%;
  max-width: 330px;
}
</style>
