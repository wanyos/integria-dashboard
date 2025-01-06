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
  const tokenExpiration = ref($cookies.get('tokenExpiration') || null)
  const token = ref($cookies.get('token') || null)

  const isAuthenticated = computed(() => {
    const isValid = dayjs().isBefore(dayjs(tokenExpiration.value))
    console.log('tokenExpire', tokenExpiration.value)
    console.log('is valid token: ', isValid)
    if (!isValid) {
      logout()
      return isValid
    }
    return token.value
  })

  const setDataToken = (res) => {
    token.value = res.token
    userLogin.username = res.username
    userLogin.email = res.email

    const expire = dayjs().add(res.expirationTime, 'second').toDate()
    tokenExpiration.value = expire

   $cookies.set('tokenExpiration', `${expire}`, `${expire}`);
   $cookies.set('token', token.value, `${expire}`)
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
    $cookies.remove('tokenExpiration')
    $cookies.remove('token')
  }

  return { credentials, isAuthenticated, userLogin, register, login, logout }
})
