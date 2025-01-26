<template>
  <section class="container-date-metricts">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
    <div class="item">
      <InfoItem
        title="Open Inc"
        :subtitle="storeIncidents.currentIncidentsRange.open"
        class="item-info"
      >
        <template #right-icon> <BaseBadge :label="getPercentOpen" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Open Avg Day" :subtitle="getAvgDayOpen" class="item-info">
        <template #right-icon> <BaseBadge :label="getAvgPercentDayOpen" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Closed Inc"
        :subtitle="storeIncidents.currentIncidentsRange.close"
        class="item-info"
      >
        <template #right-icon> <BaseBadge :label="getPercentClose" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Closed Avg Day" :subtitle="getAvgDayClose" class="item-info">
        <template #right-icon> <BaseBadge :label="getAvgPercentDayClose" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Pending Inc"
        :subtitle="storeIncidents.currentIncidentsRange.pending"
        class="item-info"
      >
        <template #right-icon> <BaseBadge :label="getPercentPending" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Avg Inc Management" :subtitle="formattedCurrentAvg" class="item-info">
        <template #right-icon> <BaseBadge :label="getPercentAvg" /> </template>
      </InfoItem>
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
        title="Incidents by location "
        :subtitle="getCurrentDate"
      />
    </div>

    <div class="chart-base donnut-bases">
      <DonnutChart
        id="bases"
        :incidents="allIncBasesRange"
        title="Incidents by bases"
        :subtitle="getCurrentDate"
      />
    </div>

    <div class="chart-base donnut-parking">
      <DonnutChart
        id="parking"
        :incidents="allIncParkingRange"
        title="Parking incidents"
        :subtitle="getCurrentDate"
      />
    </div>

    <div class="chart-base line-inc-hours">
      <GradientLine
        title="Incidents by hours"
        :subtitle="getCurrentDate"
        :incidents="allIncByHours"
      />
    </div>

    <div class="chart-base bar-inc-days">
      <BarChart
        title="Incidents by Weekdays"
        :subtitle="getCurrentDate"
        :incidents="allIncByWekdays"
        :options="{ rotate: -45, rotateAlways: true }"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import DateRange from '@/utils/dateRange.js'
import InfoItem from '@/components/InfoItem.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import StakedBar from '@/components/StakedBar.vue'
import ScatterGroup from '@/components/ScatterGroup.vue'
import DonnutChart from '@/components/DonnutChart.vue'
import GradientLine from '@/components/GradientLine.vue'
import BarChart from '@/components/BarChart.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useIncidentsStore } from '@/stores/incidents.js'
import {
  generateDataScatterGroup,
  generateDataStakedBar,
  generateDataDonnut,
  generateDataGradient,
  generateDataBarchart,
} from '@/utils/dataProcessor.js'

const storeIncidents = useIncidentsStore()
const isLoading = ref(false)
const formattedDate = ref(dayjs().format('D MMM YYYY'))

let dateRange = ref('')
let startDateAvg = null
let endDateAvg = null

const emit = defineEmits(['update:currentDate'])

const props = defineProps({
  selectedRange: {
    type: String,
    required: true,
  },
  initYear: {
    type: Number,
    required: true,
  },
})

const getDataStore = async (selectedRange, initYear) => {
  isLoading.value = true
  dateRange.value = DateRange.getDateRange(selectedRange, initYear)
  const startDate = dayjs(dateRange.value.startDate).format('YYYY-MM-DD')
  const endDate = dayjs(dateRange.value.endDate).format('YYYY-MM-DD')
  startDateAvg = startDate
  endDateAvg = endDate
  await storeIncidents.fetchIncDates(startDate, endDate)
  await nextTick()
  isLoading.value = false
}

const getAvgDayClose = computed(() => calculateAvgDay(storeIncidents.currentIncidentsRange.close))
const getAvgDayOpen = computed(() => calculateAvgDay(storeIncidents.currentIncidentsRange.open))
const distributionData = computed(() =>
  generateDataScatterGroup(storeIncidents.allOpenIncidentsGroup),
)
const allIncidentsGroup = computed(() =>
  generateDataStakedBar(storeIncidents.allIncidentsGroupData),
)
const allIncLocationRange = computed(() =>
  generateDataDonnut(storeIncidents.allIncLocationRangeData),
)
const allIncBasesRange = computed(() => generateDataDonnut(storeIncidents.allIncBasesRange))
const allIncParkingRange = computed(() => generateDataDonnut(storeIncidents.allIncParkingRangeData))
const allIncByHours = computed(() => generateDataGradient(storeIncidents.allIncByHoursRangeData))
const allIncByWekdays = computed(() =>
  generateDataBarchart(storeIncidents.allIncByWeekdaysRangeData),
)

const getPercentOpen = computed(() => {
  return calculatePercentage(
    storeIncidents.currentIncidentsRange.open,
    storeIncidents.lastYearIncidentsRange.open,
  )
})

const getAvgPercentDayClose = computed(() => {
  const totalLast = calculateAvgDay(storeIncidents.lastYearIncidentsRange.close)
  return calculatePercentage(getAvgDayClose.value, totalLast)
})

const getAvgPercentDayOpen = computed(() => {
  const totalLast = calculateAvgDay(storeIncidents.lastYearIncidentsRange.open)
  return calculatePercentage(getAvgDayOpen.value, totalLast)
})

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

const getPercentAvg = computed(() => {
  const currentAvgDecimal = storeIncidents.currentIncidentsRange.avg.minute
  const lastYearAvgDecimal = storeIncidents.lastYearIncidentsRange.avg.minute
  return calculatePercentage(currentAvgDecimal, lastYearAvgDecimal)
})

const formattedCurrentAvg = computed(() => {
  // const horas = storeIncidents.currentIncidentsRange.avg.hour || 0
  const minutos = storeIncidents.currentIncidentsRange.avg.minute || 0
  // const totalHorasDecimal = horas + minutos / 60
  return convertirMinutos(minutos)
  // return convertirHoras(totalHorasDecimal)
})

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

watch(
  () => [props.selectedRange, props.initYear],
  ([newValueRange, newValueYear]) => {
    getDataStore(newValueRange, newValueYear)
  },
)

watch(getCurrentDate, (newValue) => {
  emit('update:currentDate', newValue)
})

onMounted(() => {
  getDataStore(props.selectedRange, props.initYear)
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

function convertirMinutos(minutosDecimal) {
  const dias = Math.floor(minutosDecimal / 1440) // 1440 minutos en un día
  const horas = Math.floor((minutosDecimal % 1440) / 60) // 60 minutos en una hora
  const minutos = Math.round(minutosDecimal % 60)
  return `${dias}d ${horas}h ${minutos}m`
}
</script>

<style lang="css" scoped>
.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.item {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/**************************                 container date          ***************************/
.container-date-metricts {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 100px 300px 300px 350px 350px;
  gap: 10px;
}

.distribution-group {
  grid-column: 1 / 3;
  grid-row: 2 / 4;
}

.staked-group {
  grid-column: 3 / 7;
  grid-row: 2 / 3;
}

.line-inc-hours {
  grid-column: 3 / 7;
  grid-row: 3 / 4;
}

.donnut-places {
  grid-column: 1 / 3;
  grid-row: 4 / 5;
}

.donnut-bases {
  grid-column: 3 / 5;
  grid-row: 4 / 5;
}

.donnut-parking {
  grid-column: 5 / 7;
  grid-row: 4 / 5;
}

.bar-inc-days {
  grid-column: 1 / 3;
  grid-row: 5 / 6;
}
</style>
