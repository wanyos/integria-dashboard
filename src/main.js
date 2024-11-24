import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiArrowLeft,
  BiCalendar2Check,
  BiChevronDown,
  BiChevronUp,
  BiCheck,
} from 'oh-vue-icons/icons'

import App from './App.vue'
import router from './router'

addIcons(BiArrowLeft, BiCalendar2Check, BiChevronDown, BiChevronUp, BiCheck)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)

app.mount('#app')
