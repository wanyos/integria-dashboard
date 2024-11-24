<template>
  <section class="main-container container-report">
    <div class="no__item">
      <ComboBox :options="rangeYears" v-model="selectedYear" custom-width="50px" />
    </div>
    <div class="item div__select">
      <ComboBox :options="optCombo" v-model="selectedRange" />
    </div>

    <div class="item item-label-date">{{ getCurrentDate }}</div>

    <div class="item item__title"><p>Incidents</p></div>

    <div class="item">
      <InfoItem
        title="Open Inc"
        :subtitle="storeIncidents.incidentsRange.current.open"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentOpen" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Open Avg Day" :subtitle="getAvgDayOpen" class="item-info">
        <template #right-icon> <Badge :label="getAvgPercentDayOpen" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Closed Inc"
        :subtitle="storeIncidents.incidentsRange.current.close"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentClose" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Closed Avg Day" :subtitle="getAvgDayClose" class="item-info">
        <template #right-icon> <Badge :label="getAvgPercentDayClose" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Pending Inc"
        :subtitle="storeIncidents.incidentsRange.current.pending"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentPending" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Avg Inc Management" :subtitle="formattedCurrentAvg" class="item-info">
        <template #right-icon> <Badge :label="getPercentAvg" /> </template>
      </InfoItem>
    </div>

    <HeatMap
      title="Open incidents by day"
      :subtitle="selectedYear"
      :colors="['#c8eac8', '#98d498', '#6cbc6c', '#43a543', '#1f8c1f', '#166816']"
      :incidents="heatmapOpenInc"
      class="heatmap-open"
    />

    <HeatMap
      title="Closed incidents by day"
      :subtitle="selectedYear"
      :colors="['#f9cfcf', '#f4a8a8', '#ee7e7e', '#e65454', '#d82d2d', '#b71a1a']"
      :incidents="heatmapCloseInc"
      class="heatmap-close"
    />

    <Distribution class="item distribution" />

    <!-- <div class="item pa">
      <p>bar chart</p>
    </div> -->
  </section>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import InfoItem from '@/components/InfoItem.vue'
import Badge from '@/components/Badge.vue'
import ComboBox from '@/components/ComboBox.vue'
import DateRange from '@/utils/dateRange.js'
import { useIncidentsStore } from '@/stores/incidents.js'
import HeatMap from '@/components/HeatMap.vue'
import Distribution from '@/components/Distribution.vue'

const storeIncidents = useIncidentsStore()
const selectedRange = ref(dayjs().format('DD MMM YYYY'))
const selectedYear = ref(dayjs().year())
const formattedDate = ref(dayjs().format('D MMM YYYY'))
let dateRange = ref('')

let startDateAvg = null
let endDateAvg = null

const optCombo = [
  'Yesterday',
  'This Week',
  'Last Week',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'This Year',
]

const rangeYears = computed(() => {
  let years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
  years.push(dayjs().year())
  return years
})

const getDataStore = async () => {
  dateRange.value = DateRange.getDateRange(selectedRange.value, selectedYear.value)
  const startDate = dayjs(dateRange.value.startDate).format('YYYY-MM-DD')
  const endDate = dayjs(dateRange.value.endDate).format('YYYY-MM-DD')
  startDateAvg = startDate
  endDateAvg = endDate
  await storeIncidents.fetchData(startDate, endDate, selectedYear.value)
}

watch([selectedRange, selectedYear], getDataStore)
onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: true })
  getDataStore()
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel)
})

function handleWheel(event) {
  // Handle the wheel event
}

const heatmapOpenInc = computed(() => storeIncidents.allIncidentsYear.openInc)
const heatmapCloseInc = computed(() => storeIncidents.allIncidentsYear.closeInc)

// label date select
const getCurrentDate = computed(() => {
  if (!dateRange.value) return formattedDate.value
  const { startDate, endDate } = dateRange.value
  if (startDate && endDate && startDate.isSame(endDate, 'day')) {
    return dayjs(startDate).format('D MMM YYYY')
  }
  const formattedStartDate = startDate ? dayjs(startDate).format('D MMM YYYY') : ''
  const formattedEndDate = endDate ? dayjs(endDate).format('D MMM YYYY') : ''
  return `${formattedStartDate} - ${formattedEndDate}`
})

const getPercentOpen = computed(() => {
  return calculatePercentage(
    storeIncidents.incidentsRange.current.open,
    storeIncidents.incidentsRange.lastYear.open,
  )
})

const getAvgDayOpen = computed(() => calculateAvgDay(storeIncidents.incidentsRange.current.open))
const getAvgDayClose = computed(() => calculateAvgDay(storeIncidents.incidentsRange.current.close))

const getAvgPercentDayOpen = computed(() => {
  const totalLast = calculateAvgDay(storeIncidents.incidentsRange.lastYear.open)
  return calculatePercentage(getAvgDayOpen.value, totalLast)
})

const getAvgPercentDayClose = computed(() => {
  const totalLast = calculateAvgDay(storeIncidents.incidentsRange.lastYear.close)
  return calculatePercentage(getAvgDayClose.value, totalLast)
})

// calculate avg days this dates and last year date
const calculateAvgDay = (totalInc) => {
  let formateResult = 0
  const start = dayjs(startDateAvg)
  const end = dayjs(endDateAvg)
  const totalDays = end.diff(start, 'day') + 1
  if (totalDays <= 0 || totalInc === 0) {
    return 0
  }
  const result = totalInc / totalDays
  formateResult = parseFloat(result.toFixed(2))
  return formateResult
}

const getPercentClose = computed(() => {
  return calculatePercentage(
    storeIncidents.incidentsRange.current.close,
    storeIncidents.incidentsRange.lastYear.close,
  )
})

const getPercentPending = computed(() => {
  return calculatePercentage(
    storeIncidents.incidentsRange.current.pending,
    storeIncidents.incidentsRange.lastYear.pending,
  )
})

const calculatePercentage = (current, lastYear) => {
  if (current === 0 || lastYear === 0) {
    return '0%'
  }
  const percentage = ((current - lastYear) / lastYear) * 100
  const formattedPercentage = parseFloat(percentage.toFixed(2))
  const sign = formattedPercentage > 0 ? '+' : formattedPercentage < 0 ? '-' : ''
  return `${sign}${Math.abs(formattedPercentage)}%`
}

const formattedCurrentAvg = computed(() => {
  const horas = storeIncidents.incidentsRange.current.avg.hour || 0
  const minutos = storeIncidents.incidentsRange.current.avg.minute || 0
  const totalHorasDecimal = horas + minutos / 60
  return convertirHoras(totalHorasDecimal)
})

// return string with day:hours:minutes
function convertirHoras(horasDecimal) {
  const dias = Math.floor(horasDecimal / 24)
  const horas = Math.floor(horasDecimal % 24)
  const minutos = Math.round((horasDecimal % 1) * 60)
  return `${dias}d ${horas}h ${minutos}m`
}

const getPercentAvg = computed(() => {
  const currentAvgDecimal =
    storeIncidents.incidentsRange.current.avg.hour +
    storeIncidents.incidentsRange.current.avg.minute / 60
  const lastYearAvgDecimal =
    storeIncidents.incidentsRange.lastYear.avg.hour +
    storeIncidents.incidentsRange.lastYear.avg.minute / 60
  return calculatePercentage(currentAvgDecimal, lastYearAvgDecimal)
})
</script>

<style scoped>
.container-report {
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 30px 30px 100px 450px 450px;
  gap: 10px;
}

.heatmap-open {
  grid-column: 1 / 4;
}

.heatmap-close {
  grid-column: 4 / 7;
}

.distribution {
  grid-column: 1 / 5;
}

.item {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no__item {
  display: flex;
  justify-content: end;
}

.item-label-date {
  grid-column: 3 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.div__select {
  grid-column: 2 / 3;
}

.item__title {
  grid-column: 1 / -1;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* @media (width < 1150px) {
  .container-report {
    grid-template-columns: repeat(3, minmax(150px, 1fr));
  }
}

@media (width < 900px) {
  .container-report {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
}

@media (width < 600px) {
  .container-report {
    grid-template-columns: repeat(1, minmax(150px, 1fr));
  }
} */
</style>
