import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ProtectAuth from './components/protect/ProtectAuth'
import ProtectRoutes from './components/protect/ProtectRoutes'
import Sidebar from './layout/panel/Sidebar'
import Login from './pages/auth/login/Login'

// Lazy loading para componentes pesados
const CrudClients = lazy(() => import('./pages/panel/clients/CrudClients'))
const CrudCalender = lazy(() => import('./pages/panel/calender/CrudCalender'))
const CrudProfits = lazy(() => import('./pages/panel/profits/CrudProfits'))
const CrudDashboard = lazy(() => import('./pages/panel/dashboard/CrudDashboard'))
const CrudRentals = lazy(() => import('./pages/panel/reservations/CrudRentals'))

// Staff Management components
const PersonalManagement = lazy(() => import('./pages/panel/staff/PersonalManagement'))

// Cotizador component
const CotizadorPage = lazy(() => import('./pages/panel/cotizador/CotizadorPage'))

// Stats components
const StatsPage = lazy(() => import('./pages/panel/stats/StatsPage'))

// Chatbot Analytics
const ChatbotAnalytics = lazy(() => import('./pages/panel/chatbot/ChatbotAnalytics'))

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectAuth navigateTo="/panel/inicio">
                            <Login />
                        </ProtectAuth>
                    }
                />
                <Route
                    path="/panel/inicio"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando...</div>}>
                                    <CrudDashboard />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/ingresos"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando...</div>}>
                                    <CrudProfits />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/disponibilidad"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando calendario...</div>}>
                                    <CrudCalender />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/alquileres"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando...</div>}>
                                    <CrudRentals />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/clientes"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando...</div>}>
                                    <CrudClients />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/personal"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando personal...</div>}>
                                    <PersonalManagement />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/cotizador"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando cotizador...</div>}>
                                    <CotizadorPage />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/stats"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando estadísticas...</div>}>
                                    <StatsPage />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/chatbot"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando chatbot...</div>}>
                                    <ChatbotAnalytics />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
