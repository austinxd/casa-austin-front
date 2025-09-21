import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { StatsResponse, StatsQueryParams } from '@/interfaces/stats.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const statsApi = createApi({
    reducerPath: 'statsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENV.API_URL}/stats`,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['Stats'],
    endpoints: (builder) => ({
        // Obtener estadísticas
        getStats: builder.query<StatsResponse, StatsQueryParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams()
                
                // Agregar parámetros opcionales
                if (params.period) searchParams.append('period', params.period)
                if (params.days_back !== undefined && Number.isFinite(params.days_back)) searchParams.append('days_back', params.days_back.toString())
                if (params.include_anonymous !== undefined) searchParams.append('include_anonymous', params.include_anonymous.toString())
                if (params.date_from) searchParams.append('date_from', params.date_from)
                if (params.date_to) searchParams.append('date_to', params.date_to)
                
                const queryString = searchParams.toString()
                return queryString ? `?${queryString}` : ''
            },
            providesTags: ['Stats'],
        }),
    }),
})

export const {
    useGetStatsQuery,
    useLazyGetStatsQuery,
} = statsApi