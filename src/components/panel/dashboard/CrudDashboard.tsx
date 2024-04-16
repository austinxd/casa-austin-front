import { Box, Divider, Skeleton, Typography } from '@mui/material'
import Card from './cards/Card'
import TruckIcon from '../../common/icons/TruckIcon'
import style from './dashboard.module.css'
import AlertIcon from '../../common/icons/AlertIcon'
import RouteIcon from '../../common/icons/RouteIcon'
import ClockIcon from '../../common/icons/ClockIcon'
import useBoxShadow from '../../../hook/useBoxShadow'
import BarCharts from '../../common/charts/BarChart'
import PersonIcon from '@mui/icons-material/Person'
import { useGetDashboardQuery } from '../../../libs/services/dashboard/dashboardSlice'
import { useEffect, useState } from 'react'
import { ISellerDashboard } from '../../../interfaces/dashboard/dashboard'

export default function CrudDashboard() {
    const { data, isLoading } = useGetDashboardQuery('')
    const [colorData, setColorData] = useState<string[]>([])
    const [percentageData, setPercentageData] = useState<number[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])
    const [sellerOrder, setSellerOrder] = useState<ISellerDashboard[]>([])

    useEffect(() => {
        if (data) {
            const fullChartt = () => {
                const sortedData = [...data.properties_more_reserved].sort((a, b) => {
                    const numA = parseInt(a.property__name.match(/\d+/)?.[0] || '0')
                    const numB = parseInt(b.property__name.match(/\d+/)?.[0] || '0')
                    return numA - numB // Ordenar ascendente
                })
                const colors = sortedData.map((item) => item.property__background_color)
                const percent = sortedData.map((item) => parseFloat(item.percentage.toFixed(1)))
                const category = sortedData.map((item) => {
                    const number = item.property__name.match(/\d+/)

                    if (number) {
                        return number.toString()
                    } else {
                        return ''
                    }
                })
                setColorData(colors)
                setPercentageData(percent)
                setCategoryData(category)

                const sellerNewOrder = [...data.seller_more_reserved].sort((a, b) => {
                    const numA = a.seller
                    const numB = b.seller
                    return numB - numA // Ordenar ascendente
                })

                setSellerOrder(sellerNewOrder)
            }
            fullChartt()
        }
    }, [data])

    useEffect(() => {
        console.log(data, 'ddddddd')
    }, [data])

    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleString('es-ES', { month: 'long' })
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
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: useBoxShadow(true),
                    }}
                >
                    <BarCharts
                        isLoading={isLoading}
                        colors={colorData}
                        data={percentageData}
                        categories={categoryData}
                        title="Ventas"
                        title2="Disponibilidad"
                        title3="Ocupacion"
                    />
                </Box>
                <Box
                    sx={{
                        background: 'white',
                        flex: 1,
                        height: 'fit-content',
                        borderRadius: '8px',
                        boxShadow: useBoxShadow(true),
                        pb: 2,
                    }}
                >
                    <Typography variant="h2" p={3}>
                        Ranking de{' '}
                        <span style={{ textTransform: 'capitalize' }}>{currentMonth}</span>
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
                    {isLoading ? (
                        <>
                            <Skeleton
                                variant="rounded"
                                sx={{ width: '80%', mx: 'auto', mt: 2, bgcolor: '#DADADA' }}
                                height={56}
                            />{' '}
                            <Skeleton
                                variant="rounded"
                                sx={{ width: '80%', mx: 'auto', mt: 2, bgcolor: '#DADADA' }}
                                height={56}
                            />
                            <Skeleton
                                variant="rounded"
                                sx={{ width: '80%', mx: 'auto', mt: 2, bgcolor: '#DADADA' }}
                                height={56}
                            />
                        </>
                    ) : (
                        sellerOrder.map((item, index) => (
                            <Box
                                key={index}
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
                                            {item.seller__first_name}
                                        </Typography>
                                        <Typography
                                            variant="h2"
                                            fontSize={13}
                                            sx={{ opacity: 0.7 }}
                                        >
                                            {item.seller__last_name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="h2"
                                    textAlign={'center'}
                                    sx={{ opacity: 0.8 }}
                                    mr={3}
                                    fontWeight={500}
                                >
                                    {item.seller}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </div>
    )
}
