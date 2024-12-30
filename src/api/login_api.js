import ApiBase from './apiBase'

class LoginApi extends ApiBase {
  async postLogin(username, password) {
    const needToken = false
    const data = { username, password }
    const endpoint = '/api/login'
    const response = await this.post(endpoint, needToken, data)
    return response
  }

  async postRegister(username, password, email) {
    const needToken = false
    const data = { username, password, email }
    const endpoint = '/api/register'
    const response = await this.post(endpoint, needToken, data)
    return response
  }
}

export default new LoginApi()
