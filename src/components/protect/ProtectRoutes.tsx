import { ReactNode, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import { tokenValidate } from '@/services/auth/auth'

interface Props {
  children: ReactNode
  navigateTo: string
}

export default function ProtectRoutes({ children, navigateTo }: Props) {
  const token = Cookies.get('token')
  const tokenRefresh = Cookies.get('tokenRefresh')
  const roll = Cookies.get('rollTkn')
  const { pathname } = useLocation()
  const [checking, setChecking] = useState(Boolean(token && tokenRefresh))
  const validated = useRef(false)

  useEffect(() => {
    if (validated.current) return
    validated.current = true

    let cancelled = false

    const validate = async () => {
      if (!(token && tokenRefresh)) { setChecking(false); return }
      try {
        setChecking(true)
        const res = await tokenValidate({ refresh: tokenRefresh })
        const access = res?.data?.access
        const newRefresh = res?.data?.refresh
        if (access) {
          Cookies.set('token', access, { expires: 7 })
        }
        if (newRefresh) {
          Cookies.set('tokenRefresh', newRefresh, { expires: 7 })
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        Cookies.remove('token')
        Cookies.remove('tokenRefresh')
        Cookies.remove('rollTkn')
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    validate()
    return () => { cancelled = true }
  }, [])

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px'
      }}>
        Verificando sesión...
      </div>
    )
  }
  if (!(token && tokenRefresh)) return <Navigate to={navigateTo} replace />
  if (roll === 'mantenimiento' && pathname !== '/panel/disponibilidad' && pathname !== '/panel/personal') {
    return <Navigate to="/panel/disponibilidad" replace />
  }
  return <>{children}</>
}
