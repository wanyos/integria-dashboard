<template>
  <section class="container-years-metricts">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
    <div class="chart-base heatmap-open-init">
      <HeatMap
        id="heatmap-open"
        title="Open incidents by day"
        :subtitle="initYear"
        :colors="['#c8eac8', '#98d498', '#6cbc6c', '#43a543', '#1f8c1f', '#166816']"
        :incidents="openInitYearHeat"
      />
    </div>

    <div class="chart-base heatmap-open-end">
      <HeatMap
        id="heatmap-open"
        title="Open incidents by day"
        :subtitle="endYear"
        :colors="['#c8eac8', '#98d498', '#6cbc6c', '#43a543', '#1f8c1f', '#166816']"
        :incidents="openEndYearHeat"
      />
    </div>

    <div class="chart-base heatmap-close-init">
      <HeatMap
        id="heatmap-close"
        title="Closed incidents by day"
        :subtitle="initYear"
        :colors="['#f9cfcf', '#f4a8a8', '#ee7e7e', '#e65454', '#d82d2d', '#b71a1a']"
        :incidents="closeInitYearHeat"
      />
    </div>

    <div class="chart-base heatmap-close-end">
      <HeatMap
        id="heatmap-close"
        title="Closed incidents by day"
        :subtitle="endYear"
        :colors="['#f9cfcf', '#f4a8a8', '#ee7e7e', '#e65454', '#d82d2d', '#b71a1a']"
        :incidents="closeEndYearHeat"
      />
    </div>

    <div class="chart-base histogram-open-init">
      <AreaChart
        id="open-area"
        title="Open incidents by month"
        :subtitle="initYear"
        color="#98d498"
        :incidents="openInitYearArea"
      />
    </div>

    <div class="chart-base histogram-open-end">
      <AreaChart
        id="open-area"
        title="Open incidents by month"
        :subtitle="endYear"
        color="#98d498"
        :incidents="openEndYearArea"
      />
    </div>

    <div class="chart-base histogram-close-init">
      <AreaChart
        id="close-area"
        title="Close incidents by month"
        :subtitle="initYear"
        color="#f4a8a8"
        :incidents="closeInitYearArea"
      />
    </div>

    <div class="chart-base histogram-close-end">
      <AreaChart
        id="close-area"
        title="Close incidents by month"
        :subtitle="endYear"
        color="#f4a8a8"
        :incidents="closeEndYearArea"
      />
    </div>
  </section>
</template>

<script setup>
import HeatMap from '@/components/HeatMap.vue'
import AreaChart from '@/components/AreaChart.vue'
import { useIncidentsStore } from '@/stores/incidents.js'
import { watch, ref, nextTick, onMounted, computed } from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { generateHeatmapData, generateAreapData } from '@/utils/dataProcessor'

const storeIncidents = useIncidentsStore()
const isLoadingInit = ref(false)
const isLoadingEnd = ref(false)
const isLoading = computed(() => isLoadingInit.value || isLoadingEnd.value)

const openInitYearHeat = ref([])
const closeInitYearHeat = ref([])
const openInitYearArea = ref([])
const closeInitYearArea = ref([])

const openEndYearHeat = ref([])
const closeEndYearHeat = ref([])
const openEndYearArea = ref([])
const closeEndYearArea = ref([])

// Computed properties para los datos transformados
// const openInitYearHeatData = computed(() => generateHeatmapData(openInitYearHeat.value))
// const closeInitYearHeatData = computed(() => generateHeatmapData(closeInitYearHeat.value))
// const openInitYearAreaData = computed(() => generateAreapData(openInitYearArea.value))
// const closeInitYearAreaData = computed(() => generateAreapData(closeInitYearArea.value))

// const openEndYearHeatData = computed(() => generateHeatmapData(openEndYearHeat.value))
// const closeEndYearHeatData = computed(() => generateHeatmapData(closeEndYearHeat.value))
// const openEndYearAreaData = computed(() => generateAreapData(openEndYearArea.value))
// const closeEndYearAreaData = computed(() => generateAreapData(closeEndYearArea.value))

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

const setDataInitYear = async (year) => {
  isLoadingInit.value = true
  await storeIncidents.fetchIncYear(year)
  openInitYearHeat.value = generateHeatmapData(storeIncidents.openIncidentsYear)
  closeInitYearHeat.value = generateHeatmapData(storeIncidents.closedIncidentsYear)
  openInitYearArea.value = generateAreapData(storeIncidents.openIncidentsYear)
  closeInitYearArea.value = generateAreapData(storeIncidents.closedIncidentsYear)
  await nextTick()
  isLoadingInit.value = false
}

const setDataEndYear = async (year) => {
  isLoadingEnd.value = true
  await storeIncidents.fetchIncYear(year)
  openEndYearHeat.value = generateHeatmapData(storeIncidents.openIncidentsYear)
  closeEndYearHeat.value = generateHeatmapData(storeIncidents.closedIncidentsYear)
  openEndYearArea.value = generateAreapData(storeIncidents.openIncidentsYear)
  closeEndYearArea.value = generateAreapData(storeIncidents.closedIncidentsYear)
  await nextTick()
  isLoadingEnd.value = false
}

// const setDataForYear = async (year, target) => {
//   isLoadingEnd.value = true
//   await storeIncidents.fetchIncYear(year)

//   const mappings = {
//     init: {
//       openHeat: openInitYearHeat,
//       closeHeat: closeInitYearHeat,
//       openArea: openInitYearArea,
//       closeArea: closeInitYearArea,
//     },
//     end: {
//       openHeat: openEndYearHeat,
//       closeHeat: closeEndYearHeat,
//       openArea: openEndYearArea,
//       closeArea: closeEndYearArea,
//     },
//   }

//   const currentMapping = mappings[target]
//   if (!currentMapping) {
//     console.error(`Invalid target: ${target}`)
//     isLoadingEnd.value = false
//     return
//   }

//   currentMapping.openHeat.value = storeIncidents.openIncidentsYear
//   currentMapping.closeHeat.value = storeIncidents.closedIncidentsYear
//   currentMapping.openArea.value = storeIncidents.openIncidentsYear
//   currentMapping.closeArea.value = storeIncidents.closedIncidentsYear

//   isLoadingEnd.value = false
// }

// const setDataForYear = async (year, target) => {
//   isLoading.value = true // Activar el spinner

//   // 1. Cargar los datos de la store
//   await storeIncidents.fetchIncYear(year)

//   // 2. Mapear los gráficos a actualizar
//   const mappings = {
//     init: {
//       openHeat: openInitYearHeat,
//       closeHeat: closeInitYearHeat,
//       openArea: openInitYearArea,
//       closeArea: closeInitYearArea,
//     },
//     end: {
//       openHeat: openEndYearHeat,
//       closeHeat: closeEndYearHeat,
//       openArea: openEndYearArea,
//       closeArea: closeEndYearArea,
//     },
//   }

//   const currentMapping = mappings[target]
//   if (!currentMapping) {
//     console.error(`Invalid target: ${target}`)
//     isLoading.value = false
//     return
//   }

//   // 3. Transformar y asignar los datos en pasos
//   await Promise.all([
//     transformAndAssignData(
//       storeIncidents.openIncidentsYear,
//       currentMapping.openHeat,
//       generateHeatmapData,
//     ),
//     transformAndAssignData(
//       storeIncidents.closedIncidentsYear,
//       currentMapping.closeHeat,
//       generateHeatmapData,
//     ),
//     transformAndAssignData(
//       storeIncidents.openIncidentsYear,
//       currentMapping.openArea,
//       generateAreapData,
//     ),
//     transformAndAssignData(
//       storeIncidents.closedIncidentsYear,
//       currentMapping.closeArea,
//       generateAreapData,
//     ),
//   ])

//   isLoading.value = false // Desactivar el spinner
// }

// Función auxiliar para transformar y asignar datos
// const transformAndAssignData = async (data, ref, transformFn) => {
//   return new Promise((resolve) => {
//     // Usar requestAnimationFrame para evitar bloquear la UI
//     requestAnimationFrame(() => {
//       ref.value = transformFn(data) // Transformar los datos y asignarlos
//       resolve()
//     })
//   })
// }

// const setDataForYear = async (year, target) => {
//   // isLoading.value = true
//   await storeIncidents.fetchIncYear(year)
//   const mappings = {
//     init: {
//       openHeat: openInitYearHeat,
//       closeHeat: closeInitYearHeat,
//       openArea: openInitYearArea,
//       closeArea: closeInitYearArea,
//     },
//     end: {
//       openHeat: openEndYearHeat,
//       closeHeat: closeEndYearHeat,
//       openArea: openEndYearArea,
//       closeArea: closeEndYearArea,
//     },
//   }

//   const currentMapping = mappings[target]
//   if (!currentMapping) {
//     console.error(`Invalid target: ${target}`)
//     //isLoading.value = false
//     return
//   }

//   currentMapping.openHeat.value = generateHeatmapData(storeIncidents.openIncidentsYear)
//   currentMapping.closeHeat.value = generateHeatmapData(storeIncidents.closedIncidentsYear)
//   currentMapping.openArea.value = generateAreapData(storeIncidents.openIncidentsYear)
//   currentMapping.closeArea.value = generateAreapData(storeIncidents.closedIncidentsYear)

//   await nextTick()
//   isLoading.value = false
// }

watch(
  () => props.initYear,
  (newValue) => {
    setDataInitYear(newValue)
  },
)

watch(
  () => props.endYear,
  (newValue) => {
    setDataEndYear(newValue)
  },
)

onMounted(async () => {
  getYearsArray()
  await Promise.all([setDataInitYear(props.initYear), setDataEndYear(props.endYear)])
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

.heatmap-open-init {
  position: relative;
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

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
