<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import type { IResultObject } from '../types/IResultObject';
import { GpsSessionService } from '../services/GpsSessionService';
import type { IGpsSession } from '../domain/IGpsSession';

const requestIsOngoing = ref(false);
const data = reactive<IResultObject<IGpsSession[]>>({});
const service = new GpsSessionService();


const fetchPageData = async() => {
  requestIsOngoing.value = true;
  try {
    const result = await service.getAllAsync();
    console.log(result.data);

    data.data = result.data;
    data.errors = result.errors;

  } catch (error) {
    console.error(error);
  } finally {
    requestIsOngoing.value = false;
  }
};

onMounted(async() => {
  await fetchPageData();
});

</script>

<template>
  <h1>Index</h1>

  <p>
    <RouterLink to="/sessioncreate" class="">Create New</RouterLink>
  </p>
  <table class="table">
    <thead>
      <tr>
        <th>
          Name
        </th>
        <th>
          Description
        </th>
        <th>
          RecordedAt
        </th>
        <th>
          Locations
        </th>
        <th>
          User
        </th>
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
          <a href="/ContactTypes/Edit/01960002-68f1-7a7a-9947-e0c9b8c948f9">Edit</a> |
          <a href="/ContactTypes/Details/01960002-68f1-7a7a-9947-e0c9b8c948f9">Details</a> |
          <a href="/ContactTypes/Delete/01960002-68f1-7a7a-9947-e0c9b8c948f9">Delete</a>
        </td>
      </tr>
    </tbody>
  </table>

</template>

<style scoped>
</style>
