import axios, { InternalAxiosRequestConfig } from 'axios'
import { ENV } from '../constants/config'
import Cookies from 'js-cookie'

export const casaApi = axios.create({
    baseURL: ENV.API_URL,
})

casaApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = Cookies.get('token') || ''
        if (accessToken) {
            if (config.headers) config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error: any) => {
        console.log('Error -> ', error)
        return Promise.reject(error)
    }
)
