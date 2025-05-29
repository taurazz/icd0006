<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import type { IResultObject } from '../types/IResultObject'
import { GpsSessionService } from '../services/GpsSessionService'
import type { IGpsSession } from '../types/domain/IGpsSession'
import { useUserDataStore } from '@/stores/userDataStore';
import router from '@/router';

const requestIsOngoing = ref(false)
const data = reactive<IResultObject<IGpsSession[]>>({})
const service = new GpsSessionService()
const userStore = useUserDataStore();

const fetchPageData = async () => {
  requestIsOngoing.value = true
  try {
    const result = await service.getAllAsync()
    console.log(result.data)

    data.data = result.data
    data.errors = result.errors
  } catch (error) {
    console.error(error)
  } finally {
    requestIsOngoing.value = false
  }
}

onMounted(async () => {
  if (!userStore.jwt) {
    router.push("/login");
    return;
  }
  await fetchPageData()
})

const handleDelete = async (id: string) => {
  try {
    const result = await service.removeAsync(id)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <h1>Index</h1>

  <p>
    <RouterLink to="/sessioncreate" class="">Create New</RouterLink>
  </p>
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>RecordedAt</th>
        <th>Locations</th>
        <th>User</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data.data" :key="item.id">
        <td>
          {{ item.name }}
        </td>
        <td>
          {{ item.description }}
        </td>
        <td>
          {{ item.recordedAt }}
        </td>
        <td>
          {{ item.gpsLocationsCount }}
        </td>
        <td>
          {{ item.userFirstLastName }}
        </td>
        <td>
            <RouterLink :to="'/session/edit/' + item.id">Edit</RouterLink> |
            <button @click="handleDelete(item.id!)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
