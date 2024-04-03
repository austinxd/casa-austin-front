import Login from './components/ui/login/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectAuth from './components/protect/ProtectAuth'
import ProtectRoutes from './components/protect/ProtectRoutes'
import Sidebar from './sidebar/Sidebar'
import CrudDashboard from './components/panel/dashboard/CrudDashboard'
import CrudRentals from './components/panel/rentals/CrudRentals'
import CrudClients from './components/panel/clients/CrudClients'
import CrudCalender from './components/panel/availability/CrudCalender'

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
