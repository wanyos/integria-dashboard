<template>
  <div>
    <h3>Incidents</h3>
    <p>incidents: {{ incidents }}</p>
  </div>
</template>

<script setup>
import IncidentsApi from '@/api/incidents_api'
import { onMounted, ref } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'

const incidents = ref([])
const authStore = useAuthenticationStore()

onMounted(async () => {
  try {
    const token = authStore.getValidToken
    console.log('token incidents', token)
    if (token) {
      incidents.value = await IncidentsApi.getIncidents(token)
    }
  } catch (error) {
    console.error('Error fetching incidents:', error)
  }
})
</script>

<style lang="scss" scoped></style>
