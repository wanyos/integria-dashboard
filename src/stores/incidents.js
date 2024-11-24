import { defineStore } from 'pinia'
import { ref } from 'vue'
import IncidentsApi from '@/api/incidents_api'

export const useIncidentsStore = defineStore('incidents', () => {
  const allIncidentsYear = ref({ openInc: [], closeInc: [] })
  const incidentsRange = ref({
    current: { open: 0, close: 0, pending: 0, avg: { hour: 0, minute: 0 } },
    lastYear: { open: 0, close: 0, pending: 0, avg: { hour: 0, minute: 0 } },
  })
  const openIncidentsGroup = ref([])

  const fetchData = async (startDate, endDate, yearValue) => {
    // console.log('year value store', yearValue)
    incidentsRange.value = await IncidentsApi.getIncidentsRange(startDate, endDate)
    allIncidentsYear.value = await IncidentsApi.getAllIncidentsYear(yearValue)
    openIncidentsGroup.value = await IncidentsApi.getOpenIncidentsGroup()
    // console.log('store range', incidentsRange.value)
    console.log('store year', allIncidentsYear.value)
    // console.log('store open', openIncidentsGroup.value)
  }

  return { incidentsRange, allIncidentsYear, fetchData }
})
