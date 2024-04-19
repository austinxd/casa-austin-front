import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { tokenValidate } from '../../libs/services/auth/auth'
interface Props {
    children: ReactNode
    navigateTo: string
}

export default function ProtectRoutes({ children, navigateTo }: Props) {
    const token = Cookies.get('token')

    const tokenRefresh = Cookies.get('tokenRefresh')

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
    }, [token])

    /*     if (token && roll === 'mantenimiento') {
            return <Navigate to="/panel/disponibilidad/" />
        } */

    if (!token) {
        return <Navigate to={navigateTo} />
    }

    return <div>{children}</div>
}
