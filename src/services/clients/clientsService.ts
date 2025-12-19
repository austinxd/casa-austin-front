import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { IListClients, IRegisterClient } from '@/interfaces/clients/registerClients'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Interfaces para búsquedas por check-in (Marketing)
export interface ISearchByClient {
    client: {
        id: string
        first_name: string
        last_name: string
        email: string
        tel_number: string
        number_doc: string
    }
    search_count: number
    searches: Array<{
        id: string
        check_in_date: string
        check_out_date: string
        guests: number
        property: {
            id: string
            name: string
        } | null
        search_timestamp: string
        ip_address: string
        user_agent?: string
    }>
}

export interface ISearchesByCheckInResponse {
    success: boolean
    check_in_date: string
    total_searches: number
    unique_clients: number
    anonymous_searches_count: number
    searches_by_client: ISearchByClient[]
    anonymous_searches_detail: Array<{
        id: string
        check_in_date: string
        check_out_date: string
        guests: number
        property: { id: string; name: string } | null
        search_timestamp: string
        ip_address: string
        session_key?: string
        user_agent?: string
        referrer?: string
    }>
}

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getClientsById: builder.query<IRegisterClient, string>({
            query: (id) => ({
                url: `/clients/${id}`,
                method: 'GET',
            }),
        }),
        getTokenForClient: builder.query<{ token: string }, string>({
            query: () => ({
                url: `/get-api-token-clients/`,
                method: 'GET',
            }),
        }),
        getAllClients: builder.query<
            IListClients,
            { page?: number; page_size?: number | string; search: string; ordering?: string }
        >({
            query: ({ page = 1, page_size = 10, search = '', ordering = '' }) => ({
                url: '/clients/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: page_size.toString(),
                    search: search,
                    ...(ordering && { ordering }),
                },
            }),
        }),
        // Búsquedas por fecha de check-in (Marketing)
        getSearchesByCheckIn: builder.query<
            ISearchesByCheckInResponse,
            { date: string; include_anonymous?: boolean; property_id?: string }
        >({
            query: ({ date, include_anonymous = true, property_id }) => ({
                url: '/clients/searches-by-checkin/',
                method: 'GET',
                params: {
                    date,
                    include_anonymous: include_anonymous.toString(),
                    ...(property_id && { property_id }),
                },
            }),
        }),
    }),
})

export const {
    useGetClientsByIdQuery,
    useGetAllClientsQuery,
    useGetTokenForClientQuery,
    useGetSearchesByCheckInQuery,
} = clientApi
