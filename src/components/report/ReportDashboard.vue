<template>
  <section class="container-report-dashboard">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <div class="chart-base table-total-years">
      <TableChart
        title="Sumary of incidents by year"
        :data-column="columns"
        :data-row="rowsTableYears"
      />
    </div>

    <div class="chart-base donnut-total-years">
      <DonnutChart
        id="totalYears"
        :incidents="totalIncYearsDonut"
        title="Total incidents by years"
        :options="{ colors: COLORS1 }"
      />
    </div>

    <div class="chart-base barchart-total-years">
      <BarChart
        title="Total incidents Years"
        :categories="yearsArray"
        :incidents="totalIncYearBarchart"
        :options="{ rotate: -45, rotateAlways: true }"
      />
    </div>

    <div class="chart-base table-years-months">
      <TableChart
        title="Summary total months in years"
        :first-column="monthNames"
        :data-column="yearsArray"
        :data-row="totalBymonths"
      />
    </div>

    <div class="chart-base donut-avg-months">
      <DonnutChart
        id="AvgByMonths"
        title="Average incidents by months"
        :incidents="avgByMonths"
        :options="{ colors: COLORS1 }"
      />
    </div>
  </section>
</template>

<script setup>
import TableChart from '@/components/TableChart.vue'
import BarChart from '@/components/BarChart.vue'
import DonnutChart from '@/components/DonnutChart.vue'
import { useIncidentsStore } from '@/stores/incidents.js'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import { COLORS1, COLORS2 } from '@/constants/constants.js'
import {
  getRowsTableYears,
  getRowsTableByMonths,
  getAvgByMonths,
  generateDataDonnut,
  generateDataBarchart,
} from '@/utils/dataProcessor'
import dayjs from 'dayjs'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const columns = ['Years', 'Incidents', 'Tase', 'Percentage']
const storeIncidents = useIncidentsStore()
const isLoading = ref(false)
const yearsArray = ref([])

const getYearsArray = () => {
  const currentYear = new Date().getFullYear()
  for (let year = 2015; year < currentYear; year++) {
    yearsArray.value.push(year)
  }
}

const totalIncYearsDonut = computed(() => generateDataDonnut(storeIncidents.totalIncidentsYears))
const totalIncYearBarchart = computed(() =>
  generateDataBarchart(storeIncidents.totalIncidentsYears),
)
const rowsTableYears = computed(() => getRowsTableYears(storeIncidents.totalIncidentsYears))
const totalBymonths = computed(() => getRowsTableByMonths(storeIncidents.allIncByMonths))
const avgByMonths = computed(() => getAvgByMonths(storeIncidents.allIncByMonths))

const setDataForYear = async (year) => {
  isLoading.value = true
  await storeIncidents.fetchIncAnual(year)
  await nextTick()
  isLoading.value = false
}

onMounted(() => {
  getYearsArray()
  const initYear = dayjs().subtract(1, 'year').year()
  setDataForYear(initYear, 'init')
})
</script>

<style lang="css" scoped>
.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

/**************************                 container dashboard          ***************************/
.container-report-dashboard {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: auto auto;
  gap: 10px;
}

.table-total-years {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.barchart-total-years {
  grid-column: 3 / 5;
  grid-row: 1 / 2;
}

.donnut-total-years {
  grid-column: 5 / 7;
  grid-row: 1 / 2;
}

.table-years-months {
  grid-column: 1 / 5;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
}

.donut-avg-months {
  grid-column: 5 / 7;
  grid-row: 2 / 3;
}
</style>
