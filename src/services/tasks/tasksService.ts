import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import {
    WorkTask,
    TaskQueryParams,
    CreateTaskRequest,
    StartWorkRequest,
    PropertySummary,
} from '../../interfaces/staff.interface'

import { ApiResponse } from '../../interfaces/api.interface'

export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['Task', 'PropertySummary'],
    endpoints: (builder) => ({
        getAllTasks: builder.query<ApiResponse<WorkTask[]>, TaskQueryParams>({
            query: (params) => ({
                url: '/tasks/',
                params,
            }),
            providesTags: ['Task'],
        }),
        getTaskById: builder.query<WorkTask, string>({
            query: (id) => `/tasks/${id}/`,
            providesTags: (_result, _error, id) => [{ type: 'Task', id }],
        }),
        createTask: builder.mutation<WorkTask, CreateTaskRequest>({
            query: (data) => ({
                url: '/tasks/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Task', 'PropertySummary'],
        }),
        updateTask: builder.mutation<WorkTask, { id: string; data: Partial<WorkTask> }>({
            query: ({ id, data }) => ({
                url: `/tasks/${id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Task', id },
                'Task',
                'PropertySummary',
            ],
        }),
        startWork: builder.mutation<WorkTask, { id: string; data: StartWorkRequest }>({
            query: ({ id, data }) => ({
                url: `/tasks/${id}/start_work/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Task', id },
                'Task',
                'PropertySummary',
            ],
        }),
        completeWork: builder.mutation<WorkTask, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/tasks/${id}/complete_work/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Task', id },
                'Task',
                'PropertySummary',
            ],
        }),
        uploadTaskPhoto: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/tasks/${id}/upload-photo/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }],
        }),
        getPropertySummary: builder.query<PropertySummary[], void>({
            query: () => '/tasks/property_summary/',
            providesTags: ['PropertySummary'],
        }),
    }),
})

export const {
    useGetAllTasksQuery,
    useGetTaskByIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useStartWorkMutation,
    useCompleteWorkMutation,
    useUploadTaskPhotoMutation,
    useGetPropertySummaryQuery,
} = tasksApi