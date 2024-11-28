import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import IncidentsApi from '@/api/incidents_api'

export const useIncidentsStore = defineStore('incidents', () => {
  const allIncidentsYear = ref({ openInc: [], closeInc: [] })
  const incidentsRange = ref({
    current: { open: 0, close: 0, pending: 0, avg: { hour: 0, minute: 0 } },
    lastYear: { open: 0, close: 0, pending: 0, avg: { hour: 0, minute: 0 } },
  })
  const openIncidentsGroup = ref([])
  const allIncidentsGroup = ref([])

  const fetchData = async (startDate, endDate, yearValue) => {
    // console.log('year value store', yearValue)
    incidentsRange.value = await IncidentsApi.getIncidentsRange(startDate, endDate)
    allIncidentsYear.value = await IncidentsApi.getAllIncidentsYear(yearValue)
    openIncidentsGroup.value = await IncidentsApi.getOpenIncidentsGroup()
    allIncidentsGroup.value = await IncidentsApi.getAllIncidentsGroup(startDate, endDate)
    // console.log('store range', incidentsRange.value)
    // console.log('store year', allIncidentsYear.value)
    // console.log('store open', openIncidentsGroup.value)
    // console.log('store group', allIncidentsGroup.value)
  }

  // Getters para encapsular datos procesados
  const openIncidentsYear = computed(() => allIncidentsYear.value.openInc || [])
  const closedIncidentsYear = computed(() => allIncidentsYear.value.closeInc || [])
  const currentIncidentsRange = computed(() => incidentsRange.value.current)
  const lastYearIncidentsRange = computed(() => incidentsRange.value.lastYear)
  const allOpenIncidentsGroup = computed(() => openIncidentsGroup.value)
  const allIncidentsGroupData = computed(() => allIncidentsGroup.value)

  return {
    fetchData,
    openIncidentsYear,
    closedIncidentsYear,
    currentIncidentsRange,
    lastYearIncidentsRange,
    allOpenIncidentsGroup,
    allIncidentsGroupData,
  }
})
