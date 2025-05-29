<script setup lang="ts">
import { ref } from 'vue'
import { AccountService } from '@/services/AccountService'
import { useRouter } from 'vue-router'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const error = ref<string | null>(null)

const doRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords don't match"
    return
  }

  const response = await AccountService.register(
    firstName.value,
    lastName.value,
    email.value,
    password.value,
    confirmPassword.value
  )

  if (response.data) {
    router.push({ name: 'login' })
  } else {
    error.value = response.errors?.[0] || 'Registration failed'
  }
}
</script>

<template>
  <div class="register-container">
    <h1>Register</h1>

    <form @submit.prevent="doRegister" class="register">
      <div v-if="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>

      <div class="form-outline mb-3">
        <input v-model="firstName" type="text" class="form-control" required placeholder="First Name" />
      </div>

      <div class="form-outline mb-3">
        <input v-model="lastName" type="text" class="form-control" required placeholder="Last Name" />
      </div>

      <div class="form-outline mb-3">
        <input v-model="email" type="email" class="form-control" required placeholder="Email address" />
      </div>

      <div class="form-outline mb-3">
        <input v-model="password" type="password" class="form-control" required placeholder="Password" />
      </div>

      <div class="form-outline mb-3">
        <input v-model="confirmPassword" type="password" class="form-control" required placeholder="Confirm Password" />
      </div>

      <button class="btn btn-primary btn-block mb-4" type="submit">Register</button>
      <p>
        Already have an account?
        <RouterLink to="/login">Login</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 450px;
  margin: 0 auto;
  padding-top: 2rem;
}
</style>
