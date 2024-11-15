<template>
  <section class="main-container container-report">
    <div class="item div__select">
      <v-icon name="bi-calendar2-check" />
      <select name="filter-date" id="filter-date">
        <option value="1">yesterday</option>
        <option value="2">30 days</option>
        <option value="3">3 months</option>
        <option value="4">6 months</option>
        <option value="5">last year</option>
      </select>
    </div>
    <div class="item">item filter</div>
    <div class="item"><p>Incidents</p></div>
    <div class="item">Open</div>
    <div class="item">Close</div>
    <div class="item">Modify</div>
    <div class="item">item4</div>
  </section>
</template>

<script setup></script>

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
  border: 1 px solid black;
}

.container-report > :nth-child(1) {
  align-self: center;
  justify-self: center;
}

.container-report > :nth-child(1) > select {
  border-radius: 5px;
  padding: 6px 20px;
  border: none;
  outline: none;
  font-size: 16px;
}

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
  padding: 2px 10px;
}
</style>
