/* eslint-disable no-undef */
import ApiBase from './apiBase'

class InventoryApi extends ApiBase {
  async getInventory() {
    const needToken = true
    const token = $cookies.get('token')
    ApiBase._setToken(token)
    return await this.get('/api/inventory', needToken)
  }

  async createIncident(inventoryData) {
    return await this.post('/api/inventory', inventoryData)
  }

  async updateIncident(inventoryId, inventoryData) {
    return await this.put(`/api/inventory/${inventoryId}`, inventoryData)
  }

  async deleteInventory(inventoryId) {
    return await this.delete(`/api/inventory/${inventoryId}`)
  }
}

export default new InventoryApi()
