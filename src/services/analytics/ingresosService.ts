import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IngresosResponse, IngresosParams, IIngresosAnalysis } from '@/interfaces/analytics.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const ingresosApi = createApi({
    reducerPath: 'ingresosApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENV.API_URL}/stats`,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['Ingresos'],
    endpoints: (builder) => ({
        // Obtener análisis de ingresos
        getIngresos: builder.query<IngresosResponse, IngresosParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams()
                
                // Agregar parámetros opcionales
                if (params.date_from) searchParams.append('date_from', params.date_from)
                if (params.date_to) searchParams.append('date_to', params.date_to)
                if (params.period) searchParams.append('period', params.period)
                if (params.currency) searchParams.append('currency', params.currency)
                
                const queryString = searchParams.toString()
                return queryString ? `ingresos?${queryString}` : 'ingresos'
            },
            providesTags: ['Ingresos'],
        }),
        // Análisis IA de ingresos
        getIngresosAnalysis: builder.query<IIngresosAnalysis, void>({
            query: () => ({
                url: '/ingresos/analysis/',
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetIngresosQuery,
    useLazyGetIngresosQuery,
    useLazyGetIngresosAnalysisQuery,
} = ingresosApi