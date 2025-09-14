import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import {
    Schedule,
    ScheduleQueryParams,
    CreateScheduleRequest,
} from '../../interfaces/staff.interface'
import { PaginatedResponse } from '../../interfaces/api.interface'


export interface CalendarView {
    date: string
    schedules: Schedule[]
}

export const schedulesApi = createApi({
    reducerPath: 'schedulesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['Schedule'],
    endpoints: (builder) => ({
        getAllSchedules: builder.query<PaginatedResponse<Schedule>, ScheduleQueryParams>({
            query: (params) => ({
                url: '/schedules/',
                params,
            }),
            providesTags: ['Schedule'],
        }),
        createSchedule: builder.mutation<Schedule, CreateScheduleRequest>({
            query: (data) => ({
                url: '/schedules/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Schedule'],
        }),
        getCalendarView: builder.query<PaginatedResponse<CalendarView>, ScheduleQueryParams>({
            query: (params) => ({
                url: '/schedules/calendar/',
                params,
            }),
            providesTags: ['Schedule'],
        }),
    }),
})

export const {
    useGetAllSchedulesQuery,
    useCreateScheduleMutation,
    useGetCalendarViewQuery,
} = schedulesApi