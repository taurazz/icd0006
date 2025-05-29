<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GpsSessionService } from '@/services/GpsSessionService'
import { GpsSessionTypeService } from '@/services/GpsSessionTypeService'
import type { IGpsSession } from '@/types/domain/IGpsSession'
import type { IGpsSessionType } from '@/types/domain/IGpsSessionType'
import type { IGpsSessionCreate } from '@/types/domain/IGpsSessionCreate'

const route = useRoute()
const router = useRouter()
const service = new GpsSessionService()
const typeService = new GpsSessionTypeService()

const id = route.params.id as string
const session = ref<Partial<IGpsSession> | null>(null)
const selectedTypeId = ref('')
const types = ref<IGpsSessionType[]>([])
const saving = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const loadTypes = async () => {
  const result = await typeService.getAllAsync()
  if (result.data) {
    types.value = result.data
  }
}

const loadSession = async () => {
  loading.value = true

  try {
    const sessionsResult = await service.getAllAsync()

    if (sessionsResult.errors) {
      error.value = sessionsResult.errors[0] || 'Unable to load sessions'
      loading.value = false
      return
    }

    const sessions = sessionsResult.data!
    const foundSession = sessions.find(s => s.id === id)

    if (foundSession) {
      session.value = foundSession

      let sessionTypeId = ''
      if (foundSession.gpsSessionType) {
        try {
          const parsed = JSON.parse(foundSession.gpsSessionType)
          const sessionTypeName = parsed.en || ''
          const matchingType = types.value.find(type => type.name === sessionTypeName)
          if (matchingType) {
            sessionTypeId = matchingType.id
          }
        } catch {
          const matchingType = types.value.find(type => type.name === foundSession.gpsSessionType)
          if (matchingType) {
            sessionTypeId = matchingType.id
          }
        }
      }

      selectedTypeId.value = sessionTypeId
    } else {
      error.value = 'Session not found'
    }
  } catch (err) {
    error.value = 'Error loading session'
    console.error('Error loading session:', err)
  }

  loading.value = false
}

onMounted(async () => {
  await loadTypes()
  await loadSession()
})

const submit = async () => {
  if (!session.value) return

  saving.value = true
  error.value = null

  const updateData: IGpsSessionCreate = {
    id: id,
    name: session.value.name || '',
    description: session.value.description || '',
    gpsSessionTypeId: selectedTypeId.value,
    recordedAt: new Date().toISOString(),
    paceMin: session.value.paceMin,
    paceMax: session.value.paceMax
  }

  console.log('Update data:', updateData)

  const res = await service.updateAsync(updateData)
  saving.value = false
  console.log(res)
}
</script>

<template>
  <div class="container">
    <h1>Edit GPS Session</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading session...</p>
    </div>

    <form v-else-if="session" @submit.prevent="submit">
      <div v-if="error" class="alert alert-warning" role="alert">
        {{ error }}
      </div>

      <div class="form-outline mb-3">
        <label for="sessionName" class="form-label">Name</label>
        <input
          id="sessionName"
          v-model="session.name"
          type="text"
          class="form-control"
          required
          placeholder="Name"
        />
      </div>

      <div class="form-outline mb-3">
        <label for="sessionDescription" class="form-label">Description</label>
        <input
          id="sessionDescription"
          v-model="session.description"
          type="text"
          class="form-control"
          placeholder="Description"
        />
      </div>

      <div class="form-outline mb-3">
        <label for="sessionType" class="form-label">Session Type</label>
        <select
          id="sessionType"
          v-model="selectedTypeId"
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

      <div class="row">
        <div class="col-md-6">
          <div class="form-outline mb-3">
            <label for="paceMin" class="form-label">Min Pace</label>
            <input
              id="paceMin"
              v-model.number="session.paceMin"
              type="number"
              step="1"
              class="form-control"
              placeholder="Min pace"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-outline mb-3">
            <label for="paceMax" class="form-label">Max Pace</label>
            <input
              id="paceMax"
              v-model.number="session.paceMax"
              type="number"
              step="1"
              class="form-control"
              placeholder="Max pace"
            />
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button
          class="btn btn-secondary"
          type="button"
          @click="router.push({ name: 'session' })"
          :disabled="saving"
        >
          Cancel
        </button>
      </div>
    </form>

    <div v-else-if="!loading" class="alert alert-danger">
      Failed to load session data. Please try again.
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 2rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
