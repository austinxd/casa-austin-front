import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

interface Props {
    children: ReactNode
    navigateTo: string
}

export default function ProtectAuth({ children, navigateTo }: Props) {
    const token = Cookies.get('token')
    const tokenRefresh = Cookies.get('tokenRefresh')
    const roll = Cookies.get('rollTkn')
    
    if (token && tokenRefresh) {
        if (roll === 'mantenimiento') {
            return <Navigate to="/panel/disponibilidad" replace />
        } else {
            return <Navigate to={navigateTo} replace />
        }
    }

    return <div>{children}</div>
}