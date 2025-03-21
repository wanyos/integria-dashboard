import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ReportApi from '@/api/report_api'

export const useIncidentsStore = defineStore('incidents', () => {
  const allIncidentsYear = ref({ openInc: [], closeInc: [] })
  const incidentsRange = ref({
    current: { open: 0, close: 0, pending: 0, avg: { hour: 0, minute: 0 } },
    lastYear: { open: 0, close: 0, pending: 0, avg: { hour: 0, minute: 0 } },
  })
  const openIncidentsGroup = ref([])
  const allIncidentsGroup = ref([])
  const allIncLocationRange = ref([])
  const allIncBasesRange = ref([])
  const alIncParkingRange = ref([])
  const allIncByHours = ref([])
  const allIncByWeekdays = ref([])
  const totalIncidentsYears = ref([])
  const allIncByMonths = ref([])

  const fetchIncAnual = async(yearValue) => {
     //dashboard
     totalIncidentsYears.value = await ReportApi.getTotalIncYears(yearValue)
     allIncByMonths.value = await ReportApi.getIncBymonths()
  }

  const fetchIncYear = async (yearValue) => {
    allIncidentsYear.value = await ReportApi.getAllIncidentsYear(yearValue)
   }

   const fetchIncDates = async (startDate, endDate) => {
    try {
      const [
        incidentsRangeData,
        openIncidentsGroupData,
        allIncidentsGroupData,
        allIncLocationRangeData,
        allIncBasesRangeData,
        alIncParkingRangeData,
        allIncByHoursData,
        allIncByWeekdaysData,
      ] = await Promise.all([
        ReportApi.getIncidentsRange(startDate, endDate),
        ReportApi.getOpenIncidentsGroup(),
        ReportApi.getAllIncidentsGroup(startDate, endDate),
        ReportApi.getIncLocationRange(startDate, endDate),
        ReportApi.getIncBasesRange(startDate, endDate),
        ReportApi.getIncParkingRange(startDate, endDate),
        ReportApi.getIncByHours(startDate, endDate),
        ReportApi.getIncByWeekdays(startDate, endDate),
      ]);

      // Asignar los datos a las referencias reactivas
      incidentsRange.value = incidentsRangeData;
      openIncidentsGroup.value = openIncidentsGroupData;
      allIncidentsGroup.value = allIncidentsGroupData;
      allIncLocationRange.value = allIncLocationRangeData;
      allIncBasesRange.value = allIncBasesRangeData;
      alIncParkingRange.value = alIncParkingRangeData;
      allIncByHours.value = allIncByHoursData;
      allIncByWeekdays.value = allIncByWeekdaysData;
    } catch (error) {
      console.error('Error fetching incident data:', error);
    }
  };

  // const fetchIncDates = async (startDate, endDate) => {
  //   // console.log('year value store', yearValue)
  //   // incidentsRange.value = await IncidentsApi.getIncidentsRange(startDate, endDate)
  //   // allIncidentsYear.value = await IncidentsApi.getAllIncidentsYear(yearValue)
  //   // openIncidentsGroup.value = await IncidentsApi.getOpenIncidentsGroup()
  //   // allIncidentsGroup.value = await IncidentsApi.getAllIncidentsGroup(startDate, endDate)
  //   // allIncLocationRange.value = await IncidentsApi.getIncLocationRange(startDate, endDate)

  //   incidentsRange.value = await ReportApi.getIncidentsRange(startDate, endDate)
  //   openIncidentsGroup.value = await ReportApi.getOpenIncidentsGroup()
  //   allIncidentsGroup.value = await ReportApi.getAllIncidentsGroup(startDate, endDate)
  //   allIncLocationRange.value = await ReportApi.getIncLocationRange(startDate, endDate)
  //   allIncBasesRange.value = await ReportApi.getIncBasesRange(startDate, endDate)
  //   alIncParkingRange.value = await ReportApi.getIncParkingRange(startDate, endDate)
  //   allIncByHours.value = await ReportApi.getIncByHours(startDate, endDate)
  //   allIncByWeekdays.value = await ReportApi.getIncByWeekdays(startDate, endDate)

  //   // console.log('store range', incidentsRange.value)
  //   // console.log('store year', allIncidentsYear.value)
  //   // console.log('store open', openIncidentsGroup.value)
  //   // console.log('store group', allIncidentsGroup.value)
  //   // console.log('inc store location', allIncLocationRange.value)
  // }

  // Getters para encapsular datos procesados

  const openIncidentsYear = computed(() => allIncidentsYear.value.openInc || [])
  const closedIncidentsYear = computed(() => allIncidentsYear.value.closeInc || [])
  const currentIncidentsRange = computed(() => incidentsRange.value.current)
  const lastYearIncidentsRange = computed(() => incidentsRange.value.lastYear)
  const allOpenIncidentsGroup = computed(() => openIncidentsGroup.value)
  const allIncidentsGroupData = computed(() => allIncidentsGroup.value)
  const allIncLocationRangeData = computed(() => allIncLocationRange.value)
  const allIncParkingRangeData = computed(() => alIncParkingRange.value)
  const allIncByHoursRangeData = computed(() => allIncByHours.value)
  const allIncByWeekdaysRangeData = computed(() => allIncByWeekdays.value)

  return {
    fetchIncDates,
    fetchIncYear,
    fetchIncAnual,
    openIncidentsYear,
    closedIncidentsYear,
    currentIncidentsRange,
    lastYearIncidentsRange,
    allOpenIncidentsGroup,
    allIncidentsGroupData,
    allIncLocationRangeData,
    allIncBasesRange,
    allIncParkingRangeData,
    allIncByHoursRangeData,
    allIncByWeekdaysRangeData,
    totalIncidentsYears,
    allIncByMonths
  }
})
