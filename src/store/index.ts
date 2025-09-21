import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../services/auth/authSlice'
import { clientApi } from '../services/clients/clientsService'
import { rentalApi } from '../services/rentals/rentalService'
import { dashboardApi } from '../services/dashboard/dashboardSlice'
import { profitsApi } from '../services/profits/profitsSlice'
import { staffApi } from '../services/staff/staffService'
import { tasksApi } from '../services/tasks/tasksService'
import { timeTrackingApi } from '../services/time-tracking/timeTrackingService'
import { schedulesApi } from '../services/schedules/schedulesService'
import { statsApi } from '../services/stats/statsService'
import { upcomingCheckinsApi } from '../services/upcoming-checkins/upcomingCheckinsService'
// Nuevos servicios de analytics
import { searchTrackingApi } from '../services/analytics/searchTrackingService'
import { ingresosApi } from '../services/analytics/ingresosService'
import { newUpcomingCheckinsApi } from '../services/analytics/newUpcomingCheckinsService'

export const store = configureStore({
    reducer: {
        auth: authReducer,

        [rentalApi.reducerPath]: rentalApi.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [profitsApi.reducerPath]: profitsApi.reducer,
        [staffApi.reducerPath]: staffApi.reducer,
        [tasksApi.reducerPath]: tasksApi.reducer,
        [timeTrackingApi.reducerPath]: timeTrackingApi.reducer,
        [schedulesApi.reducerPath]: schedulesApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        [upcomingCheckinsApi.reducerPath]: upcomingCheckinsApi.reducer,
        // Nuevos servicios de analytics
        [searchTrackingApi.reducerPath]: searchTrackingApi.reducer,
        [ingresosApi.reducerPath]: ingresosApi.reducer,
        [newUpcomingCheckinsApi.reducerPath]: newUpcomingCheckinsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            rentalApi.middleware,
            clientApi.middleware,
            dashboardApi.middleware,
            profitsApi.middleware,
            staffApi.middleware,
            tasksApi.middleware,
            timeTrackingApi.middleware,
            schedulesApi.middleware,
            statsApi.middleware,
            upcomingCheckinsApi.middleware,
            // Nuevos servicios de analytics
            searchTrackingApi.middleware,
            ingresosApi.middleware,
            newUpcomingCheckinsApi.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
