import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UpcomingCheckinsResponse, UpcomingCheckinsParams } from '@/interfaces/analytics.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const newUpcomingCheckinsApi = createApi({
    reducerPath: 'newUpcomingCheckinsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENV.API_URL}`,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['NewUpcomingCheckins'],
    endpoints: (builder) => ({
        // Obtener check-ins próximos
        getNewUpcomingCheckins: builder.query<UpcomingCheckinsResponse, UpcomingCheckinsParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams()
                
                // Agregar parámetros opcionales
                if (params.days_ahead !== undefined && Number.isFinite(params.days_ahead)) {
                    searchParams.append('days_ahead', params.days_ahead.toString())
                }
                if (params.limit !== undefined && Number.isFinite(params.limit)) {
                    searchParams.append('limit', params.limit.toString())
                }
                if (params.include_anonymous !== undefined) {
                    searchParams.append('include_anonymous', params.include_anonymous.toString())
                }
                
                const queryString = searchParams.toString()
                return queryString ? `upcoming-checkins?${queryString}` : 'upcoming-checkins'
            },
            providesTags: ['NewUpcomingCheckins'],
        }),
    }),
})

export const {
    useGetNewUpcomingCheckinsQuery,
    useLazyGetNewUpcomingCheckinsQuery,
} = newUpcomingCheckinsApi