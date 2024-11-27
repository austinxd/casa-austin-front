import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import { tokenValidate } from '@/services/auth/auth'

interface Props {
    children: ReactNode
    navigateTo: string
}

export default function ProtectRoutes({ children, navigateTo }: Props) {
    const token = Cookies.get('token')
    const params = useLocation()
    const tokenRefresh = Cookies.get('tokenRefresh')
    const roll = Cookies.get('rollTkn')
    useEffect(() => {
        const checkTokenValidity = async () => {
            if (tokenRefresh && token) {
                try {
                    const response = await tokenValidate({ refresh: tokenRefresh })
                    if (response.data.access === token) {
                    } else {
                        Cookies.set('token', response.data.access, { expires: 7 })
                    }
                } catch (error) {
                    console.error('Error al validar el token de actualización:', error)
                }
            }
        }

        checkTokenValidity()
    }, [token, params.pathname])

    if (token && roll === 'mantenimiento' && params.pathname != '/panel/disponibilidad') {
        return <Navigate to={navigateTo} />
    }
    if (!token) {
        return <Navigate to={navigateTo} />
    }

    return <div>{children}</div>
}
