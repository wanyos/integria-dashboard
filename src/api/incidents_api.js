import ApiBase from './apiBase'

class IncidentsApi extends ApiBase {
  async getIncidents() {
    return await this.get('/api/incidents')
  }

  async getTotalIncidents(startDate, endDate) {
    // const endpoint = `/api/incidents?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    const endpoint = `/api/incidents/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`;
    return await this.get(endpoint);
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
