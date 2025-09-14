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
    let timeoutId: NodeJS.Timeout
    
    const validate = async () => {
      if (!(token && tokenRefresh)) { setChecking(false); return }
      try {
        setChecking(true)
        
        // Timeout después de 8 segundos
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.warn('Token validation timed out, logging out')
            Cookies.remove('token')
            Cookies.remove('tokenRefresh')
            Cookies.remove('rollTkn')
            setChecking(false)
          }
        }, 8000)
        
        const res = await tokenValidate({ refresh: tokenRefresh })
        const access = res?.data?.access
        if (access && access !== token) {
          Cookies.set('token', access, { expires: 7 })
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        Cookies.remove('token')
        Cookies.remove('tokenRefresh')
        Cookies.remove('rollTkn')
      } finally {
        clearTimeout(timeoutId)
        if (!cancelled) setChecking(false)
      }
    }
    
    validate()
    return () => { 
      cancelled = true 
      clearTimeout(timeoutId)
    }
  }, [tokenRefresh])

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
  if (!token) return <Navigate to={navigateTo} replace />
  if (roll === 'mantenimiento' && pathname !== '/panel/disponibilidad') {
    return <Navigate to="/panel/disponibilidad" replace />
  }
  return <>{children}</>
}