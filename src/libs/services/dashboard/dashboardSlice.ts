import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../constants/config'
import { cookiesGetString } from '../../utils/cookie-storage'

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getDashboard: builder.query<any, string>({
            query: () => ({
                url: `/dashboard/`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useGetDashboardQuery } = dashboardApi
