import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../constants/config'
import { cookiesGetString } from '../../utils/cookie-storage'
import { IDataDash } from '../../../interfaces/dashboard/dashboard'

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
