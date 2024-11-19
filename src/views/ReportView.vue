<template>
  <section class="main-container container-report">
    <div class="item div__select">
      <v-icon name="bi-calendar2-check" class="icon-calendar" />
      <ComboBox :options="optCombo" v-model="selectedValue" />
    </div>
    <div class="item item-label-date">{{ formattedDate }}</div>
    <div class="item"><p>Incidents</p></div>

    <div class="item">
      <InfoItem title="Open Incidents" subtitle="93" class="item-info">
        <template #right-icon> <Badge label="-13%" name="success" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Close Incidents" subtitle="12" class="item-info">
        <template #right-icon> <Badge label="+7%" name="error" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Update Incidents" subtitle="3" class="item-info">
        <template #right-icon> <Badge label="-3%" name="success" /> </template>
      </InfoItem>
    </div>

    <div class="item">
      <InfoItem title="Average Incident Management" subtitle="09h 42m" class="item-info">
        <template #right-icon> <Badge label="-41%" name="success" /> </template>
      </InfoItem>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import InfoItem from '@/components/InfoItem.vue'
import Badge from '@/components/Badge.vue'
import ComboBox from '@/components/ComboBox.vue'

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

watch(selectedValue, (newValue) => {
  console.log('Nuevo valor de date_filter:', newValue)
  console.log('opt.value:', selectedValue.value)
})
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
