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
import { IBest_sellers } from '../../../interfaces/dashboard/dashboard'
import { useLocation } from 'react-router-dom'

export default function CrudDashboard() {
    const params = useLocation()
    const { data, isLoading, refetch } = useGetDashboardQuery('')
    const [colorData, setColorData] = useState<string[]>([])
    const [freeDaysData, setFreeDaysData] = useState<number[]>([])
    const [sellsData, setSellsData] = useState<number[]>([])
    const [nigthsBusyData, setNigthsBusyData] = useState<number[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])
    const [sellerOrder, setSellerOrder] = useState<IBest_sellers[]>([])

    useEffect(() => {
        if (data) {
            const fullChartt = () => {
                const sortedData = [...data.free_days_per_house].sort((a, b) => {
                    const numA = parseInt(a.casa.match(/\d+/)?.[0] || '0')
                    const numB = parseInt(b.casa.match(/\d+/)?.[0] || '0')
                    return numA - numB // Ordenar ascendente
                })
                const colors = sortedData.map((item) => item.property__background_color)
                const freeDays = sortedData.map((item) => parseFloat(item.dias_libres.toFixed(1)))
                const sellssData = sortedData.map((item) =>
                    parseFloat(item.dinero_facturado.toFixed(1))
                )
                const nigthBusy = sortedData.map((item) => parseFloat(item.dias_ocupada.toFixed(1)))
                const category = sortedData.map((item) => {
                    const number = item.casa.match(/\d+/)

                    if (number) {
                        return number.toString()
                    } else {
                        return ''
                    }
                })
                setColorData(colors)
                setFreeDaysData(freeDays)
                setCategoryData(category)
                setNigthsBusyData(nigthBusy)
                setSellsData(sellssData)
                const sellerNewOrder = [...data.best_sellers].sort((a, b) => {
                    const numA = +a.ventas_soles
                    const numB = +b.ventas_soles
                    return numB - numA // Ordenar ascendente
                })

                setSellerOrder(sellerNewOrder)
            }
            fullChartt()
        }
    }, [data])

    useEffect(() => {
        refetch()
    }, [params.pathname])
    const [selectedOption, setSelectedOption] = useState<number>(1)

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
                        quantity={data?.free_days_total ? data?.free_days_total : ' '}
                        subTitle="than last week"
                        title="Total de noches libres"
                    />
                </div>

                <div className={style.item}>
                    <Card
                        color="#FFDAB7"
                        icon={<RouteIcon />}
                        percent="18%"
                        quantity={data?.ocuppied_days_total ? data?.ocuppied_days_total : ' '}
                        subTitle="than last week"
                        title="Total de noches ocupados"
                    />
                </div>
                <div className={style.item}>
                    <Card
                        color="#FFBBBD"
                        icon={<AlertIcon />}
                        percent="18%"
                        quantity={data?.dinero_por_cobrar ? `S/. ${data?.dinero_por_cobrar}` : ' '}
                        subTitle="than last week"
                        title="Dinero por cobrar"
                    />
                </div>
                <div className={style.item}>
                    <Card
                        color="#9EE5ED"
                        icon={<ClockIcon />}
                        percent="18%"
                        quantity={
                            data?.dinero_total_facturado
                                ? `S/. ${data?.dinero_total_facturado}`
                                : ' '
                        }
                        subTitle="than last week"
                        title="Total facturado"
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
                    <Box display={'flex'} gap={1} px={3} pt={3}>
                        <Typography
                            variant="h2"
                            fontSize={16}
                            sx={{
                                opacity: selectedOption === 1 ? 1 : 0.5,
                                borderBottom: selectedOption === 1 ? '2px solid #A8A8A8' : 'none',
                                cursor: 'pointer',
                            }}
                            fontWeight={500}
                            onClick={() => setSelectedOption(1)}
                        >
                            Ventas
                        </Typography>
                        <Typography
                            variant="h2"
                            fontSize={16}
                            sx={{
                                opacity: selectedOption === 2 ? 1 : 0.5,
                                borderBottom: selectedOption === 2 ? '2px solid #A8A8A8' : 'none',
                                cursor: 'pointer',
                            }}
                            fontWeight={500}
                            onClick={() => setSelectedOption(2)}
                        >
                            Disponibilidad
                        </Typography>
                        <Typography
                            variant="h2"
                            fontSize={16}
                            sx={{
                                opacity: selectedOption === 3 ? 1 : 0.5,
                                borderBottom: selectedOption === 3 ? '2px solid #A8A8A8' : 'none',
                                cursor: 'pointer',
                            }}
                            fontWeight={500}
                            onClick={() => setSelectedOption(3)}
                        >
                            Ocupacion
                        </Typography>
                    </Box>
                    {selectedOption === 1 ? (
                        <BarCharts
                            selectedOption={selectedOption}
                            isLoading={isLoading}
                            colors={colorData}
                            data={sellsData}
                            categories={categoryData}
                        />
                    ) : null}
                    {selectedOption === 2 ? (
                        <BarCharts
                            selectedOption={selectedOption}
                            isLoading={isLoading}
                            colors={colorData}
                            data={freeDaysData}
                            categories={categoryData}
                        />
                    ) : null}
                    {selectedOption === 3 ? (
                        <BarCharts
                            selectedOption={selectedOption}
                            isLoading={isLoading}
                            colors={colorData}
                            data={nigthsBusyData}
                            categories={categoryData}
                        />
                    ) : null}
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
                        Ranking de
                        <span style={{ textTransform: 'capitalize' }}>{currentMonth}</span>
                    </Typography>
                    <Divider />
                    <Box display={'flex'} justifyContent={'space-between'} px={3} py={2}>
                        <Typography variant="h2" color={'#2F2B3D'} fontSize={14}>
                            VENDEDORES
                        </Typography>
                        <Typography variant="h2" color={'#2F2B3D'} fontSize={14}>
                            PUESTO
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
                                        {item.foto_perfil ? (
                                            <img
                                                src={item.foto_perfil}
                                                width={34}
                                                height={34}
                                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                alt={' '}
                                            />
                                        ) : (
                                            <PersonIcon fontSize="medium" />
                                        )}
                                    </Box>
                                    <Box display={'flex'} flexDirection={'column'} ml={1}>
                                        <Typography variant="h2" fontSize={15}>
                                            {item.nombre ? item.nombre : ' '}
                                        </Typography>
                                        <Typography
                                            variant="h2"
                                            fontSize={13}
                                            sx={{ opacity: 0.7 }}
                                        >
                                            {item.apellido ? item.apellido : ' '}
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
                                    s/. {item.ventas_soles}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </div>
    )
}
