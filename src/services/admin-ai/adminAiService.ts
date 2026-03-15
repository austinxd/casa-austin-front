import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    IAdminChatSession,
    IAdminChatMessage,
    IChatResponse,
} from '@/interfaces/admin-ai.interface'

export const adminAiService = createApi({
    reducerPath: 'adminAiService',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    tagTypes: ['AdminSessions', 'AdminMessages'],

    endpoints: (builder) => ({
        getSessions: builder.query<IAdminChatSession[], void>({
            query: () => '/admin-ai/sessions/',
            providesTags: ['AdminSessions'],
        }),

        createSession: builder.mutation<IAdminChatSession, void>({
            query: () => ({
                url: '/admin-ai/sessions/',
                method: 'POST',
            }),
            invalidatesTags: ['AdminSessions'],
        }),

        updateSession: builder.mutation<
            IAdminChatSession,
            { id: string; title: string }
        >({
            query: ({ id, title }) => ({
                url: `/admin-ai/sessions/${id}/`,
                method: 'PATCH',
                body: { title },
            }),
            invalidatesTags: ['AdminSessions'],
        }),

        deleteSession: builder.mutation<void, string>({
            query: (id) => ({
                url: `/admin-ai/sessions/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminSessions'],
        }),

        getMessages: builder.query<IAdminChatMessage[], string>({
            query: (sessionId) => `/admin-ai/sessions/${sessionId}/messages/`,
            providesTags: (_result, _error, sessionId) => [
                { type: 'AdminMessages', id: sessionId },
            ],
        }),

        sendMessage: builder.mutation<
            IChatResponse,
            { sessionId: string; message: string }
        >({
            query: ({ sessionId, message }) => ({
                url: `/admin-ai/sessions/${sessionId}/chat/`,
                method: 'POST',
                body: { message },
            }),
            invalidatesTags: (_result, _error, { sessionId }) => [
                { type: 'AdminMessages', id: sessionId },
                'AdminSessions',
            ],
        }),
    }),
})

export const {
    useGetSessionsQuery,
    useCreateSessionMutation,
    useUpdateSessionMutation,
    useDeleteSessionMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
} = adminAiService
