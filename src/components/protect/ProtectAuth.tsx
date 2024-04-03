import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

interface Props {
    children: ReactNode
    navigateTo: string
}

export default function ProtectAuth({ children, navigateTo }: Props) {
    const token = Cookies.get('token')

    if (token) {
        return <Navigate to={navigateTo} />
    }

    return (
        <div>
            {token} {children}
        </div>
    )
}
