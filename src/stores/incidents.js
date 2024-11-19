
import { defineStore } from 'pinia'
import { ref } from 'vue'
import IncidentsApi from '@/api/incidents_api'

export const useIncidentsStore = defineStore('incidents', () => {

  const totalIncidents = ref({})

  const fetchData = async (startDate, endDate) => {
    const total = await IncidentsApi.getTotalIncidents(startDate, endDate);
    // console.log('total store', total);
  }

  return { totalIncidents, fetchData }
})
