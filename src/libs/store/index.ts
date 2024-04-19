import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../services/auth/authSlice'
import { clientApi } from '../services/clients/clientsService'
import { rentalApi } from '../services/rentals/rentalService'
import { dashboardApi } from '../services/dashboard/dashboardSlice'
import { profitsApi } from '../services/profits/profitsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,

        [rentalApi.reducerPath]: rentalApi.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [profitsApi.reducerPath]: profitsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            rentalApi.middleware,
            clientApi.middleware,
            dashboardApi.middleware,
            profitsApi.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
