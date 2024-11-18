<template>
  <section class="container">
    <header>
      <p>{{ routeName }}</p>
      <h4>Integria Dashboard</h4>
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

    <main>
      <RouterView />
    </main>

    <footer>
      <p>CAU</p>
    </footer>
  </section>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const routeName = computed(() => route.name)
const showMenu = computed(() => routeName.value === 'Report')
</script>

<style scoped>
.container {
  height: 100vh;
  display: grid;
  grid-template-columns: 10rem 1fr;
  grid-template-rows: 35px 1fr 35px;
}

header {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  background-color: #edf0f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header > p {
  margin-left: 3rem;
}

header > h4 {
  margin-right: 3rem;
}

aside {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
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
}

.nav-link:hover {
  background-color: #e1e5ed;
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
  grid-row: 2 / 3;
}

footer {
  grid-column: 1 / -1;
  grid-row: 3 / 4;
  background-color: #edf0f6;
  display: flex;
  align-items: center;
  justify-content: end;
}

footer > p {
  margin-right: 3rem;
}
</style>
