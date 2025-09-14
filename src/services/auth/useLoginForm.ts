import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setRoll, setToken, setTokenRefresh, setIdSell } from './authSlice'

import { login } from './auth'
import { ILogin } from '@/interfaces/auth/loginCredentials'

export const useLoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILogin>()

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const dispatch = useDispatch()

    const onLoginUser = async (data: ILogin) => {
        try {
            setIsLoading(true)
            const response = await login(data)
            if (response.status === 200) {
                const key = response?.data.access
                const keyRefresh = response?.data.refresh
                const idSell = response?.data.id
                dispatch(setToken({ token: key }))
                dispatch(setTokenRefresh({ keyRefresh: keyRefresh }))
                dispatch(setIdSell({ idSeller: idSell }))
                dispatch(setRoll({ roll: response.data.groups[0] }))
                if (response.data.groups[0] === 'mantenimiento') {
                    navigate('/panel/disponibilidad')
                } else {
                    navigate('/panel/inicio')
                }
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Las credenciales son incorrectas')
            }
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        register,
        handleSubmit: handleSubmit(onLoginUser),
        errors,
        isLoading,
        errorMessage,
        setErrorMessage,
    }
}
