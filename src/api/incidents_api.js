import ApiBase from './apiBase'

class IncidentsApi extends ApiBase {
  async getIncidents() {
    const needToken = true
    return await this.get('/api/incidents', needToken)
  }

  // async getIncidentsRange(startDate, endDate) {
  //   // const endpoint = `/api/incidents?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;    // query
  //   // console.log('dates range in api', startDate, endDate)
  //   // const endpoint = `/api/incidents/range/${encodeURIComponent(startDate)}/${encodeURIComponent()}`
  //   const endpoint = `/api/incidents/range/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
  //   const needToken = false
  //   return await this.get(endpoint, needToken)
  // }

  // async getAllIncidentsGroup(startDate, endDate) {
  //   const endpoint = `/api/incidents/group/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
  //   const needToken = false
  //   return await this.get(endpoint, needToken)
  // }

  // async getAllIncidentsYear(currentYear) {
  //   const endpoint = `/api/incidents/year/${currentYear}`
  //   const needToken = false
  //   return await this.get(endpoint, needToken)
  // }

  // async getOpenIncidentsGroup() {
  //   const endpoint = '/api/incidents/open'
  //   const needToken = false
  //   return await this.get(endpoint, needToken)
  // }

  // async getIncLocationRange(startDate, endDate) {
  //   const endpoint = `/api/incidents/location/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
  //   const needToken = false
  //   return await this.get(endpoint, needToken)
  // }

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
