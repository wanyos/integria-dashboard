const API_BASE_URL = import.meta.env.VITE_ENDPOINT_BACKEND

export default class ApiBase {
  static token = null

  static _setToken(tk) {
    this.token = tk
  }

  static _getHeaders(includeToken = true) {
    const headers = {
      'Content-Type': 'application/json',
    }
    if (includeToken && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  async get(endpoint, includeToken) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: ApiBase._getHeaders(includeToken),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to get from ${endpoint}`)
    }
    return await response.json()
  }

  async post(endpoint, includeToken, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: ApiBase._getHeaders(includeToken),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to ppost to ${endpoint}`)
    }
    return await response.json()
  }

  // all data update
  async put(endpoint, includeToken, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: ApiBase._getHeaders(includeToken),
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

  async patch(endpoint, includeToken, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: ApiBase._getHeaders(includeToken),
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
