import axios from 'axios'

const token = localStorage.getItem('saleToken')

const axiosClient = axios.create({
  baseURL: 'http://192.168.245.180:8003/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('saleToken')
      ? `Bearer ${localStorage.getItem('saleToken')}`
      : '',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('saleToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Configuration for images
const imageBaseUrl = 'http://192.168.245.180:8003/'
const mainUrl = 'http://192.168.245.180:8003/'

export { axiosClient, imageBaseUrl, mainUrl }
