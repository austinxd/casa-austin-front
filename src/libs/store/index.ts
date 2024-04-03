import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../services/auth/authSlice'
import { clientApi } from '../services/clients/clientsService'
import { rentalService } from '../services/rentals/rentalService'

export const store = configureStore({
    reducer: {
        auth: authReducer,

        [rentalService.reducerPath]: rentalService.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(rentalService.middleware, clientApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
