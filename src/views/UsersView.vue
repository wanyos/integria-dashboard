<template>
  <div>
    <h3>Users</h3>
    <p>users: {{ users }}</p>
  </div>
</template>

<script setup>
import UsersApi from '@/api/users_api'
import { onMounted, ref } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'

const users = ref([])
const authStore = useAuthenticationStore()

onMounted(async () => {
  try {
    const token = authStore.isAuthenticated
    if (token) {
      users.value = await UsersApi.getUsers(token)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})
</script>

<style lang="scss" scoped></style>
