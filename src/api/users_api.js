import ApiBase from './apiBase'

class UsersApi extends ApiBase {
  async getUsers(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/users', needToken)
  }

  async createUser(userData) {
    return await this.post('/api/users', userData)
  }

  async updateUser(userId, userData) {
    return await this.put(`/api/users/${userId}`, userData)
  }

  async deleteUser(userId) {
    return await this.delete(`/api/users/${userId}`)
  }
}

export default new UsersApi()
