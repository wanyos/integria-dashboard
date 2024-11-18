<template>
  <div>
    <h3>Inventory</h3>
    <p>inventory: {{ inventory }}</p>
  </div>
</template>

<script setup>
import InventoryApi from '@/api/inventory_api'
import { onMounted, ref } from 'vue'

const inventory = ref([])

onMounted(async () => {
  try {
    inventory.value = await InventoryApi.getInventory()
  } catch (error) {
    console.error('Error fetching inventory:', error)
  }
})
</script>

<style lang="scss" scoped></style>
