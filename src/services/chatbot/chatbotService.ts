import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    IChatSessionsResponse,
    IChatAnalytics,
    IChatMessage,
    IPropertyVisit,
    IPropertyVisitsResponse,
    IChatAnalysis,
    IFollowupResponse,
    IPromoDateConfig,
    IPromoDateSentResponse,
    IPromoPreview,
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
    tagTypes: ['ChatSessions', 'ChatMessages', 'PromoConfig', 'Promos', 'Visits'],
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
            providesTags: ['Visits'],
        }),

        updateVisitStatus: builder.mutation<
            IPropertyVisit,
            { visitId: string; status: string }
        >({
            query: ({ visitId, status }) => ({
                url: `/chatbot/visits/${visitId}/`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Visits'],
        }),

        getChatAnalysis: builder.query<IChatAnalysis, void>({
            query: () => ({
                url: '/chatbot/analysis/',
                method: 'GET',
            }),
        }),

        getFollowupOpportunities: builder.query<IFollowupResponse, void>({
            query: () => ({
                url: '/chatbot/followups/',
                method: 'GET',
            }),
        }),

        getPromoConfig: builder.query<IPromoDateConfig, void>({
            query: () => ({
                url: '/chatbot/promo-config/',
                method: 'GET',
            }),
            providesTags: ['PromoConfig'],
        }),

        updatePromoConfig: builder.mutation<
            IPromoDateConfig,
            Partial<IPromoDateConfig>
        >({
            query: (data) => ({
                url: '/chatbot/promo-config/',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['PromoConfig'],
        }),

        getPromos: builder.query<
            IPromoDateSentResponse,
            { page?: number; status?: string }
        >({
            query: ({ page = 1, status = '' }) => ({
                url: '/chatbot/promos/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: '15',
                    ...(status && { status }),
                },
            }),
            providesTags: ['Promos'],
        }),

        getPromoPreview: builder.query<IPromoPreview, void>({
            query: () => ({
                url: '/chatbot/promos/preview/',
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
    useUpdateVisitStatusMutation,
    useGetChatAnalysisQuery,
    useGetFollowupOpportunitiesQuery,
    useGetPromoConfigQuery,
    useUpdatePromoConfigMutation,
    useGetPromosQuery,
    useLazyGetPromoPreviewQuery,
} = chatbotService
