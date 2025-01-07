import ApiBase from './apiBase'

class ReportApi extends ApiBase {
  async getIncidentsRange(startDate, endDate) {
    const endpoint = `/api/report/range/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    const needToken = false
    return await this.get(endpoint, needToken)
  }
  async getAllIncidentsGroup(startDate, endDate) {
    const endpoint = `/api/report/group/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    const needToken = false
    return await this.get(endpoint, needToken)
  }
  async getAllIncidentsYear(currentYear) {
    const endpoint = `/api/report/year/${currentYear}`
    const needToken = false
    return await this.get(endpoint, needToken)
  }
  async getOpenIncidentsGroup() {
    const endpoint = '/api/report/open'
    const needToken = false
    return await this.get(endpoint, needToken)
  }
  async getIncLocationRange(startDate, endDate) {
    const endpoint = `/api/report/location/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    const needToken = false
    return await this.get(endpoint, needToken)
  }
  async getIncBasesRange(startDate, endDate) {
    const endpoint = `/api/report/bases/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    const needToken = false
    return await this.get(endpoint, needToken)
  }
  async getIncByHours(startDate, endDate){
    const endpoint = `/api/report/byhours/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`
    const needToken = false
    return await this.get(endpoint, needToken)
  }
}

export default new ReportApi()
