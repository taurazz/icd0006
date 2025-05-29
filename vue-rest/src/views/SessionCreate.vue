<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GpsSessionService } from '@/services/GpsSessionService'
import { useRouter } from 'vue-router'
import { GpsSessionTypeService } from '@/services/GpsSessionTypeService'
import type { IGpsSessionType } from '@/types/domain/IGpsSessionType'

const router = useRouter()
const sessionService = new GpsSessionService()
const typeService = new GpsSessionTypeService()

const name = ref('')
const description = ref('')
const typeId = ref('')
const types = ref<IGpsSessionType[]>([])
const error = ref<string | null>(null)

const loadTypes = async () => {
  const result = await typeService.getAllAsync()

  if (result.data) {
    types.value = result.data
  } else {
    error.value = result.errors?.[0] || 'Error loading session types'
  }
}

const submit = async () => {
  error.value = null

  const result = await sessionService.addAsync({
    name: name.value,
    description: description.value,
    gpsSessionTypeId: typeId.value
  })


  if (result.data) {
    router.push({ name: 'session' })
  } else {
    error.value = result.errors?.[0] || 'Error creating session'
  }
}
onMounted(loadTypes)
</script>

<template>
  <div class="container">
    <h1>Create GPS Session</h1>

    <form @submit.prevent="submit">
      <div v-if="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>
      <div class="form-outline mb-3">
        <input v-model="name" type="text" class="form-control" required placeholder="Name" />
      </div>
      <div class="form-outline mb-3">
        <input v-model="description" type="text" class="form-control" placeholder="Description" />
      </div>

      <div class="form-outline mb-3">
        <label for="sessionType" class="form-label">Session Type</label>
        <select
          id="sessionType"
          v-model="typeId"
          class="form-control"
        >
          <option value="">Select a session type (optional)</option>
          <option
            v-for="type in types"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

      <button class="btn btn-primary" type="submit">
        {{ 'Create' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 2rem;
}
</style>
