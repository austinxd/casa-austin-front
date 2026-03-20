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
    IUnresolvedQuestion,
    IUnresolvedQuestionsResponse,
    IAnalyticsDetailsResponse,
    ISessionsBreakdownResponse,
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
    tagTypes: ['ChatSessions', 'ChatMessages', 'PromoConfig', 'Promos', 'Visits', 'UnresolvedQuestions'],
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
            { page?: number; search?: string; status?: string; client_filter?: string }
        >({
            query: ({ page = 1, search = '', status = '', client_filter = '' }) => ({
                url: '/chatbot/sessions/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: '15',
                    ...(search && { search }),
                    ...(status && { status }),
                    ...(client_filter && { client_filter }),
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

        getFollowupOpportunities: builder.query<IFollowupResponse, { from?: string; to?: string } | void>({
            query: (params) => {
                const searchParams = new URLSearchParams()
                if (params && 'from' in params && params.from) searchParams.set('from', params.from)
                if (params && 'to' in params && params.to) searchParams.set('to', params.to)
                const qs = searchParams.toString()
                return {
                    url: `/chatbot/followups/${qs ? `?${qs}` : ''}`,
                    method: 'GET',
                }
            },
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

        getPromoPreview: builder.query<IPromoPreview, { num_days?: number } | void>({
            query: (params) => ({
                url: `/chatbot/promos/preview/${params && 'num_days' in params ? `?num_days=${params.num_days}` : ''}`,
                method: 'GET',
            }),
        }),

        getUnresolvedQuestions: builder.query<
            IUnresolvedQuestionsResponse,
            { page?: number; status?: string; category?: string }
        >({
            query: ({ page = 1, status = '', category = '' }) => ({
                url: '/chatbot/unresolved-questions/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: '10',
                    ...(status && { status }),
                    ...(category && { category }),
                },
            }),
            providesTags: ['UnresolvedQuestions'],
        }),

        updateUnresolvedQuestion: builder.mutation<
            IUnresolvedQuestion,
            { id: string; status?: string; resolution?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/chatbot/unresolved-questions/${id}/`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['UnresolvedQuestions'],
        }),

        getAnalyticsDetails: builder.query<
            IAnalyticsDetailsResponse,
            { from: string; to: string; type: 'leads' | 'conversions' | 'returning' }
        >({
            query: ({ from, to, type }) => ({
                url: '/chatbot/analytics/details/',
                method: 'GET',
                params: { from, to, type },
            }),
        }),

        getSessionsBreakdown: builder.query<
            ISessionsBreakdownResponse,
            { from: string; to: string }
        >({
            query: ({ from, to }) => ({
                url: '/chatbot/analytics/details/',
                method: 'GET',
                params: { from, to, type: 'sessions' },
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
    useLazyGetChatAnalysisQuery,
    useGetFollowupOpportunitiesQuery,
    useGetPromoConfigQuery,
    useUpdatePromoConfigMutation,
    useGetPromosQuery,
    useLazyGetPromoPreviewQuery,
    useGetUnresolvedQuestionsQuery,
    useUpdateUnresolvedQuestionMutation,
    useLazyGetAnalyticsDetailsQuery,
    useLazyGetSessionsBreakdownQuery,
} = chatbotService
