import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import {
    StaffMember,
    StaffQueryParams,
    StaffDashboard,
    WorkTask,
} from '../../interfaces/staff.interface'

import { ApiResponse } from '../../interfaces/api.interface'

export const staffApi = createApi({
    reducerPath: 'staffApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['Staff', 'StaffDashboard'],
    endpoints: (builder) => ({
        getAllStaff: builder.query<StaffMember[], StaffQueryParams>({
            query: (params) => ({
                url: '/api/v1/staff/',
                params,
            }),
            providesTags: ['Staff'],
        }),
        getStaffById: builder.query<StaffMember, string>({
            query: (id) => `/api/v1/staff/${id}/`,
            providesTags: (_result, _error, id) => [{ type: 'Staff', id }],
        }),
        createStaff: builder.mutation<StaffMember, FormData>({
            query: (data) => ({
                url: '/api/v1/staff/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Staff', 'StaffDashboard'],
        }),
        updateStaff: builder.mutation<StaffMember, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/api/v1/staff/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Staff', id },
                'Staff',
                'StaffDashboard',
            ],
        }),
        deleteStaff: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/v1/staff/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Staff', 'StaffDashboard'],
        }),
        getStaffDashboard: builder.query<StaffDashboard[], void>({
            query: () => '/api/v1/staff/dashboard/',
            providesTags: ['StaffDashboard'],
        }),
        getStaffTasks: builder.query<WorkTask[], string>({
            query: (id) => `/api/v1/staff/${id}/tasks/`,
            providesTags: (_result, _error, id) => [{ type: 'Staff', id }],
        }),
    }),
})

export const {
    useGetAllStaffQuery,
    useGetStaffByIdQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
    useGetStaffDashboardQuery,
    useGetStaffTasksQuery,
} = staffApi