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
const CrudStaff = lazy(() => import('./pages/panel/staff/CrudStaff'))
const StaffDashboard = lazy(() => import('./pages/panel/staff/StaffDashboard'))
const CrudTasks = lazy(() => import('./pages/panel/tasks/CrudTasks'))
const CrudTimeTracking = lazy(() => import('./pages/panel/time-tracking/CrudTimeTracking'))
const CrudSchedules = lazy(() => import('./pages/panel/schedules/CrudSchedules'))

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
                                    <CrudStaff />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/personal/dashboard"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando dashboard...</div>}>
                                    <StaffDashboard />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/tareas"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando tareas...</div>}>
                                    <CrudTasks />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/tiempo"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando tiempo...</div>}>
                                    <CrudTimeTracking />
                                </Suspense>
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/horarios"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Cargando horarios...</div>}>
                                    <CrudSchedules />
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
