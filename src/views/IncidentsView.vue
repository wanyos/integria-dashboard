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
      <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
      <p>{{ datesIntegria }}</p>
      <TableChart
        v-if="incidents.length !== 0"
        title="Summary total resolutor incidents Integria"
        :data-column="columns"
        :data-row="incidents"
      />
    </article>

    <article class="chart-base container-servidesk">
      <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />
      <p>{{ datesServidesk }}</p>
      <TableChart
        v-if="issIncidents.length !== 0"
        title="Summary of incidents at ISS Servidersk"
        :data-column="columnsServidesk"
        :data-row="issIncidents"
      />
      <TableChart
        v-if="integriaTechnology.length !== 0"
        title="Summary of incidents in integria technology"
        :data-column="columnsIntegriaTec"
        :data-row="integriaTechnology"
        class="tableTecIntegria"
      />
    </article>

    <div class="chart-base container-files">
      <CardFile
        v-for="(file, index) in filesIss" :key="index"
        :title="file.name"
        :icon="IconExcel"
        :size="file.content.byteLength"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />

      <CardFile
       v-for="(file, index) in filesIntegria" :key="index"
        :title="file.name"
        :icon="IconExcel"
        :size="file.content.byteLength"
        @drag-start="(e) => handleFileDragStart(e, file)"
      />
    </div>

    <section class="section__footer">
      <button @click="sendGmail" class="btn__search btn__send">Send Reports</button>
      <button @click="startProcess" class="btn__search btn__send" :class="isArrayFiles">Start process</button>
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
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { createFileIss, createFileIntegria } from '../utils/create_files.js'

const columns = ['Resolutor', 'Incidents', 'Email']
const columnsServidesk = ['Location', 'Incidents', 'Email']
const columnsIntegriaTec = ['Type', 'Incidents', 'Email']

const incidents = ref([])
const issIncidents = ref([])
const integriaTechnology = ref([])

const filesIss = ref([]);
const filesIntegria = ref([])

const integriaInit = ref(dayjs('2024-01-01'))
const isLoading = ref(false)
const authStore = useAuthenticationStore()
let token = null
const dates = reactive({ initDate: null, endDate: null })

let incIss = null;
let integriaTec = null;

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

const isArrayFiles = computed(() => issIncidents.value.length === 0 ? 'btnDisabled' : 'btnEnabled');

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
  isLoading.value = true;
  const endDate = dayjs(dates.endDate).format('YYYY-MM-DD')

  // incidents integria resolutor externo
  const incIntegria = await IncidentsApi.getIncExternalResolutor(integriaInit.value.format('YYYY-MM-DD'), endDate, token)
  incidents.value = Object.entries(incIntegria).map(([resolutor, incidents]) => ({
    resolutor,
    total: incidents.length,
  }))

  // incidents servidesk
  incIss = await IncidentsApi.getIssIncidents(token)
  issIncidents.value = Object.entries(incIss).map(([location, incidents]) => ({
    location,
    total: incidents.length,
  }))

  // incidents integria tecnologia
integriaTec = await IncidentsApi.getIncidentsTechnology(integriaInit.value.format('YYYY-MM-DD'), endDate, token)
// integriaTec = await IncidentsApi.getIncidentsTechnology(dates.initDate.format('YYYY-MM-DD'), endDate, token)

// console.log('all incidents tecnologia', integriaTec);

integriaTechnology.value = Object.entries(integriaTec).map(([type, incidents]) => ({
    type,
    total: incidents.length,
  }))

  isLoading.value = false;
}

const handleFileDragStart = ({ nativeEvent }, file) => {
    try {
        const blob = new Blob([file.content], { type: file.type });
       const url = URL.createObjectURL(blob);
        const dt = nativeEvent.dataTransfer;
        dt.clearData();

        // Configurar para todos los navegadores
        dt.setData('text/plain', file.name);

        dt.setData('DownloadURL', `${file.type}:${file.name}:${url}`);

        // Añadir archivo real
        dt.items.add(new File([blob], file.name, { type: file.type }));

        // Limpiar memoria después de 30s
        setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (error) {
        console.error('Error en dragstart:', error);
        nativeEvent.preventDefault();
    }
};

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

const startProcess = async () => {
  const openDate = dayjs(dates.initDate);
  const closeDate = dayjs(dates.endDate);

  filesIss.value = await createFileIss(incIss, dates.initDate, dates.endDate);
  filesIntegria.value = await createFileIntegria(integriaTec, openDate, closeDate);

  // console.log('Validación:', {
  //       name: filesIss.value[0].name,
  //       type: filesIss.value[0].type,
  //       sizeBytes: filesIss.value[0].content.byteLength, // Debe ser > 0
  //       isUint8Array: filesIss.value[0].content instanceof Uint8Array // true
  //   });
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
 position: relative;
  min-height: 30rem;
  grid-column: 1 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-servidesk {
  position: relative;
  grid-column: 4 / 7;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-servidesk .tableTecIntegria {
  margin-top: 25px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
