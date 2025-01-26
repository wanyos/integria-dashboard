<template>
  <section class="main-container container-report">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
    <div class="div-menu">
      <button
        @click="selectOptionMenu('Dashboard')"
        :class="{ selected: selectedOptions === 'Dashboard' }"
      >
        Dashboard
      </button>
      <button @click="selectOptionMenu('Dates')">Dates</button>
      <button @click="selectOptionMenu('Years')">Years</button>
    </div>

    <section class="section-years">
      <div v-if="selectedOptions === MENU_OPTIONS.Years" class="div-select-years">
        <div class="no__item">
          <ComboBox
            :options="initYearValues"
            icon-name="bi-calendar2-check"
            v-model="initYear"
            custom-width="50px"
          />
        </div>
        <div class="no__item">
          <ComboBox
            :options="endYearsValues"
            icon-name="bi-calendar2-check"
            v-model="endYear"
            custom-width="50px"
          />
        </div>
      </div>

      <div v-if="selectedOptions === MENU_OPTIONS.Dates" class="item div__select">
        <ComboBox :options="SELECT_PERIOD" icon-name="bi-calendar2-check" v-model="selectedRange" />
      </div>
    </section>

    <div v-if="selectedOptions === MENU_OPTIONS.Dates" class="item item-label-date">
      {{ currentDate }}
    </div>
    <div class="item item__title"><p>Incidents</p></div>

    <ReportDashboard v-if="selectedOptions === MENU_OPTIONS.Dashboard" />

    <ReportDates
      v-if="selectedOptions === MENU_OPTIONS.Dates"
      :selected-range="selectedRange"
      :init-year="initYear"
      @update:currentDate="updateCurrentDate"
    />
    <ReportYears
      v-if="selectedOptions === MENU_OPTIONS.Years"
      :init-year="initYear"
      :end-year="endYear"
    />
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { SELECT_PERIOD } from '@/constants/constants'
import ComboBox from '@/components/ComboBox.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import ReportYears from '@/components/report/ReportYears.vue'
import ReportDates from '@/components/report/ReportDates.vue'
import ReportDashboard from '@/components/report/ReportDashboard.vue'

const MENU_OPTIONS = {
  Dashboard: 'Dashboard',
  Dates: 'Dates',
  Years: 'Years',
}

const selectedRange = ref(dayjs().format('DD MMM YYYY'))
const initYear = ref(dayjs().subtract(1, 'year').year())
const endYear = ref(dayjs().subtract(2, 'year').year())

const isLoading = ref(false)
const selectedOptions = ref(MENU_OPTIONS.Dashboard)
const currentDate = ref(dayjs().format('DD MMM YYYY'))

const initYearValues = computed(() => {
  let years = []
  let startYear = 2015
  const currentYear = dayjs().year()
  while (startYear < currentYear) {
    years.push(startYear++)
  }
  return years
})

const endYearsValues = computed(() => {
  let years = []
  let startYear = 2015
  let finish = initYear.value
  while (startYear < finish) {
    years.push(startYear++)
  }
  return years
})

watch(initYear, (newValue) => {
  endYear.value = newValue - 1
})

watch(selectedOptions, (newValue) => {
  if (newValue === 'Years') {
    initYear.value = dayjs().subtract(1, 'year').year()
  }
})

watch(selectedRange, (newValue) => {
  selectedRange.value = newValue
})

const updateCurrentDate = (newDate) => {
  currentDate.value = newDate
}

const selectOptionMenu = (option) => {
  selectedOptions.value = option
}
</script>

<style lang="css" scoped>
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
  margin-left: 15px;
}

.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.div-menu > button {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 5px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.div-menu > button:hover {
  background-color: var(--hover-button);
}

.div-menu > button:focus,
.div-menu > button.selected {
  background-color: #0088cc;
  color: #fff;
  outline: none;
}

/**************************                 container report          ***************************/
.container-report {
  margin-top: 15px;
  border-radius: 15px;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 70px 30px 30px 100px 450px 300px 300px 300px;
  gap: 10px;
}

.div-menu {
  padding: 10px;
  border-bottom: 2px solid var(--color-text);
  width: 90%;
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  margin-bottom: 10px;
}

.section-years {
  grid-column: 2 / 4;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
}

.div-select-years {
  display: flex;
}

.item-label-date {
  grid-column: 4 / -1;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.item__title {
  grid-column: 1 / -1;
  grid-row: 3 / 4;
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
