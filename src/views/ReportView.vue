<template>
  <section class="main-container container-report">
    <div class="item div__select">
      <v-icon name="bi-calendar2-check" class="icon-calendar" />
      <ComboboxRoot v-model="v" class="ComboboxRoot">
        <ComboboxAnchor class="ComboboxAnchor">
          <ComboboxInput class="ComboboxInput" placeholder="Choose an option..." />
          <ComboboxTrigger>
            <v-icon name="bi-chevron-down" />
          </ComboboxTrigger>
        </ComboboxAnchor>

        <ComboboxContent class="ComboboxContent">
          <ComboboxViewport class="ComboboxViewport">
            <ComboboxEmpty class="ComboboxEmpty" />

            <ComboboxGroup>
              <ComboboxItem
                v-for="(option, index) in options"
                :key="index"
                class="ComboboxItem"
                :value="option"
              >
                <ComboboxItemIndicator class="ComboboxItemIndicator">
                  <Icon icon="radix-icons:check" />
                </ComboboxItemIndicator>
                <span>
                  {{ option }}
                </span>
              </ComboboxItem>
              <ComboboxSeparator class="ComboboxSeparator" />
            </ComboboxGroup>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxRoot>

      <!-- <select v-model="date_filter" name="filter-date" id="filter-date">
        <option value="yesterday">Yesterday</option>
        <option value="last_week">Last Week</option>
        <option value="30_days">30 Days</option>
        <option value="3_months">3 Months</option>
        <option value="6_months">6 Months</option>
        <option value="last_year">Last year</option>
      </select> -->
    </div>
    <div class="item item-label-date">{{ select_date }}</div>
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
import InfoItem from '@/components/InfoItem.vue'
import Badge from '@/components/Badge.vue'
import { ref, watch } from 'vue'

import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from 'radix-vue'

const v = ref('')
const options = ['Yesterday', 'Last Week', '30 Days', '3 Months', '6 Months', 'Last Year']

const select_date = ref('17 Nov 2024')
const date_filter = ref('')

watch(date_filter, (newValue) => {
  console.log('Nuevo valor de date_filter:', newValue)
  console.log('opt.value:', date_filter.value)
})
</script>

<style scoped>
.ComboboxRoot {
  position: relative;
}

.ComboboxAnchor {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1;
  height: 35px;
  padding: 0 15px;
  gap: 5px;
  background-color: white;
  color: #1a1a1a;
  border-radius: 4px;
}

.ComboboxInput {
  height: 100%;
  background-color: transparent;
}
.ComboboxInput[data-placeholder] {
  color: #1a1a1a;
}

.ComboboxIcon {
  width: 16px;
  height: 16px;
}

.ComboboxContent {
  z-index: 10;
  width: 100%;
  position: absolute;
  left: 0px;
  overflow: hidden;
  background-color: white;
  border-radius: 6px;
  margin-top: 8px;
  box-shadow:
    0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

.ComboboxViewport {
  padding: 5px;
}

.ComboboxEmpty {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
}

.ComboboxItem {
  font-size: 14px;
  line-height: 1;
  border-radius: 3px;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 35px 0 25px;
  position: relative;
}
.ComboboxItem[data-disabled] {
  color: #4ea6e1;
  pointer-events: none;
}
.ComboboxItem[data-highlighted] {
  outline: none;
  background-color: rgb(137, 196, 221);
  color: #fff;
  cursor: pointer;
}

.ComboboxLabel {
  padding: 0 25px;
  font-size: 12px;
  line-height: 25px;
  color: #1a1a1a;
}

.ComboboxItemIndicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

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
