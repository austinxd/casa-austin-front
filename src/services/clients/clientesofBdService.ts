import { IListClientsByBD } from '@/interfaces/clients/registerClients'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({
        baseUrl:
            'https://script.googleusercontent.com/macros/echo?user_content_key=yd_NofUSXkOYOGyPRJ54Yb2J8HDfuHJdQx4vK7QW7f4hO8SLu6AQvXU9QyX9Kdf3pTK5KbLlduSlbyU9uUAD31X6-0wlpTG-https://script.google.com/macros/s/AKfycbwo__qdJpcxEcpfORq8O2-jLTLKqJCwO2xabWmopYDuUUbflsE6TebicurSe_B5Oh-Q',
        /*   prepareHeaders: (headers: any) => {
            headers.set('Authorization', `Bearer ${cookiesGetString('token')}`)
            return headers
        }, */
    }),
    endpoints: (builder) => ({
        getClientsByBD: builder.query<
            IListClientsByBD,
            { typeDocument: string; numberDocument: string; token: string }
        >({
            query: ({ typeDocument, numberDocument, token }) => ({
                url: `/exec?op=${typeDocument}&token=${token}&formato=json&documento=${numberDocument}-Di4Rzh63woSPA&lib=MeyLD1o3zdaC3xKC2PS-3a4-1FVASwI9k/`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useGetClientsByBDQuery } = clientApi
