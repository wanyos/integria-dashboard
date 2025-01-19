<template>
   <section class="container">
<table>
    <caption>{{ props.title }}</caption>

    <thead>
        <tr>
          <th v-for="(item, index) in props.dataColumn" :key="index">{{ item }}</th>
        </tr>
    </thead>

    <tbody>
      <tr v-for="(row, rowIndex) in props.dataRow" :key="rowIndex">
        <td v-for="(value, key, colIndex) in row" :key="colIndex">{{ value }}</td>
      </tr>
    </tbody>
</table>

</section>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  dataColumn: {
    type: Array,
    default: () => []
  },
  dataRow: {
    type: Array,
    default: () => []
  }
})

</script>

<style lang="css" scoped>
.container {
    /* padding: 25px; */
}

caption {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: normal;
    color:  #1a1a1a;
}

table {
    border: 1px solid lightslategray;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

th {
    position: relative;
    width: 40px;
    padding: 10px 25px;
    font-size: 14px;
    font-weight: normal;
    color:  #1a1a1a;
}

th::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    border-bottom: 2px solid black;
}

td {
    padding: 5px;
    text-align: center;
    font-size: 12px;
    font-weight: normal;
    color:  #1a1a1a;
}
</style>
