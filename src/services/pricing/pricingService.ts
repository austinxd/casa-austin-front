import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PricingCalculationResponse, PricingCalculationParams } from '@/interfaces/pricing.interface'
import { ENV } from '../../core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const pricingService = createApi({
    reducerPath: 'pricingService',
    baseQuery: fetchBaseQuery({
        baseUrl: ENV.API_URL,
        prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        calculatePricing: builder.query<PricingCalculationResponse, PricingCalculationParams>({
            query: (params) => ({
                url: '/properties/calculate-pricing/',
                params: {
                    check_in_date: params.check_in_date,
                    check_out_date: params.check_out_date,
                    guests: params.guests,
                },
            }),
        }),
    }),
})

export const { useCalculatePricingQuery, useLazyCalculatePricingQuery } = pricingService
