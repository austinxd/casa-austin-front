import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios'
import { ENV } from '../constants/config'
import Cookies from 'js-cookie'

export const casaApi = axios.create({
    baseURL: ENV.API_URL,
})

// Request interceptor: agrega token a cada request
casaApi.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = Cookies.get('token') || ''
        if (accessToken) {
            if (config.headers) config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error: any) => {
        return Promise.reject(error)
    }
)

// Response interceptor: refresca token en 401
let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (token) {
            resolve(token)
        } else {
            reject(error)
        }
    })
    failedQueue = []
}

casaApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        // No intentar refresh en el endpoint de login o refresh
        const url = originalRequest.url || ''
        if (url.includes('/login/') || url.includes('/token/refresh/')) {
            return Promise.reject(error)
        }

        const refreshToken = Cookies.get('tokenRefresh')
        if (!refreshToken) {
            // Sin refresh token, limpiar y dejar que ProtectRoutes redirija
            Cookies.remove('token')
            Cookies.remove('tokenRefresh')
            Cookies.remove('rollTkn')
            return Promise.reject(error)
        }

        // Si ya hay un refresh en curso, encolar esta request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        resolve(casaApi(originalRequest))
                    },
                    reject,
                })
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const res = await axios.post(`${ENV.API_URL}/token/refresh/`, {
                refresh: refreshToken,
            })
            const newToken = res.data.access
            Cookies.set('token', newToken, { expires: 7 })
            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return casaApi(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError, null)
            Cookies.remove('token')
            Cookies.remove('tokenRefresh')
            Cookies.remove('rollTkn')
            window.location.href = '/login'
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }
)
