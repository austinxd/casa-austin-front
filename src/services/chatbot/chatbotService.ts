import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    IChatSessionsResponse,
    IChatAnalytics,
    IChatMessage,
} from '@/interfaces/chatbot/chatbot.interface'

export const chatbotService = createApi({
    reducerPath: 'chatbotService',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getChatAnalytics: builder.query<
            IChatAnalytics[],
            { from?: string; to?: string }
        >({
            query: ({ from, to }) => ({
                url: '/chatbot/analytics/',
                method: 'GET',
                params: {
                    ...(from && { from }),
                    ...(to && { to }),
                },
            }),
        }),

        getChatSessions: builder.query<
            IChatSessionsResponse,
            { page?: number; search?: string; status?: string }
        >({
            query: ({ page = 1, search = '', status = '' }) => ({
                url: '/chatbot/sessions/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: '15',
                    ...(search && { search }),
                    ...(status && { status }),
                },
            }),
        }),

        getChatMessages: builder.query<
            IChatMessage[],
            { sessionId: string; limit?: number }
        >({
            query: ({ sessionId, limit = 50 }) => ({
                url: `/chatbot/sessions/${sessionId}/messages/`,
                method: 'GET',
                params: { limit: limit.toString() },
            }),
        }),
    }),
})

export const {
    useGetChatAnalyticsQuery,
    useGetChatSessionsQuery,
    useGetChatMessagesQuery,
} = chatbotService
