<template>
  <section class="main-container container-report">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
    <div class="no__item">
      <ComboBox :options="rangeYears" v-model="selectedYear" custom-width="50px" />
    </div>
    <div class="item div__select">
      <ComboBox :options="SELECT_PERIOD" v-model="selectedRange" />
    </div>

    <div class="item item-label-date">{{ getCurrentDate }}</div>

    <div class="item item__title"><p>Incidents</p></div>

    <div class="item">
      <InfoItem
        title="Open Inc"
        :subtitle="storeIncidents.currentIncidentsRange.open"
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
        :subtitle="storeIncidents.currentIncidentsRange.close"
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
        :subtitle="storeIncidents.currentIncidentsRange.pending"
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

    <div class="chart-base heatmap-open">
      <HeatMap
        id="heatmap-open"
        title="Open incidents by day"
        :subtitle="selectedYear"
        :colors="['#c8eac8', '#98d498', '#6cbc6c', '#43a543', '#1f8c1f', '#166816']"
        :incidents="heatmapOpenInc"
      />
    </div>

    <div class="chart-base heatmap-close">
      <HeatMap
        id="heatmap-close"
        title="Closed incidents by day"
        :subtitle="selectedYear"
        :colors="['#f9cfcf', '#f4a8a8', '#ee7e7e', '#e65454', '#d82d2d', '#b71a1a']"
        :incidents="heatmapCloseInc"
      />
    </div>

    <div class="chart-base distribution-group">
      <ScatterGroup :all-incidents="distributionData" />
    </div>

    <div class="chart-base staked-group">
      <StakedBar :all-incidents-group="allIncidentsGroup" :subtitle="getCurrentDate" />
    </div>

    <div class="chart-base donnut-places">
      <DonnutChart
        id="location"
        :incidents="allIncLocationRange"
        title="Incident by place"
        :subtitle="getCurrentDate"
        :labels="LOCATION"
      />
    </div>

    <div class="chart-base donnut-bases">
      <DonnutChart
        id="bases"
        :incidents="allIncBasesRange"
        title="Incident bases"
        :subtitle="getCurrentDate"
        :labels="BASES"
      />
    </div>

    <div class="chart-base histogram-open">
      <AreaChart
        id="open-area"
        title="Open incidents by month"
        :subtitle="selectedYear"
        color="#98d498"
        :incidents="heatmapOpenInc"
      />
    </div>

    <div class="chart-base histogram-close">
      <AreaChart
        id="close-area"
        title="Close incidents by month"
        :subtitle="selectedYear"
        color="#f4a8a8"
        :incidents="heatmapCloseInc"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import { SELECT_PERIOD, LOCATION, BASES } from '@/constants/constants'
import InfoItem from '@/components/InfoItem.vue'
import Badge from '@/components/Badge.vue'
import ComboBox from '@/components/ComboBox.vue'
import DateRange from '@/utils/dateRange.js'
import { useIncidentsStore } from '@/stores/incidents.js'
import HeatMap from '@/components/HeatMap.vue'
import StakedBar from '@/components/StakedBar.vue'
import ScatterGroup from '@/components/ScatterGroup.vue'
import AreaChart from '@/components/AreaChart.vue'
import DonnutChart from '@/components/DonnutChart.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const storeIncidents = useIncidentsStore()
const selectedRange = ref(dayjs().format('DD MMM YYYY'))
const selectedYear = ref(dayjs().year())
const formattedDate = ref(dayjs().format('D MMM YYYY'))
let dateRange = ref('')
const isLoading = ref(false)

let startDateAvg = null
let endDateAvg = null

const rangeYears = computed(() => {
  let years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
  years.push(dayjs().year())
  return years
})

const getDataStore = async () => {
  isLoading.value = true
  dateRange.value = DateRange.getDateRange(selectedRange.value, selectedYear.value)
  const startDate = dayjs(dateRange.value.startDate).format('YYYY-MM-DD')
  const endDate = dayjs(dateRange.value.endDate).format('YYYY-MM-DD')
  startDateAvg = startDate
  endDateAvg = endDate
  await storeIncidents.fetchData(startDate, endDate, selectedYear.value)
  await nextTick()
  isLoading.value = false
}

watch([selectedRange, selectedYear], getDataStore)
onMounted(async () => {
  getDataStore()
})

const heatmapOpenInc = computed(() => storeIncidents.openIncidentsYear)
const heatmapCloseInc = computed(() => storeIncidents.closedIncidentsYear)
const distributionData = computed(() => storeIncidents.allOpenIncidentsGroup)
const allIncidentsGroup = computed(() => storeIncidents.allIncidentsGroupData)
const allIncLocationRange = computed(() => storeIncidents.allIncLocationRangeData)
const allIncBasesRange = computed(() => storeIncidents.allIncBasesRange)

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
    storeIncidents.currentIncidentsRange.open,
    storeIncidents.lastYearIncidentsRange.open,
  )
})

const getAvgDayOpen = computed(() => calculateAvgDay(storeIncidents.currentIncidentsRange.open))
const getAvgDayClose = computed(() => calculateAvgDay(storeIncidents.currentIncidentsRange.close))

const getAvgPercentDayOpen = computed(() => {
  const totalLast = calculateAvgDay(storeIncidents.lastYearIncidentsRange.open)
  return calculatePercentage(getAvgDayOpen.value, totalLast)
})

const getAvgPercentDayClose = computed(() => {
  const totalLast = calculateAvgDay(storeIncidents.lastYearIncidentsRange.close)
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
    storeIncidents.currentIncidentsRange.close,
    storeIncidents.lastYearIncidentsRange.close,
  )
})

const getPercentPending = computed(() => {
  return calculatePercentage(
    storeIncidents.currentIncidentsRange.pending,
    storeIncidents.lastYearIncidentsRange.pending,
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
  const horas = storeIncidents.currentIncidentsRange.avg.hour || 0
  const minutos = storeIncidents.currentIncidentsRange.avg.minute || 0
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
    storeIncidents.currentIncidentsRange.avg.hour +
    storeIncidents.currentIncidentsRange.avg.minute / 60
  const lastYearAvgDecimal =
    storeIncidents.lastYearIncidentsRange.avg.hour +
    storeIncidents.lastYearIncidentsRange.avg.minute / 60
  return calculatePercentage(currentAvgDecimal, lastYearAvgDecimal)
})
</script>

<style scoped>
.container-report {
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 30px 30px 100px 450px 300px 300px 300px 300px 300px;
  gap: 10px;
}

.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.heatmap-open {
  grid-column: 1 / 4;
}

.heatmap-close {
  grid-column: 4 / 7;
}

.distribution-group {
  grid-column: 1 / 3;
  grid-row: 5 / 7;
}

.staked-group {
  grid-column: 3 / 7;
  grid-row: 5 / 6;
}

.histogram-open {
  grid-column: 1 / 4;
  grid-row: 7 / 8;
}

.histogram-close {
  grid-column: 4 / 7;
  grid-row: 7 / 8;
}

.donnut-places {
  grid-column: 3 / 5;
  grid-row: 6 / 7;
}

.donnut-bases {
  grid-column: 5 / 7;
  grid-row: 6 / 7;
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
