import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { UpcomingCheckinsResponse, UpcomingCheckinsQueryParams } from '@/interfaces/upcoming-checkins.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const upcomingCheckinsApi = createApi({
    reducerPath: 'upcomingCheckinsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENV.API_URL}/upcoming-checkins`,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['UpcomingCheckins'],
    endpoints: (builder) => ({
        // Obtener check-ins próximos
        getUpcomingCheckins: builder.query<UpcomingCheckinsResponse, UpcomingCheckinsQueryParams>({
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
                return queryString ? `/?${queryString}` : '/'
            },
            providesTags: ['UpcomingCheckins'],
        }),
    }),
})

export const {
    useGetUpcomingCheckinsQuery,
    useLazyGetUpcomingCheckinsQuery,
} = upcomingCheckinsApi