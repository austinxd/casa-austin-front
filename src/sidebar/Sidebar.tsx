/* Icons */
import {
    SpaceDashboardOutlined as SpaceDashboardOutlinedIcon,
    DateRangeOutlined as DateRangeOutlinedIcon,
    AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
    PersonOutlined as PersonOutlinedIcon,
    LoginOutlined as LoginOutlinedIcon,
    Menu as MenuIcon,
} from '@mui/icons-material'
/* Material UI */
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useBoxShadow from '../hook/useBoxShadow'
import BasicModal from '../components/common/modal/BasicModal'
import LogOut from '../components/ui/logout/LogOut'
const drawerWidth = 236
const menuItems = [
    {
        id: 1,
        text: 'Dashboard',
        icon: SpaceDashboardOutlinedIcon,
        path: '/panel/inicio',
    },
    {
        id: 2,
        text: 'Disponibilidad',
        icon: DateRangeOutlinedIcon,
        path: '/panel/disponibilidad',
    },
    {
        id: 3,
        text: 'Alquileres',
        icon: AssignmentTurnedInOutlinedIcon,
        path: '/panel/alquileres',
    },
    {
        id: 4,
        text: 'Clientes',
        icon: PersonOutlinedIcon,
        path: '/panel/clientes',
    },
    {
        id: 5,
        text: 'Cerrar sesión',
        icon: LoginOutlinedIcon,
        path: '/panel/cerrar-sesion',
    },
]

interface Props {
    children: React.ReactNode
    window?: () => Window
}

export default function Sidebar(props: Props) {
    const { window, children } = props
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const params = useLocation()
    const [logOut, setLogout] = useState(false)

    const handleDrawerClose = () => {
        setIsClosing(true)
        setMobileOpen(false)
    }

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false)
    }

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen)
        }
    }

    const drawer = (
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
                {menuItems.slice(0, 4).map(({ text, icon: Icon, path, id }) => (
                    <Box
                        key={id}
                        sx={{
                            display: 'flex',
                            px: 2,
                            py: 1,
                            mb: 1,
                            justifyContent: 'start',
                            alignItems: 'center',
                            background: params.pathname.includes(path) ? '#F5F5F5' : 'none',
                            color: params.pathname.includes(path) ? '#0E6191' : '#000F08',
                            borderRadius: '6px',
                        }}
                    >
                        <Icon fontSize="small" sx={{ mr: 1.2, ml: 0 }} />
                        <Link
                            style={{
                                textDecoration: 'none',
                                fontSize: '15px',
                                color: params.pathname.includes(path) ? '#0E6191' : '#000F08',
                            }}
                            to={path}
                        >
                            {text}
                        </Link>
                    </Box>
                ))}
                {menuItems.slice(4, 5).map(({ text, icon: Icon, id }) => (
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
                        onClick={() => setLogout(true)}
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

    const container = window !== undefined ? () => window().document.body : undefined

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    display: { md: 'none', sm: 'flex', sx: 'flex' },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: 'white',
                    mb: 2,
                    boxShadow: useBoxShadow(true),
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box
                        width={60}
                        height={43}
                        sx={{
                            backgroundImage: 'url(/img/icons/logoDark.svg)',
                            backgroundSize: '100%',
                            backgroundRepeat: 'no-repeat',
                        }}
                    ></Box>

                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: 'none' }, color: '#0E6191' }}
                    >
                        <MenuIcon fontSize="large" />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                            boxShadow: useBoxShadow(true),
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                            boxShadow: useBoxShadow(true),
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { md: 3, xs: 2 },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Box sx={{ mx: 'auto', mt: { md: 0, sm: 8, xs: 8 }, maxWidth: '1200px' }}>
                    {children}
                </Box>
            </Box>

            <BasicModal open={logOut}>
                <LogOut onCancel={() => setLogout(false)} />
            </BasicModal>
        </Box>
    )
}
