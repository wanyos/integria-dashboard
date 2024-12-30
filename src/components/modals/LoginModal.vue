<template>
  <Teleport to="body">
    <section v-if="showModal" class="modal-container">
      <div class="div__login">
        <div class="div__btn-close">
          <button @click="closeModal">X</button>
        </div>

        <div class="div__header">
          <h3>{{ props.title }}</h3>
        </div>

        <div class="div__form">
          <form action="">
            <div class="item">
              <label for=""> <v-icon name="fa-regular-user-circle" class="icon-form" /> </label>
              <input
                v-model="authStore.credentials.username"
                type="text"
                placeholder="username"
                autocomplete="username"
                required
              />
            </div>

            <div v-if="typeRegister" class="item">
              <label for=""> <v-icon name="md-alternateemail-sharp" class="icon-form" /> </label>
              <input
                v-model="authStore.credentials.email"
                type="email"
                placeholder="email"
                autocomplete="email"
                required
              />
            </div>

            <div class="item">
              <label for=""> <v-icon name="ri-lock-password-line" class="icon-form" /> </label>
              <input
                v-model="authStore.credentials.password"
                :type="passwordFieldType"
                placeholder="password"
                autocomplete="current-password"
                required
              />

              <button class="btn-eye" @click.prevent="togglePasswordVisibility">
                <v-icon
                  :name="passwordFieldType === 'password' ? 'bi-eye' : 'bi-eye-slash'"
                  class="icon-eye"
                />
              </button>
            </div>
          </form>
        </div>

        <div class="div__buttons">
          <button v-if="typeRegister" @click="handleRegister">Register</button>
          <button v-else @click="handleLogin">Login</button>
          <button @click="closeModal">Close</button>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Sign In',
  },
})

const authStore = useAuthenticationStore()
const emit = defineEmits(['resetModal'])
const showModal = ref(props.show)
const passwordFieldType = ref('password')

watch(
  () => props.show,
  (newVal) => {
    showModal.value = newVal
  },
)

const typeRegister = computed(() => props.title === 'Sing Up')

const closeModal = () => {
  showModal.value = !showModal.value
  emit('resetModal')
}

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const handleLogin = async () => {
  try {
    await authStore.login()
    closeModal()
  } catch (error) {
    console.log('Login failed: ', error)
  }
}

const handleRegister = async () => {
  try {
    await authStore.register()
    closeModal()
  } catch (error) {
    console.log('Register failed: ', error)
  }
}
</script>

<style lang="css" scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background-color: rgba(241, 243, 243, 0.5); /* Fondo blanco semitransparente */
  backdrop-filter: blur(5px); /* Efecto de difuminado */
  -webkit-backdrop-filter: blur(5px); /* Soporte para Safari */
  display: flex;
  justify-content: center;
  align-items: center;
}

.div__login {
  width: 400px;
  height: 370px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.div__header {
  display: flex;
  justify-content: center;
}

.div__btn-close {
  display: flex;
  justify-content: end;
}

.div__btn-close > button {
  padding: 3px 5px;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--close-button);
  color: #fff;
}

.div__header > button:hover {
  background-color: var(--close-button-hover);
}

.item {
  padding: 15px 0;
  margin-left: 25px;
  display: flex;
}

.icon-form {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.item > input {
  border-bottom: 1px solid black;
  padding-left: 15px;
  margin-top: 5px;
  width: 70%;
  font-size: 16px;
}

.div__buttons {
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
}

.div__buttons > button {
  border: 1px solid black;
  text-align: center;
  cursor: pointer;
  margin: 5px;
  padding: 5px 15px;
  border-radius: 10px;
}

.div__buttons > :first-child {
  background-color: #bde5d8;
}

.div__buttons > :first-child:hover {
  background-color: #a4d2c3;
}

.div__buttons > :nth-child(2):hover {
  background-color: #f5f9f8;
}

.btn-eye {
  cursor: pointer;
}

.icon-eye {
  width: 25px;
  height: 25px;
}
</style>
