// const URL_BASE = 'http://localhost:8022'
const API_BASE_URL = import.meta.env.VITE_ENDPOINT_BACKEND

export default class ApiBase {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${endpoint}`)
      }
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to post to ${endpoint}`)
      }
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // all data update
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to put to ${endpoint}`)
      }
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async patch(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to patch to ${endpoint}`)
      }
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete from ${endpoint}`)
      }
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
