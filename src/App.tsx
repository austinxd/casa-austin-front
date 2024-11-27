import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectAuth from './components/protect/ProtectAuth'
import ProtectRoutes from './components/protect/ProtectRoutes'
import Sidebar from './layout/panel/Sidebar'

import CrudClients from './pages/panel/clients/CrudClients'
import CrudCalender from './pages/panel/calender/CrudCalender'
import CrudProfits from './pages/panel/profits/CrudProfits'
import Login from './pages/auth/login/Login'
import CrudDashboard from './pages/panel/dashboard/CrudDashboard'
import CrudRentals from './pages/panel/reservations/CrudRentals'

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
                                <CrudDashboard />
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/ingresos"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <CrudProfits />
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/disponibilidad"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <CrudCalender />
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/alquileres"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <CrudRentals />
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
                <Route
                    path="/panel/clientes"
                    element={
                        <ProtectRoutes navigateTo="/">
                            <Sidebar>
                                <CrudClients />
                            </Sidebar>
                        </ProtectRoutes>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
