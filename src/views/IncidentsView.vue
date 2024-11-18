<template>
  <div>
    <h3>Incidents</h3>
    <p>incidents: {{ incidents }}</p>
  </div>
</template>

<script setup>
import IncidentsApi from '@/api/incidents_api'
import { onMounted, ref } from 'vue'

const incidents = ref([])

onMounted(async () => {
  try {
    incidents.value = await IncidentsApi.getIncidents()
  } catch (error) {
    console.error('Error fetching incidents:', error)
  }
})
</script>

<style lang="scss" scoped></style>
