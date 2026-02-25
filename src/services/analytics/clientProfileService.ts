import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ClientProfileResponse, ClientProfileParams } from '@/interfaces/clientProfile.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const clientProfileApi = createApi({
    reducerPath: 'clientProfileApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENV.API_URL}/stats`,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['ClientProfile'],
    endpoints: (builder) => ({
        getClientProfile: builder.query<ClientProfileResponse, ClientProfileParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams()
                if (params.mode) searchParams.append('mode', params.mode)
                if (params.month) searchParams.append('month', params.month.toString())
                if (params.year) searchParams.append('year', params.year.toString())
                const queryString = searchParams.toString()
                return queryString ? `client-profile/?${queryString}` : 'client-profile/'
            },
            providesTags: ['ClientProfile'],
        }),
    }),
})

export const { useGetClientProfileQuery } = clientProfileApi
