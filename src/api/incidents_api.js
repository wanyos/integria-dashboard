import ApiBase from './apiBase'

class IncidentsApi extends ApiBase {
  async getIncidents() {
    return await this.get('/api/incidents')
  }

  async getIncidentsRange(startDate, endDate) {
    // const endpoint = `/api/incidents?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;    // query
    // console.log('dates range in api', startDate, endDate)
    // const endpoint = `/api/incidents/range/${encodeURIComponent(startDate)}/${encodeURIComponent()}`
    const endpoint = `/api/incidents/range/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    return await this.get(endpoint)
  }

  async getAllIncidentsGroup(startDate, endDate) {
    const endpoint = `/api/incidents/group/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    return await this.get(endpoint)
  }

  async getAllIncidentsYear(currentYear) {
    const endpoint = `/api/incidents/year/${currentYear}`
    return await this.get(endpoint)
  }

  async getOpenIncidentsGroup() {
    const endpoint = '/api/incidents/open'
    return await this.get(endpoint)
  }

  async getIncLocationRange(startDate, endDate) {
    const endpoint = `/api/incidents/location/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    return await this.get(endpoint)
  }

  /**  */

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
