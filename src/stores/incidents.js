import { defineStore } from 'pinia'
import { ref } from 'vue'
import IncidentsApi from '@/api/incidents_api'

export const useIncidentsStore = defineStore('incidents', () => {
  const totalIncidents = ref({
    current: {
      open: 0,
      close: 0,
      pending: 0,
    },
    lastYear: {
      open: 0,
      close: 0,
      pending: 0,
    },
  })

  const fetchData = async (startDate, endDate) => {
    const total = await IncidentsApi.getTotalIncidents(startDate, endDate)
    totalIncidents.value = total
  }

  return { totalIncidents, fetchData }
})
