<template>
 <section class="main-container container-report">

  <section class="section-search">
    <div class="div-header">
      <button @click="search">Search</button>

      <DateFilter />

    </div>

   <div class="chart-base container-incidents">
        {{ incidents }}
   </div>

      <button @click="sendGmail">Send gmail</button>
  </section>

 </section>
</template>

<script setup>
import IncidentsApi from '@/api/incidents_api'
import { onMounted, ref } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'
import DateFilter from '@/components/DateFilter.vue'

const incidents = ref([])
const authStore = useAuthenticationStore()
let token = null

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
  incidents.value = await IncidentsApi.getIncidents(token)
}

const sendGmail = async () => {
  const email = 'juanjor99@gmail.com';
  const title = 'Subject of the email';
  const comment = 'Total incidents';

  try {
    const res = await fetch('http://localhost:8022/send-gmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token.value,
    },
    body: JSON.stringify({
      email,
      title,
      comment,
      incidents: incidents.value
    })
  })

    const result = await res.text();
    console.log(result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

</script>

<style lang="css" scoped>
.container-report {
  margin-top: 15px;
  border-radius: 15px;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: 200px;
  gap: 10px;
}

.section-search {
  grid-column: 1 / -1;

}

.section-search > button {
  grid-row: 1 / 2;
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
  height: 100%;
}

.div-header {
  display: flex;

}


</style>
