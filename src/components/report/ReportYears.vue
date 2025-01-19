<template>
  <section class="container-years-metricts">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <div class="chart-base table-total-years">
      <TableChart title="Sumary of incidents by year" :data-column="columns" :data-row="rows" />
    </div>

    <div class="chart-base barchart-total-years">
      <BarChart title="Total incidents Years" :categories="yearsArray" :options="{rotate: 0}" />
    </div>

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
        :incidents="openInitYear"
      />
    </div>

    <div class="chart-base histogram-close-end">
      <AreaChart
        id="close-area"
        title="Close incidents by month"
        :subtitle="endYear"
        color="#f4a8a8"
        :incidents="openEndYear"
      />
    </div>
  </section>
</template>

<script setup>
import HeatMap from '@/components/HeatMap.vue'
import AreaChart from '@/components/AreaChart.vue'
import TableChart from '@/components/TableChart.vue'
import BarChart from '@/components/BarChart.vue'
import { useIncidentsStore } from '@/stores/incidents.js'
import { watch, ref, nextTick, onMounted } from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const columns = ['Years', 'Incidents', 'Tase', 'Percentage']
const rows = [
  {
    year: 2021,
    inc: 14566,
    tase: `+${125}`,
    per: `+${12}%`
  },
  {
    year: 2022,
    inc: 12566,
    tase: `+${125}`,
    per: `+${12}%`
  },
  {
    year: 2023,
    inc: 11566,
    tase: `+${125}`,
    per: `+${12}%`
  },
  {
    year: 2024,
    inc: 10566,
    tase: `+${125}`,
    per: `+${12}%`
  },
]

const storeIncidents = useIncidentsStore()
const isLoading = ref(false)

const openInitYear = ref([])
const closeInitYear = ref([])
const openEndYear = ref([])
const closeEndYear = ref([])
const totalIncYears = ref([])
const yearsArray = ref([])

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

onMounted(() => {
  getYearsArray()
})

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

  totalIncYears.value = storeIncidents.totalIncidentsYears
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

onMounted(() => {
  setDataForYear(props.initYear, 'init')
  setDataForYear(props.endYear, 'end')
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
  grid-template-rows: 350px 400px 400px 300px 300px;
  gap: 10px;
}

.table-total-years {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.barchart-total-years {
  grid-column: 3 / 7;
  grid-row: 1 / 2;
}

.heatmap-open-init {
  grid-column: 1 / 4;
  grid-row: 2 / 3;
}

.heatmap-open-end {
  grid-column: 4 / 7;
  grid-row: 2 / 3;
}

.heatmap-close-init {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
}

.heatmap-close-end {
  grid-column: 4 / 7;
  grid-row: 3 / 4;
}

.histogram-open-init {
  grid-column: 1 / 4;
  grid-row: 4 / 5;
}

.histogram-open-end {
  grid-column: 4 / 7;
  grid-row: 4 / 5;
}

.histogram-close-init {
  grid-column: 1 / 4;
  grid-row: 5 / 6;
}

.histogram-close-end {
  grid-column: 4 / 7;
  grid-row: 5 / 6;
}
</style>
