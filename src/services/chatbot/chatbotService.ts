import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    IChatSessionsResponse,
    IChatAnalytics,
    IChatMessage,
    IPropertyVisitsResponse,
    IChatAnalysis,
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
    tagTypes: ['ChatSessions', 'ChatMessages'],
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
            providesTags: ['ChatSessions'],
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
            providesTags: ['ChatMessages'],
        }),

        sendChatMessage: builder.mutation<
            IChatMessage,
            { sessionId: string; content: string }
        >({
            query: ({ sessionId, content }) => ({
                url: `/chatbot/sessions/${sessionId}/send/`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: ['ChatMessages', 'ChatSessions'],
        }),

        toggleChatAI: builder.mutation<
            any,
            { sessionId: string; ai_enabled: boolean }
        >({
            query: ({ sessionId, ai_enabled }) => ({
                url: `/chatbot/sessions/${sessionId}/toggle-ai/`,
                method: 'POST',
                body: { ai_enabled },
            }),
            invalidatesTags: ['ChatSessions'],
        }),

        markAsRead: builder.mutation<
            any,
            { sessionId: string }
        >({
            query: ({ sessionId }) => ({
                url: `/chatbot/sessions/${sessionId}/mark-read/`,
                method: 'POST',
            }),
            invalidatesTags: ['ChatSessions'],
        }),

        getPropertyVisits: builder.query<
            IPropertyVisitsResponse,
            { page?: number; status?: string }
        >({
            query: ({ page = 1, status = '' }) => ({
                url: '/chatbot/visits/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: '15',
                    ...(status && { status }),
                },
            }),
        }),

        getChatAnalysis: builder.query<IChatAnalysis, void>({
            query: () => ({
                url: '/chatbot/analysis/',
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetChatAnalyticsQuery,
    useGetChatSessionsQuery,
    useGetChatMessagesQuery,
    useSendChatMessageMutation,
    useToggleChatAIMutation,
    useMarkAsReadMutation,
    useGetPropertyVisitsQuery,
    useGetChatAnalysisQuery,
} = chatbotService
