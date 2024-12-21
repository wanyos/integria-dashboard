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
  FaRegularUserCircle,
  RiLockPasswordLine,
  BiEyeSlash,
  BiEye,
} from 'oh-vue-icons/icons'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

addIcons(
  BiArrowLeft,
  BiCalendar2Check,
  BiChevronDown,
  BiChevronUp,
  BiCheck,
  FaRegularUserCircle,
  RiLockPasswordLine,
  BiEyeSlash,
  BiEye,
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.use(VueCookies, {
  expires: '1d',
  path: '/',
})

app.mount('#app')
