import { ReactNode, useEffect, useState } from 'react'
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

  useEffect(() => {
    let cancelled = false
    const validate = async () => {
      if (!(token && tokenRefresh)) { setChecking(false); return }
      try {
        setChecking(true)
        const res = await tokenValidate({ refresh: tokenRefresh })
        const access = res?.data?.access
        if (access && access !== token) {
          Cookies.set('token', access, { expires: 7 })
        }
      } catch {
        Cookies.remove('token')
        Cookies.remove('tokenRefresh')
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    validate()
    return () => { cancelled = true }
  }, [tokenRefresh])

  if (checking) return null
  if (!token) return <Navigate to={navigateTo} replace />
  if (roll === 'mantenimiento' && pathname !== '/panel/disponibilidad') {
    return <Navigate to="/panel/disponibilidad" replace />
  }
  return <>{children}</>
}