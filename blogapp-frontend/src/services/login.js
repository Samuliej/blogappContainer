import api from '../utils/api.js'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await api.post(baseUrl, credentials)
  return response.data
}

export default { login }