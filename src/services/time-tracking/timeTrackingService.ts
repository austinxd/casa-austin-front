import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import {
    TimeTracking,
    TimeTrackingQueryParams,
} from '../../interfaces/staff.interface'

import { ApiResponse } from '../../interfaces/api.interface'

export const timeTrackingApi = createApi({
    reducerPath: 'timeTrackingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['TimeTracking'],
    endpoints: (builder) => ({
        getAllTimeTracking: builder.query<ApiResponse<TimeTracking[]>, TimeTrackingQueryParams>({
            query: (params) => ({
                url: '/time-tracking/',
                params,
            }),
            providesTags: ['TimeTracking'],
        }),
        createTimeTracking: builder.mutation<TimeTracking, FormData>({
            query: (data) => ({
                url: '/time-tracking/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['TimeTracking'],
        }),
    }),
})

export const {
    useGetAllTimeTrackingQuery,
    useCreateTimeTrackingMutation,
} = timeTrackingApi