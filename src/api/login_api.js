import ApiBase from './apiBase'

class LoginApi extends ApiBase {
  async postLogin(username, password) {
    const needToken = false
    const data = { username, password }
    const endpoint = '/api/login'
    const response = await this.post(endpoint, needToken, data)
    return response
  }

  async postRegister(username, password) {
    const needToken = false
    const data = { username, password }
    const endpoint = '/api/register'
    return await this.post(endpoint, needToken, data)
  }
}

export default new LoginApi()
