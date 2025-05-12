<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { GpsLocationTypeService } from '../services/GpsLocationTypeService';
import type { IResultObject } from '../types/IResultObject';
import type { IGpsLocationType } from '../domain/IGpsLocationType';

const requestIsOngoing = ref(false);
const data = reactive<IResultObject<IGpsLocationType[]>>({});

const fetchPageData = async() => {
  requestIsOngoing.value = true;
  try {
    const result = await GpsLocationTypeService.getAll();
    console.log(result.data);

    data.data = result.data;
    data.errors = result.errors;

  } catch (error) {
    console.error(error);
  } finally {
    requestIsOngoing.value = false;
  }
}

  onMounted(async() => {
    await fetchPageData();
  })

</script>

<template>
  <div>Request is {{ requestIsOngoing ? 'ongoing' : 'done' }}.</div>
  {{ data.data }} <br>
  {{ data.errors }}
</template>

<style scoped>
</style>
