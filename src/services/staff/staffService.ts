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
        getAllStaff: builder.query<ApiResponse<StaffMember[]>, StaffQueryParams>({
            query: (params) => ({
                url: '/staff/',
                params,
            }),
            providesTags: ['Staff'],
        }),
        getStaffById: builder.query<StaffMember, string>({
            query: (id) => `/staff/${id}/`,
            providesTags: (_result, _error, id) => [{ type: 'Staff', id }],
        }),
        createStaff: builder.mutation<StaffMember, FormData>({
            query: (data) => ({
                url: '/staff/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Staff', 'StaffDashboard'],
        }),
        updateStaff: builder.mutation<StaffMember, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/staff/${id}/`,
                method: 'PUT',
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
                url: `/staff/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Staff', 'StaffDashboard'],
        }),
        getStaffDashboard: builder.query<StaffDashboard, void>({
            query: () => '/staff/dashboard/',
            providesTags: ['StaffDashboard'],
        }),
        getStaffTasks: builder.query<ApiResponse<WorkTask[]>, string>({
            query: (id) => `/staff/${id}/tasks/`,
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