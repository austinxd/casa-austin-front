import { Box, Divider, Typography } from '@mui/material'
import {
    SpaceDashboardOutlined as SpaceDashboardOutlinedIcon,
    DateRangeOutlined as DateRangeOutlinedIcon,
    AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
    PersonOutlined as PersonOutlinedIcon,
    LoginOutlined as LoginOutlinedIcon,
} from '@mui/icons-material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { logout } from '@/services/auth/authSlice'
export default function DrawerLayout() {
    const params = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [roll, setRoll] = useState(Cookies.get('rollTkn') || '')

    const onLogOut = () => {
        dispatch(logout())
        navigate('/')
        setRoll('')
    }
    const menuItems = [
        {
            id: 1,
            text: 'Dashboard',
            icon: SpaceDashboardOutlinedIcon,
            path: '/panel/inicio',
        },
        {
            id: 2,
            text: 'Ingresos',
            icon: AttachMoneyIcon,
            path: '/panel/ingresos',
        },
        {
            id: 3,
            text: 'Disponibilidad',
            icon: DateRangeOutlinedIcon,
            path: '/panel/disponibilidad',
        },
        {
            id: 4,
            text: 'Alquileres',
            icon: AssignmentTurnedInOutlinedIcon,
            path: '/panel/alquileres',
        },
        {
            id: 5,
            text: 'Clientes',
            icon: PersonOutlinedIcon,
            path: '/panel/clientes',
        },
        {
            id: 6,
            text: 'Cerrar sesión',
            icon: LoginOutlinedIcon,
            path: '/panel/cerrar-sesion',
        },
    ]

    return (
        <div>
            <Box
                width={140}
                height={107}
                sx={{
                    mx: 'auto',
                    backgroundImage: 'url(/img/icons/logoDark.svg)',
                    backgroundSize: '100%',
                    backgroundRepeat: 'no-repeat',
                    marginTop: '43px',
                    marginBottom: '32px',
                }}
            ></Box>
            <Divider style={{ width: '90%', margin: 'auto' }} />
            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    px: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {menuItems.slice(0, 5).map(({ text, icon: Icon, path, id }) => (
                    <Box
                        key={id}
                        sx={{
                            cursor: 'pointer',
                            display:
                                roll === 'mantenimiento' && text != 'Disponibilidad'
                                    ? 'none'
                                    : 'flex',
                            px: 2,
                            py: 1,
                            mb: 1,
                            justifyContent: 'start',
                            alignItems: 'center',
                            background: params.pathname.includes(path) ? '#F5F5F5' : 'none',
                            color: params.pathname.includes(path) ? '#0E6191' : '#000F08',
                            borderRadius: '6px',
                            ':hover': {
                                background: '#F5F5F5',
                            },
                        }}
                        onClick={() => navigate(path)}
                    >
                        <Icon fontSize="small" sx={{ mr: 1.2, ml: 0 }} />
                        <Typography
                            variant="body1"
                            sx={{
                                py: 0.2,
                                color: params.pathname.includes(path) ? '#0E6191' : '#000F08',
                            }}
                        >
                            {text}
                        </Typography>
                    </Box>
                ))}
                {menuItems.slice(5, 6).map(({ text, icon: Icon, id }) => (
                    <Box
                        key={id}
                        sx={{
                            display: 'flex',
                            px: 2,
                            py: 1,
                            mb: 1,
                            justifyContent: 'start',
                            alignItems: 'center',
                            background: 'none',
                            color: '#000F08',
                            borderRadius: '6px',
                            ':hover': {
                                background: '#F5F5F5',
                                color: '#0E6191',
                                cursor: 'pointer',
                                '& .MuiTypography-root': {
                                    color: '#0E6191',
                                },
                            },
                        }}
                        onClick={onLogOut}
                    >
                        <Icon fontSize="small" sx={{ mr: 1.2, ml: 0 }} />
                        <Typography
                            sx={{
                                fontSize: '15px',
                                color: '#000F08',
                                fontWeight: 400,
                            }}
                        >
                            {text}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </div>
    )
}
