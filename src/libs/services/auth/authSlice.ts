import Cookies from 'js-cookie'
import { createSlice } from '@reduxjs/toolkit'

export interface AUTH_INITIAL_STATE {
    token?: string | null
}

const token = Cookies.get('token')

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: token || null,
    },
    reducers: {
        logout: (state) => {
            Cookies.remove('token')
            Cookies.remove('tokenRefresh')
            state.token = null
        },
        setToken: (state, { payload }) => {
            state.token = payload.token
            Cookies.set('token', payload.token, { expires: 7 })
        },
        setTokenRefresh: (state, { payload }) => {
            state.token = payload.token
            Cookies.set('tokenRefresh', payload.token, { expires: 7 })
        },
    },
})

export const { logout, setToken, setTokenRefresh } = authSlice.actions

export const authReducer = authSlice.reducer
