import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { IPropertyRental, IRental, IRentalClient } from '@/interfaces/rental/registerRental'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
                created_today?: string
            }
        >({
            query: ({ page = 1, page_size = 10, search = '', from = '', type = '', created_today = '' }) => ({
                url: '/reservations/',
                method: 'GET',
                params: {
                    page: page.toString(),
                    page_size: page_size.toString(),
                    search: search,
                    from: from,
                    created_today: created_today,
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
        getCalenderList: builder.query<IRentalClient[], { year: string }>({
            query: ({ year }) => ({
                url: `/vistacalendario/?year=${year}`,
                method: 'GET',
            }),
        }),
        getCalendarMonth: builder.query<IRentalClient[], { year: number; month: number }>({
            query: ({ year, month }) => ({
                url: `/vistacalendario/?year=${year}&month=${month}`,
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
    useLazyGetAllRentalsForEarningsQuery,
    useGetAllPropertiesQuery,
    useGetSearchRentalQuery,
    useGetRentalForFilterQuery,
    useGetEarningsPerMonthQuery,
    useGetCalenderListQuery,
    useLazyGetCalendarMonthQuery,
    useGetContractByIdQuery,
} = rentalApi
