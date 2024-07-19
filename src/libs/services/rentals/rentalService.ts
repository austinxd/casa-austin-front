import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ENV } from '../../constants/config'
import { cookiesGetString } from '../../utils/cookie-storage'
import { IPropertyRental, IRental, IRentalClient } from '../../../interfaces/rental/registerRental'
type MonthNameToNumber = {
    [monthName: string]: string
}
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
        getContractById: builder.query<IRentalClient, string>({
            query: (id) => ({
                url: `/reservations/${id}/contrato/`,
                method: 'GET',
            }),
        }),
        getAllRentals: builder.query<
            IRental,
            {
                page?: number
                page_size?: number | string
                search: string
                from: string
                type: string
            }
        >({
            query: ({ page = 1, page_size = 10, search = '', from = '', type = '' }) => ({
                url: '/reservations/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: page_size.toString(),
                    search: search,
                    from: from,
                    type: type,
                },
            }),
        }),
        getAllRentalsForEarnings: builder.query<
            IRental,
            {
                page?: number
                page_size?: number | string
                search: string
                month: number
                year: number
                type: string
                exclude: string
                from_check_in: boolean
            }
        >({
            query: ({
                page = 1,
                page_size = 10,
                search = '',
                year = 2024,
                month = 1,
                type = '',
                exclude = 'man',
                from_check_in = true,
            }) => ({
                url: '/reservations/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: page_size.toString(),
                    search: search,
                    year: year,
                    month: month,
                    type: type,
                    exclude: exclude,
                    from_check_in: from_check_in,
                },
            }),
        }),

        getRentalForFilter: builder.query<IRental, {}>({
            query: () => ({
                url: '/reservations/',
                method: 'GET',
            }),
        }),
        getSearchRental: builder.query<IRental, string>({
            query: () => ({
                url: '/reservations/',
                method: 'GET',
            }),
        }),
        getCalenderList: builder.query<IRental, string>({
            query: () => ({
                url: '/vistacalendario/',
                method: 'GET',
            }),
        }),
        getAllProperties: builder.query<IPropertyRental, string>({
            query: () => ({
                url: '/property/',
                method: 'GET',
            }),
        }),
        getEarningsPerMonth: builder.query<
            MonthNameToNumber,
            {
                year: number
            }
        >({
            query: ({ year = 2024 }) => ({
                url: '/profit-resume/',
                method: 'GET',
                params: {
                    year: year,
                },
            }),
        }),
    }),
})

export const {
    useGetRentalsByIdQuery,
    useGetAllRentalsQuery,
    useGetAllRentalsForEarningsQuery,
    useGetAllPropertiesQuery,
    useGetSearchRentalQuery,
    useGetRentalForFilterQuery,
    useGetEarningsPerMonthQuery,
    useGetCalenderListQuery,
    useGetContractByIdQuery,
} = rentalApi
