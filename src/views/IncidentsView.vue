<template>
  <section class="main-container container-report">
    <article class="section-header">
      <div class="div-datepicker">
        <DateFilter @set-date="selectDate" />
      </div>
      <button
        @click="search"
        :disabled="dates.initDate === null"
        class="btn__search"
        :class="isDisabled"
      >
        Search
      </button>
    </article>

    <article class="chart-base container-incidents">
      <p>{{ datesIntegria }}</p>
      <TableChart
        v-if="incidents.length !== 0"
        title="Summary total resolutor incidents Integria"
        :data-column="columns"
        :data-row="incidents"
      />
    </article>

    <article class="chart-base container-servidesk">
      <p>{{ datesServidesk }}</p>
      <TableChart
        v-if="issIncidents.length !== 0"
        title="Summary total incidents servidesk"
        :data-column="columnsServidesk"
      />
    </article>
    <div class="chart-base container-files">
      <CardFile
        title="Iss Fuencarral"
        :icon="IconExcel"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />
      <CardFile
        title="Iss Fuencarral"
        :icon="IconExcel"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />
      <CardFile
        title="Iss Fuencarral"
        :icon="IconExcel"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />
      <CardFile
        title="Iss Fuencarral"
        :icon="IconExcel"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />
      <CardFile
        title="Iss Fuencarral"
        :icon="IconExcel"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />
    </div>

    <section class="section__footer">
      <button @click="sendGmail" class="btn__search btn__send">Send Reports</button>
    </section>
  </section>
</template>

<script setup>
import IncidentsApi from '@/api/incidents_api'
import { onMounted, ref, reactive, computed } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'
import TableChart from '@/components/TableChart.vue'
import DateFilter from '@/components/DateFilter.vue'
import CardFile from '@/components/global-components/CardFile.vue'
import IconExcel from '@/assets/img/img-excel.webp'
import dayjs from 'dayjs'

const columns = ['Resolutor', 'Incidents', 'Email']
const columnsServidesk = ['Location', 'Incidents', 'Email']

const incidents = ref([])
const issIncidents = ref([])
const integriaInit = ref(dayjs('2023-01-01'))

const authStore = useAuthenticationStore()
let token = null
const dates = reactive({ initDate: null, endDate: null })

const selectDate = (date) => {
  dates.endDate = dayjs(date)
  dates.initDate = dates.endDate.subtract(6, 'day')
}

const isDisabled = computed(() => (dates.initDate === null ? 'btnDisabled' : 'btnEnabled'))
// const datesSearch = computed(() => dates.initDate !== null ? `Dates week: ${dates.initDate.format('DD MMM,YYYY')} -- ${dates.endDate.format('DD MMM,YYYY')}` : '')
const datesServidesk = computed(() =>
  dates.endDate !== null
    ? `Dates servidesk 01 Jan, 2024 -- ${dates.endDate.format('DD MMM,YYYY')}`
    : '',
)
const datesIntegria = computed(() =>
  dates.endDate !== null
    ? `Dates integria: ${integriaInit.value.format('DD MMM,YYYY')} -- ${dates.endDate.format('DD MMM,YYYY')}`
    : '',
)

onMounted(async () => {
  try {
    token = authStore.isAuthenticated
    if (!token) {
      console.log('!!!Error in token....')
    }
  } catch (error) {
    console.error('Error fetching incidents:', error)
  }
})

const search = async () => {
  const endDate = dayjs(dates.endDate).format('YYYY-MM-DD')

  // incidents intgria
  const incIntegria = await IncidentsApi.getIncExternalResolutor(integriaInit, endDate, token)
  incidents.value = Object.entries(incIntegria).map(([resolutor, incidents]) => ({
    resolutor,
    total: incidents.length,
  }))

  // incidents servidesk
  const incIss = await IncidentsApi.getIssIncidents(token)
  console.log('instalaciones servicios', incIss)

  // issIncidents.value = await IncidentsApi.getIssIncidents(token)
  // incidents.value = await IncidentsApi.getIncidents(token)
}

const handleFileDragStart = ({ nativeEvent }, file) => {
  // Lógica específica para el archivo Excel
  const blob = new Blob([file.content], { type: file.type })
  const dataTransfer = nativeEvent.dataTransfer

  dataTransfer.items.clear()
  dataTransfer.items.add(new File([blob], file.name))
  dataTransfer.effectAllowed = 'copy'
}

const sendGmail = async () => {
  const email = 'juanjor99@gmail.com, JuanJose.Romero@emtmadrid.es'
  const title = 'Subject of the email'
  const comment = 'Total incidents'

  try {
    const res = await fetch('http://localhost:8022/send-gmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token.value },
      body: JSON.stringify({ email, title, comment, incidents: incidents.value }),
    })

    const result = await res.text()
    console.log(result)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
</script>

<style lang="css" scoped>
.container-report {
  min-height: 95%;
  margin-top: 15px;
  border-radius: 15px;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 10px;
}

.section-header {
  grid-column: 1 / -1;
  display: flex;
  padding: 10px;
  justify-content: space-between;
}

.section-search > button {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 5px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.section-search > button:hover {
  background-color: var(--hover-button);
}

.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.container-incidents {
  min-height: 35rem;
  grid-column: 1 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-servidesk {
  grid-column: 4 / 7;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-files {
  grid-column: 4 / 7;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  place-items: center;
}

.section__footer {
  padding: 1rem;
  grid-column: 1 / -1;
}

.div-datepicker {
  display: flex;
  align-items: center;
}

.div-datepicker p {
  margin-left: 1rem;
  color: var(--color-text-p);
}

.btn__search {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 4px 15px;
  border-radius: 5px;
  margin: 5px;
}

.btn__send {
  cursor: pointer;
}

.btnEnabled {
  cursor: pointer;
}

.btnEnabled:hover {
  background-color: var(--hover-button);
}

.btnDisabled {
  cursor: not-allowed;
}
</style>
