import ApiBase from './apiBase'

class IncidentsApi extends ApiBase {
  async getIncidents(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/incidents', needToken)
  }

  async getIncExternalResolutor(startDate, endDate, token) {
    const needToken = true
    const endpoint = `/api/incidents/external-resolutor/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    ApiBase._setToken(token)
    return await this.get(endpoint, needToken)
  }

  async getIncidentsTechnology(startDate, endDate, token) {
    const needToken = true
    const endpoint = `/api/incidents/integria-technology/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    ApiBase._setToken(token)
    return await this.get(endpoint, needToken)
  }

  async getIssIncidents(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/incidents/iss', needToken)
  }

  /**  */

  async createIncident(incidentData) {
    const needToken = true
    return await this.post('/api/incident', incidentData, needToken)
  }

  async updateIncident(incidentId, incidentData) {
    const needToken = true
    return await this.put(`/api/incident/${incidentId}`, incidentData, needToken)
  }

  async deleteIncident(incidentId) {
    const needToken = true
    return await this.delete(`/api/incident/${incidentId}`, needToken)
  }
}

export default new IncidentsApi()
