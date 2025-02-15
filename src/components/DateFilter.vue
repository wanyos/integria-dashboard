<template>
<section class="section-container">
   <button @click="openPicker = !openPicker"> {{ btnDate }} </button>
   <div  v-if="openPicker">
    <DatePicker
      :use-utc="true"
      :maximum-view="'day'"
      @input="handleChangedDay"
      :enableMultipleDates="true"
      :multiDatesLimit="5"
      :open-date="dayjs().toDate()"
      :inline="true"
       :highlighted="currentSpanHighlight"
    />
   </div>

</section>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import DatePicker from 'vuejs3-datepicker';

const openPicker = ref(false)
const currentDate = reactive({
  from: null,
  to: null
})

// const openDate = computed(() => dayjs(currentDate.to).toDate() )
const btnDate = computed(() =>  dayjs(currentDate.from).format('MMM DD, YYYY') )

const currentSpanHighlight = computed(() => {
            return {
                from: dayjs(currentDate.from).toDate(),
                to: dayjs(currentDate.to).toDate()
            };
        })

const handleChangedDay = (date) => {
  if (!date) return
  try {
    currentDate.from = date
   // openPicker.value = false
  } catch (error) {
    console.error('Error al procesar la fecha:', error)
  }
}

const state = ref({
  highlighted: {
    to: new Date(2016, 0, 5), // Highlight all dates up to specific date
    from: new Date(2016, 0, 26), // Highlight all dates after specific date
    dates: [ // Highlight an array of dates
      new Date(2016, 9, 16),
      new Date(2016, 9, 17),
      new Date(2016, 9, 18)
    ]
    },
    includeDisabled: true // Highlight disabled dates
  })


// const currentHighlight = () => {
//   return {
//       from: dayjs(currentDate.from).toDate(),
//       to: dayjs(currentDate.to).toDate()
//     }
// }

// const customFormat = (date) => {
//   if (!date) return ''
//   const d = new Date(date)
//   return d.toISOString().split('T')[0]
// }

// const setOpenDate = () => {
//   currentDate.from = dayjs().format('MMM DD, YYYY')
//   console.log('fecha', currentDate.from)
//   console.log('Date', dayjs(currentDate.from, 'MMM DD, YYYY').toDate() )
//  return currentDate.from
// }

onBeforeMount(() => {
  currentDate.from = dayjs().toDate()
  currentDate.to = dayjs().toDate()
})

</script>

<style lang="css">

.calendar {
  margin-top: 15px !important;
}

.div-datepicker button {
  border: 1px solid blue;
  border-radius: 10px;
  padding: 10px 18px;
  cursor: pointer;
}

</style>
