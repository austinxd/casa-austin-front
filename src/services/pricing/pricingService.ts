import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PricingCalculationResponse, PricingCalculationParams, LateCheckoutResponse, LateCheckoutParams } from '@/interfaces/pricing.interface'
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
                url: '/properties/calculate-pricing-erp/',
                params: {
                    check_in_date: params.check_in_date,
                    check_out_date: params.check_out_date,
                    guests: params.guests,
                    ...(params.client_id && { client_id: params.client_id }),
                },
            }),
        }),
        calculateLateCheckout: builder.query<LateCheckoutResponse, LateCheckoutParams>({
            query: (params) => ({
                url: '/properties/calculate-late-checkout/',
                params: {
                    property_id: params.property_id,
                    checkout_date: params.checkout_date,
                    guests: params.guests,
                },
            }),
        }),
    }),
})

export const { useCalculatePricingQuery, useLazyCalculatePricingQuery, useLazyCalculateLateCheckoutQuery } = pricingService
