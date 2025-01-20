<template>
  <section class="container-years-metricts">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <!-- <div class="chart-base table-total-years">
      <TableChart
        title="Sumary of incidents by year"
        :data-column="columns"
        :data-row="rowsTableYears"
      />
    </div>

    <div class="chart-base donnut-total-years">
      <DonnutChart
        id="totalYears"
        :incidents="totalIncYears"
        title="Total incidents by years"
        :options="{ colors: COLORS1 }"
      />
    </div>

    <div class="chart-base barchart-total-years">
      <BarChart
        title="Total incidents Years"
        :categories="yearsArray"
        :incidents="totalIncYears"
        :options="{ rotate: -45, rotateAlways: true }"
      />
    </div> -->

    <div class="chart-base heatmap-open-init">
      <HeatMap
        id="heatmap-open"
        title="Open incidents by day"
        :subtitle="initYear"
        :colors="['#c8eac8', '#98d498', '#6cbc6c', '#43a543', '#1f8c1f', '#166816']"
        :incidents="openInitYear"
      />
    </div>

    <div class="chart-base heatmap-open-end">
      <HeatMap
        id="heatmap-open"
        title="Open incidents by day"
        :subtitle="endYear"
        :colors="['#c8eac8', '#98d498', '#6cbc6c', '#43a543', '#1f8c1f', '#166816']"
        :incidents="openEndYear"
      />
    </div>

    <div class="chart-base heatmap-close-init">
      <HeatMap
        id="heatmap-close"
        title="Closed incidents by day"
        :subtitle="initYear"
        :colors="['#f9cfcf', '#f4a8a8', '#ee7e7e', '#e65454', '#d82d2d', '#b71a1a']"
        :incidents="closeInitYear"
      />
    </div>

    <div class="chart-base heatmap-close-end">
      <HeatMap
        id="heatmap-close"
        title="Closed incidents by day"
        :subtitle="endYear"
        :colors="['#f9cfcf', '#f4a8a8', '#ee7e7e', '#e65454', '#d82d2d', '#b71a1a']"
        :incidents="closeEndYear"
      />
    </div>

    <div class="chart-base histogram-open-init">
      <AreaChart
        id="open-area"
        title="Open incidents by month"
        :subtitle="initYear"
        color="#98d498"
        :incidents="openInitYear"
      />
    </div>

    <div class="chart-base histogram-open-end">
      <AreaChart
        id="open-area"
        title="Open incidents by month"
        :subtitle="endYear"
        color="#98d498"
        :incidents="openEndYear"
      />
    </div>

    <div class="chart-base histogram-close-init">
      <AreaChart
        id="close-area"
        title="Close incidents by month"
        :subtitle="initYear"
        color="#f4a8a8"
        :incidents="closeInitYear"
      />
    </div>

    <div class="chart-base histogram-close-end">
      <AreaChart
        id="close-area"
        title="Close incidents by month"
        :subtitle="endYear"
        color="#f4a8a8"
        :incidents="closeEndYear"
      />
    </div>
  </section>
</template>

<script setup>
import HeatMap from '@/components/HeatMap.vue'
import AreaChart from '@/components/AreaChart.vue'
// import TableChart from '@/components/TableChart.vue'
// import BarChart from '@/components/BarChart.vue'
// import DonnutChart from '@/components/DonnutChart.vue'
import { useIncidentsStore } from '@/stores/incidents.js'
import { watch, ref, nextTick, onMounted } from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
// import { getRowsTableYears } from '@/utils/dataProcessor'
// import { COLORS1, COLORS2 } from '@/constants/constants.js'
// const columns = ['Years', 'Incidents', 'Tase', 'Percentage']

const storeIncidents = useIncidentsStore()
const isLoading = ref(false)

const openInitYear = ref([])
const closeInitYear = ref([])
const openEndYear = ref([])
const closeEndYear = ref([])
const yearsArray = ref([])
// const rowsTableYears = ref([])
// const totalIncYears = ref([])

const props = defineProps({
  initYear: {
    type: Number,
    required: true,
  },
  endYear: {
    type: Number,
    required: true,
  },
})

const getYearsArray = () => {
  const currentYear = new Date().getFullYear()
  for (let year = 2015; year < currentYear; year++) {
    yearsArray.value.push(year)
  }
}

const setDataForYear = async (year, target) => {
  isLoading.value = true
  await storeIncidents.fetchIncidentsByYear(year)

  if (target === 'init') {
    openInitYear.value = [...storeIncidents.openIncidentsYear]
    closeInitYear.value = [...storeIncidents.closedIncidentsYear]
  } else if (target === 'end') {
    openEndYear.value = [...storeIncidents.openIncidentsYear]
    closeEndYear.value = [...storeIncidents.closedIncidentsYear]
  }
  // totalIncYears.value = storeIncidents.totalIncidentsYears
  // rowsTableYears.value = getRowsTableYears(storeIncidents.totalIncidentsYears)
  await nextTick()
  isLoading.value = false
}

watch(
  () => props.initYear,
  (newValue) => {
    setDataForYear(newValue, 'init')
  },
)

watch(
  () => props.endYear,
  (newValue) => {
    setDataForYear(newValue, 'end')
  },
)

onMounted(async () => {
  getYearsArray()
  await setDataForYear(props.initYear, 'init')
  await setDataForYear(props.endYear, 'end')
})
</script>

<style lang="css" scoped>
.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

/**************************                 container years          ***************************/
.container-years-metricts {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 400px 400px 300px 300px 300px;
  gap: 10px;
}

/* .table-total-years {
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
} */

.heatmap-open-init {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}

.heatmap-open-end {
  grid-column: 4 / 7;
  grid-row: 1 / 2;
}

.heatmap-close-init {
  grid-column: 1 / 4;
  grid-row: 2 / 3;
}

.heatmap-close-end {
  grid-column: 4 / 7;
  grid-row: 2 / 3;
}

.histogram-open-init {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
}

.histogram-open-end {
  grid-column: 4 / 7;
  grid-row: 3 / 4;
}

.histogram-close-init {
  grid-column: 1 / 4;
  grid-row: 4 / 5;
}

.histogram-close-end {
  grid-column: 4 / 7;
  grid-row: 4 / 5;
}
</style>
