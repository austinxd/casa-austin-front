import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { SearchTrackingResponse, SearchTrackingParams } from '@/interfaces/analytics.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const searchTrackingApi = createApi({
    reducerPath: 'searchTrackingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENV.API_URL}/stats`,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['SearchTracking'],
    endpoints: (builder) => ({
        // Obtener análisis de búsquedas
        getSearchTracking: builder.query<SearchTrackingResponse, SearchTrackingParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams()
                
                // Agregar parámetros opcionales
                if (params.date_from) searchParams.append('date_from', params.date_from)
                if (params.date_to) searchParams.append('date_to', params.date_to)
                if (params.include_clients !== undefined) searchParams.append('include_clients', params.include_clients.toString())
                if (params.include_anonymous !== undefined) searchParams.append('include_anonymous', params.include_anonymous.toString())
                
                const queryString = searchParams.toString()
                return queryString ? `search-tracking?${queryString}` : 'search-tracking'
            },
            providesTags: ['SearchTracking'],
        }),
    }),
})

export const {
    useGetSearchTrackingQuery,
    useLazyGetSearchTrackingQuery,
} = searchTrackingApi