import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../constants/config'
import { cookiesGetString } from '../../utils/cookie-storage'
import { IPropertyRental, IRental, IRentalClient } from '../../../interfaces/rental/registerRental'

export const rentalApi = createApi({
    reducerPath: 'rentalApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getRentalsById: builder.query<IRentalClient, string>({
            query: (id) => ({
                url: `/reservations/${id}/`,
                method: 'GET',
            }),
        }),
        getAllRentals: builder.query<
            IRental,
            { page?: number; page_size?: number | string; search: string }
        >({
            query: ({ page = 1, page_size = 10, search = '' }) => ({
                url: '/reservations/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: page_size.toString(),
                    search: search,
                },
            }),
        }),
        getSearchRental: builder.query<IRental, string>({
            query: () => ({
                url: '/reservations/',
                method: 'GET',
            }),
        }),
        getAllProperties: builder.query<IPropertyRental, string>({
            query: () => ({
                url: '/property/',
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetRentalsByIdQuery,
    useGetAllRentalsQuery,
    useGetAllPropertiesQuery,
    useGetSearchRentalQuery,
} = rentalApi
