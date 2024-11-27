import Cookies from 'js-cookie'
import { createSlice } from '@reduxjs/toolkit'

export interface AUTH_INITIAL_STATE {
    token?: string | null
}

const token = Cookies.get('token')
const roll = Cookies.get('roll')
const idSeller = Cookies.get('idSellerAus')
const keyRefresh = Cookies.get('tokenRefresh')
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: token || null,
        roll: roll || null,
        idSeller: idSeller || null,
        keyRefresh: keyRefresh || null,
    },
    reducers: {
        logout: (state) => {
            Cookies.remove('token')
            Cookies.remove('tokenRefresh')
            Cookies.remove('rollTkn')
            Cookies.remove('idSellerAus')
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
        setIdSell: (state, { payload }) => {
            state.idSeller = payload.idSeller
            Cookies.set('idSellerAus', payload.idSeller, { expires: 7 })
        },
        setTokenRefresh: (state, { payload }) => {
            state.keyRefresh = payload.keyRefresh
            Cookies.set('tokenRefresh', payload.keyRefresh, { expires: 7 })
        },
    },
})

export const { logout, setToken, setTokenRefresh, setRoll, setIdSell } = authSlice.actions

export const authReducer = authSlice.reducer
