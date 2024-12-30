/* eslint-disable no-undef */
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import LoginApi from '@/api/login_api'
import dayjs from 'dayjs'

export const useAuthenticationStore = defineStore('authentication', () => {
  const credentials = reactive({
    username: null,
    password: null,
    email: null,
  })

  const userLogin = reactive({
    username: null,
    email: null,
  })

  const errorMsg = reactive([])
  const tokenExpiration = ref(null)
  const token = ref($cookies.get('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  const getValidToken = computed(() => {
    console.log('expiration token: ', tokenExpiration.value)
    const expiration = dayjs().isAfter(dayjs(tokenExpiration.value))
    if (expiration) {
      logout()
      return null
    }
    console.log('expiration: ', expiration)
    return token.value
  })

  const setDataToken = (res) => {
    token.value = res.token
    userLogin.username = res.username
    userLogin.email = res.email
    // Crear una fecha de expiración en formato Date
    const expirationDate = dayjs.unix(res.expirationTime).toDate()
    tokenExpiration.value = expirationDate
    $cookies.set('token', token.value, expirationDate)
  }

  const login = async () => {
    try {
      const response = await LoginApi.postLogin(credentials.username, credentials.password)
      if (response.status === 200) {
        setDataToken(response)
      }
    } catch (error) {
      errorMsg.push(error)
      console.log('array erros store: ', errorMsg)
    }
  }

  const register = async () => {
    try {
      const response = await LoginApi.postRegister(
        credentials.username,
        credentials.password,
        credentials.email,
      )
      if (response.status === 201) {
        setDataToken(response)
      }
    } catch (error) {
      errorMsg.push(error)
      console.log('array errors store: ', errorMsg)
    }
  }

  const logout = () => {
    token.value = null
    userLogin.username = null
    userLogin.email = null
    $cookies.remove('token')
  }

  return { credentials, getValidToken, isAuthenticated, userLogin, register, login, logout }
})
