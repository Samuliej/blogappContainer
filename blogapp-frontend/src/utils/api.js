import axios from 'axios'

const url = process.env.REACT_APP_BACKEND_URL

console.log('front url', url)

const api = axios.create({
  baseURL: url
})

export default api