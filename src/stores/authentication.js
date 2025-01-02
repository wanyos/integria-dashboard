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

  const isAuthenticated = computed(() => !!token.value)

  const getValidToken = computed(() => {

    console.log('token expire', tokenExpiration.value);
    console.log('token', token.value);

    // const time = $cookies.get('token').expire
    // const name = $cookies.get('token').name
    // const token = $cookies.get('token').token
    // console.log('token is valid', time)
    // console.log('name', name)
    // console.log('token', token)
    // if (!token.value) {
    //   logout()
    //   return null
    // }
    // console.log('token is valid', token.value)
    return token.value
  })

  const setDataToken = (res) => {
    token.value = res.token
    userLogin.username = res.username
    userLogin.email = res.email
    // Convertimos los segundos de expiración en horas
    // const expirationInHours = res.expirationTime / 3600
    const expire = dayjs().add(res.expirationTime, 'second').toDate()
    tokenExpiration.value = expire

    const userCookie = {
      name: res.username,
      email: res.email,
      token: res.token,
      expire: tokenExpiration,
    }
    $cookies.set('token', token.value, expire)
    $cookies.set('tokenExpiration', expire);
    // $cookies.set('token', userCookie)
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

  return { credentials, getValidToken, isAuthenticated, userLogin, register, login, logout }
})
