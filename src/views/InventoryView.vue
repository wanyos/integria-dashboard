<template>
  <div>
    <h3>Inventory</h3>
    <p>inventory: {{ inventory }}</p>
  </div>
</template>

<script setup>
import InventoryApi from '@/api/inventory_api'
import { onMounted, ref } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'

const inventory = ref([])
const authStore = useAuthenticationStore()

onMounted(async () => {
  try {
    const token = authStore.isAuthenticated
    if (token) {
      inventory.value = await InventoryApi.getInventory(token)
    }
  } catch (error) {
    console.error('Error fetching inventory:', error)
  }
})
</script>

<style lang="scss" scoped></style>
