import ApiBase from './apiBase'

class IncidentsApi extends ApiBase {
  async getIncidents() {
    return await this.get('/api/incidents')
  }

  async createIncident(incidentData) {
    return await this.post('/api/incident', incidentData)
  }

  async updateIncident(incidentId, incidentData) {
    return await this.put(`/api/incident/${incidentId}`, incidentData)
  }

  async deleteIncident(incidentId) {
    return await this.delete(`/api/incident/${incidentId}`)
  }
}

export default new IncidentsApi()
