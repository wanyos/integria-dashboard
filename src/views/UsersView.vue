<template>
  <div>
    <h3>Users</h3>
    <p>users: {{ users }}</p>
  </div>
</template>

<script setup>
import UsersApi from '@/api/users_api'
import { onMounted, ref } from 'vue'

const users = ref([])

onMounted(async () => {
  try {
    users.value = await UsersApi.getUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})
</script>

<style lang="scss" scoped></style>
