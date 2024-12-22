/* eslint-disable no-undef */
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import LoginApi from '@/api/login_api'
import dayjs from 'dayjs'

export const useAuthenticationStore = defineStore('authentication', () => {
  const credentials = reactive({
    username: '',
    password: '',
  })

  const userLogin = reactive({
    username: '',
    email: '',
  })

  const token = ref($cookies.get('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async () => {
    try {
      const response = await LoginApi.postLogin(credentials.username, credentials.password)

      if (response.status === 200) {
        token.value = response.token

        userLogin.username = response.username
        userLogin.email = response.email

        // Crear una fecha de expiración en formato Date
        const expirationDate = dayjs.unix(response.expirationTime).toDate()
        $cookies.set('token', token.value, expirationDate)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    token.value = null
    $cookies.remove('token')
  }

  return { credentials, isAuthenticated, userLogin, login, logout }
})
