import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../constants/config'
import { cookiesGetString } from '../../utils/cookie-storage'
import { IListClients, IRegisterClient } from '../../../interfaces/clients/registerClients'

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
        getAllClients: builder.query<
            IListClients,
            { page?: number; page_size?: number | string; search: string }
        >({
            query: ({ page = 1, page_size = 10, search = '' }) => ({
                url: '/clients/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: page_size.toString(),
                    search: search,
                },
            }),
        }),
    }),
})

export const { useGetClientsByIdQuery, useGetAllClientsQuery } = clientApi
