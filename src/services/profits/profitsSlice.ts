import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'
import { IDataProfits } from '@/interfaces/profits/profits'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const profitsApi = createApi({
    reducerPath: 'profitsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getProfits: builder.query<IDataProfits, string>({
            query: () => ({
                url: `/profit/`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useGetProfitsQuery } = profitsApi
