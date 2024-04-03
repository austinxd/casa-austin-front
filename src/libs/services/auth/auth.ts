import { ILogin } from '../../../interfaces/auth/loginCredentials'
import { casaApi } from '../../api/casaApi'

interface IRefresh {
    refresh: string
}

export const login = async (payload: ILogin) => {
    return await casaApi.post('/login/', payload)
}

export const tokenValidate = async (payload: IRefresh) => {
    return await casaApi.post('/token/refresh/', payload)
}
