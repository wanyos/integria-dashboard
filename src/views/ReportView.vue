<template>
  <section class="main-container container-report">
    <div class="item div__select">
      <v-icon name="bi-calendar2-check" class="icon-calendar" />
      <ComboBox :options="optCombo" v-model="selectedValue" />
    </div>
    <div class="item item-label-date">{{ getCurrentDate }}</div>
    <div class="item"><p>Incidents</p></div>

    <div class="item">
      <InfoItem
        title="Open Incidents"
        :subtitle="storeIncidents.totalIncidents.current.open"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentOpen" name="success" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Closed Incidents"
        :subtitle="storeIncidents.totalIncidents.current.close"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentClose" name="error" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Pending Incidents"
        :subtitle="storeIncidents.totalIncidents.current.pending"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentPending" name="success" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem
        title="Average Incident Management"
        :subtitle="formattedCurrentAvg"
        class="item-info"
      >
        <template #right-icon> <Badge :label="getPercentAvg" name="success" /> </template>
      </InfoItem>
    </div>

    <template>
      <div>
        <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import InfoItem from '@/components/InfoItem.vue'
import Badge from '@/components/Badge.vue'
import ComboBox from '@/components/ComboBox.vue'
import DateRange from '@/utils/dateRange.js'
import { useIncidentsStore } from '@/stores/incidents.js'

const chartOptions = ref({
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        series: [
        {
          name: "series-1",
          data: [30, 40, 35, 50, 49, 60, 70, 91],
        },
      ],
      })

const storeIncidents = useIncidentsStore()

const selectedValue = ref('')
const optCombo = [
  'Yesterday',
  'This Week',
  'Last Week',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'This Year',
]

const formattedDate = ref(dayjs().format('D MMM YYYY'))
let dateRange = ref('')

watch(selectedValue, async (newValue) => {
  dateRange.value = DateRange.getDateRange(newValue)
  const startDate = dayjs(dateRange.value.startDate).format('YYYY-MM-DD')
  const endDate = dayjs(dateRange.value.endDate).format('YYYY-MM-DD')
  await storeIncidents.fetchData(startDate, endDate)
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

const getPercentOpen = computed(() => {
  // console.log('Open Current:', storeIncidents.totalIncidents.current.open)
  // console.log('Open Last Year:', storeIncidents.totalIncidents.lastYear.open)
  return calculatePercentage(
    storeIncidents.totalIncidents.current.open,
    storeIncidents.totalIncidents.lastYear.open,
  )
})

const getPercentClose = computed(() => {
  // console.log('Open Current:', storeIncidents.totalIncidents.current.close)
  // console.log('Open Last Year:', storeIncidents.totalIncidents.lastYear.close)
  return calculatePercentage(
    storeIncidents.totalIncidents.current.close,
    storeIncidents.totalIncidents.lastYear.close,
  )
})

const getPercentPending = computed(() => {
  // console.log('Open Current:', storeIncidents.totalIncidents.current.pending)
  // console.log('Open Last Year:', storeIncidents.totalIncidents.lastYear.pending)
  return calculatePercentage(
    storeIncidents.totalIncidents.current.pending,
    storeIncidents.totalIncidents.lastYear.pending,
  )
})

const calculatePercentage = (current, lastYear) => {
  if(current === 0 || lastYear === 0){
    return '0%'
  }
  const percentage = ((current - lastYear) / lastYear) * 100
  const formattedPercentage = parseFloat(percentage.toFixed(2))
  const sign = formattedPercentage > 0 ? '+' : formattedPercentage < 0 ? '-' : ''
  return `${sign}${Math.abs(formattedPercentage)}%`
}


const formattedCurrentAvg = computed(() => {
      const horas = storeIncidents.totalIncidents.current.avg.hour || 0;
      const minutos = storeIncidents.totalIncidents.current.avg.minute || 0;
      const totalHorasDecimal = horas + minutos / 60;
      return convertirHoras(totalHorasDecimal);
    });


function convertirHoras(horasDecimal) {
    const dias = Math.floor(horasDecimal / 24);
    const horas = Math.floor(horasDecimal % 24);
    const minutos = Math.round((horasDecimal % 1) * 60);
    return `${dias}d ${horas}h ${minutos}m`;
}


const getPercentAvg = computed(() => {
      const currentAvgDecimal = storeIncidents.totalIncidents.current.avg.hour +
                                storeIncidents.totalIncidents.current.avg.minute / 60;
      const lastYearAvgDecimal = storeIncidents.totalIncidents.lastYear.avg.hour +
                                 storeIncidents.totalIncidents.lastYear.avg.minute / 60;
      return calculatePercentage(currentAvgDecimal, lastYearAvgDecimal);
    });
</script>

<style scoped>
.container-report {
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 40px 30px 100px;
  gap: 10px;
}

.item {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-label-date {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.container-report > :nth-child(1) {
  align-self: center;
  justify-self: center;
}

/* .container-report > :nth-child(1) > select {
  border-radius: 5px;
  padding: 6px 20px;
  border: none;
  outline: none;
  font-size: 16px;
  cursor: pointer;
} */

.container-report > :nth-child(3) {
  grid-column: 1/-1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-report > :nth-child(4) {
  grid-column: 1 / 2;
}

.div__select {
  position: relative;
}

.icon-calendar {
  margin-left: 15px;
}

@media (width < 1150px) {
  .container-report {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
}
</style>
