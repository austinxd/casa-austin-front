import { Box, Divider, Typography } from '@mui/material'
import Card from './cards/Card'
import TruckIcon from '../../common/icons/TruckIcon'
import style from './dashboard.module.css'
import AlertIcon from '../../common/icons/AlertIcon'
import RouteIcon from '../../common/icons/RouteIcon'
import ClockIcon from '../../common/icons/ClockIcon'
import useBoxShadow from '../../../hook/useBoxShadow'
import BarCharts from '../../common/charts/BarChart'
import PersonIcon from '@mui/icons-material/Person'

export default function CrudDashboard() {
    return (
        <div>
            <Typography variant="h1" mb={3}>
                Dashboard
            </Typography>
            <div className={style.container}>
                <div className={style.item}>
                    <Card
                        color="#7367F0"
                        icon={<TruckIcon />}
                        percent="18%"
                        quantity={12}
                        subTitle="than last week"
                        title="Número de ventas"
                    />
                </div>

                <div className={style.item}>
                    <Card
                        color="#FFDAB7"
                        icon={<AlertIcon />}
                        percent="18%"
                        quantity={12}
                        subTitle="than last week"
                        title="Ventas restantes"
                    />
                </div>
                <div className={style.item}>
                    <Card
                        color="#FFBBBD"
                        icon={<RouteIcon />}
                        percent="18%"
                        quantity={12}
                        subTitle="than last week"
                        title="Deviated from route"
                    />
                </div>
                <div className={style.item}>
                    <Card
                        color="#9EE5ED"
                        icon={<ClockIcon />}
                        percent="18%"
                        quantity={12}
                        subTitle="than last week"
                        title="Late vehicles"
                    />
                </div>
            </div>
            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    mt: 3,
                    '@media (max-width: 1100px)': {
                        flexDirection: 'column',
                    },
                }}
            >
                <Box
                    sx={{
                        background: 'white',
                        flex: 2,
                        height: 122,
                        borderRadius: '8px',
                        boxShadow: useBoxShadow(true),
                    }}
                >
                    <BarCharts title="Ventas por casas" />
                </Box>
                <Box
                    sx={{
                        background: 'white',
                        flex: 1,
                        borderRadius: '8px',
                        boxShadow: useBoxShadow(true),
                        pb: 2,
                    }}
                >
                    <Typography variant="h2" p={3}>
                        Vendedores populares
                    </Typography>
                    <Divider />
                    <Box display={'flex'} justifyContent={'space-between'} px={3} py={2}>
                        <Typography variant="h2" color={'#2F2B3D'} fontSize={14}>
                            VENDEDORES
                        </Typography>
                        <Typography variant="h2" color={'#2F2B3D'} fontSize={14}>
                            NÚMERO
                        </Typography>
                    </Box>
                    <Divider />
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        px={3}
                        py={2}
                    >
                        <Box display={'flex'} justifyContent={'center'}>
                            <Box
                                sx={{
                                    height: 34,
                                    width: 34,
                                    background: '#EFEFEF',
                                    borderRadius: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <PersonIcon fontSize="medium" />
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} ml={1}>
                                <Typography variant="h2" fontSize={15}>
                                    Titulo
                                </Typography>
                                <Typography variant="h2" fontSize={13} sx={{ opacity: 0.7 }}>
                                    Subtitulo
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h2" fontWeight={500}>
                            33
                        </Typography>
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        px={3}
                        py={1}
                    >
                        <Box display={'flex'} justifyContent={'center'}>
                            <Box
                                sx={{
                                    height: 34,
                                    width: 34,
                                    background: '#EFEFEF',
                                    borderRadius: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <PersonIcon fontSize="medium" />
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} ml={1}>
                                <Typography variant="h2" fontSize={15}>
                                    Titulo
                                </Typography>
                                <Typography variant="h2" fontSize={13} sx={{ opacity: 0.7 }}>
                                    Subtitulo
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h2" fontWeight={500}>
                            33
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
