import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { IDataDash } from '@/interfaces/dashboard/dashboard'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
        getDashboard: builder.query<IDataDash, { month: string; year: string }>({
            query: ({ month, year }) => ({
                url: `/dashboard?month=${month}&year=${year}`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useGetDashboardQuery } = dashboardApi
