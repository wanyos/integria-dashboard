import ApiBase from './apiBase'

class InventoryApi extends ApiBase {
  async getInventory() {
    return await this.get('/api/inventory')
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
