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
  MdAlternateemailSharp,
  IoOptionsSharp,
  FaPlusCircle
} from 'oh-vue-icons/icons'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// import VuejsDatepicker from 'vuejs3-datepicker';

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
  MdAlternateemailSharp,
  IoOptionsSharp,
  FaPlusCircle
)

const app = createApp(App)

// app.component('DatePicker', VuejsDatepicker);
// app.config.globalProperties.$datepickerConfig = {
//   touchListeners: {
//     passive: false,
//     capture: true
//   }
// };

app.use(createPinia())
app.use(router)
app.component('v-icon', OhVueIcon)
app.use(VueCookies, {
  expires: '1d',
  path: '/',
})

// Opciones globales para los toasts
const toastOptions = {
  autoClose: 3000, // Duración en milisegundos
  position: 'top-right', // Posición de los toasts
  pauseOnHover: true, // Pausar al pasar el mouse
  draggable: true, // Permitir arrastrar los toasts
  theme: 'dark', // Tema: light, dark o colored
}

app.use(Vue3Toastify, toastOptions)

app.mount('#app')
