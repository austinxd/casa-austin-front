import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

interface Props {
    children: ReactNode
    navigateTo: string
}

export default function ProtectAuth({ children, navigateTo }: Props) {
    const token = Cookies.get('token')
    const roll = Cookies.get('rollTkn')
    if (token) {
        if (roll === 'mantenimiento') {
            return <Navigate to="/panel/disponibilidad" />
        } else {
            return <Navigate to={navigateTo} />
        }
    }

    return <div>{children}</div>
}
