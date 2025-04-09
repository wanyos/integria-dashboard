<template>
  <section class="container">
    <LoginModal :show="showModalLogin" @reset-modal="showModalLogin = false" :title="titleModal" />
    <header :class="{ scrolled: isScrolling }" ref="header">
      <p>{{ routeName }}</p>
      <div class="header__userlogin-div">
        <p>{{ authStore.userLogin.email }}</p>
      </div>
      <article>
        <h4>Integria Dashboard</h4>
        <div v-if="!authStore.isAuthenticated" class="header__login-div">
          <button @click="openModal('Sing Up')">Sing up</button>
          <button @click="openModal('Sing In')">Sing in</button>
        </div>
        <div v-else class="header__login-div">
          <button @click="authStore.logout">LogOut</button>
        </div>
      </article>
    </header>

    <aside>
      <div class="logo div__logo"></div>
      <nav>
        <RouterLink v-if="!showMenu" to="/" class="nav-link">
          <v-icon name="bi-arrow-left" /> Report
        </RouterLink>
        <div v-if="showMenu" class="nav-items">
          <RouterLink :to="{ name: 'Incidents' }" class="nav-link">Incidents</RouterLink>
          <RouterLink :to="{ name: 'Inventory' }" class="nav-link">Inventory</RouterLink>
          <RouterLink :to="{ name: 'Users' }" class="nav-link">Users</RouterLink>
        </div>
      </nav>
    </aside>

    <main ref="main" @scroll="handleScroll">
      <RouterView />
    </main>

    <!-- <footer>
      <p>CAU</p>
    </footer> -->
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import LoginModal from './components/modals/LoginModal.vue'
import { useAuthenticationStore } from '@/stores/authentication.js'

const route = useRoute()
const authStore = useAuthenticationStore()

const isScrolling = ref(false)
const header = ref(null) // Referencia al Header
const main = ref(null) // Referencia al Main
const showModalLogin = ref(false)
const titleModal = ref('')
const routeName = computed(() => route.name)
const showMenu = computed(() => routeName.value === 'Report')

const openModal = (title) => {
  showModalLogin.value = true
  titleModal.value = title
}

const handleScroll = () => {
  isScrolling.value = main.value.scrollTop > 10
}
</script>

<style scoped lang="css">
.container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
}

header {
  grid-column: 1 / -1;
  background-color: #edf0f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header > p {
  margin-left: 3rem;
  color: var(--color-text);
}

.header__userlogin-div {
  color: var(--color-text);
}

header > article {
  margin-right: 3rem;
  display: flex;
  align-items: center;
}

header > article > h4 {
  color: var(--color-text);
}

.header__login-div {
  padding: 5px 25px;
}

.header__login-div > button {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 5px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.header__login-div > button:hover {
  background-color: var(--hover-button);
}

header::before {
  content: ''; /* Necesario para el pseudo-elemento */
  position: absolute; /* Posiciona el pseudo-elemento dentro del header */
  top: 60px; /* Lo coloca justo debajo del header */
  left: 0;
  right: 0;
  width: 100%;
  height: 30px; /* Altura de la sombra */
  background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)); /* Degradado para la sombra */
  pointer-events: none; /* Evita que interfiera con clics o eventos */
  opacity: 0; /* Sombra invisible por defecto */
  transition: opacity 0.3s ease; /* Transición suave */
}

header.scrolled::before {
  opacity: 1; /* Muestra la sombra al hacer scroll */
}

aside {
  padding: 0 3rem;
  grid-column: 1 / 2;
  background-color: #edf0f6;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.div__logo {
  margin-top: 2rem;
}

.nav-link {
  text-decoration: none;
  padding: 0.3em;
  width: 85%;
  margin-top: 5px;
  text-align: center;
  border-radius: 5px;
  color: var(--color-text);
}

.nav-link:hover {
  background-color: var(--hover-button);
}

aside > nav {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.nav-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

main {
  grid-column: 2 / 3;
  overflow-y: auto; /* Permite el scroll solo dentro de main */
}

footer {
  grid-column: 1 / -1;
  grid-row: 3 / 4;
  margin-top: 0.5rem;
  background-color: #edf0f6;
  display: flex;
  align-items: center;
  justify-content: end;
}

footer > p {
  margin-right: 3rem;
  color: var(--color-text);
}
</style>
