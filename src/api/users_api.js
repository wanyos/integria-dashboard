import ApiBase from './apiBase'

class UsersApi extends ApiBase {
  async getUsers() {
    return await this.get('/api/users')
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
