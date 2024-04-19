import Cookies from 'js-cookie'
import { createSlice } from '@reduxjs/toolkit'

export interface AUTH_INITIAL_STATE {
    token?: string | null
}

const token = Cookies.get('token')
const roll = Cookies.get('roll')
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: token || null,
        roll: roll || null,
    },
    reducers: {
        logout: (state) => {
            Cookies.remove('token')
            Cookies.remove('tokenRefresh')
            Cookies.remove('roll')
            state.token = null
        },
        setToken: (state, { payload }) => {
            state.token = payload.token
            Cookies.set('token', payload.token, { expires: 7 })
        },
        setRoll: (state, { payload }) => {
            state.roll = payload.roll
            Cookies.set('rollTkn', payload.roll, { expires: 7 })
        },
        setTokenRefresh: (state, { payload }) => {
            state.token = payload.token
            Cookies.set('tokenRefresh', payload.token, { expires: 7 })
        },
    },
})

export const { logout, setToken, setTokenRefresh, setRoll } = authSlice.actions

export const authReducer = authSlice.reducer
