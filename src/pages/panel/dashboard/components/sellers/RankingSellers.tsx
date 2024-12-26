import { Box, Divider, Typography, useTheme } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import { useBoxShadow } from '@/core/utils'
import { useEffect, useState } from 'react'
import { IBest_sellers, IDataDash } from '@/interfaces/dashboard/dashboard'
import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'

interface Props {
    monthNames: string[]
    selectedMonth: number
    data: IDataDash | undefined
    currentYear: number
}

export default function RankingSellers({ monthNames, selectedMonth, data, currentYear }: Props) {
    const [sellerOrder, setSellerOrder] = useState<IBest_sellers[]>([])
    const { palette } = useTheme()
    const params = useLocation()
    const [roll, setRoll] = useState(Cookies.get('rollTkn') || '')
    const [idSeller, setIdSeller] = useState(Cookies.get('idSellerAus') || '')

    useEffect(() => {
        if (data) {
            const fullChartt = () => {
                const sellerNewOrder = [...data.best_sellers].sort((a, b) => {
                    const numA = +a.ventas_soles
                    const numB = +b.ventas_soles
                    return numB - numA // Ordenar ascendente
                })

                setSellerOrder(sellerNewOrder)
            }
            fullChartt()
        }
    }, [data, selectedMonth, currentYear])

    useEffect(() => {
        setRoll(Cookies.get('rollTkn') || '')
        setIdSeller(Cookies.get('idSellerAus') || '')
    }, [params.pathname, selectedMonth, currentYear])
    return (
        <Box
            sx={{
                background: palette.primary.contrastText,
                flex: 1,
                height: 'fit-content',
                borderRadius: 2,
                boxShadow: useBoxShadow(true),
                pb: 2,
            }}
        >
            <Typography variant="h2" p={3}>
                Ranking de
                <span style={{ marginLeft: '4px', textTransform: 'capitalize' }}>
                    {monthNames[selectedMonth - 1]}
                </span>
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
            {sellerOrder.map((item, index) => (
                <Box
                    key={index}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    px={3}
                    py={1.5}
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
                            <Typography variant="h2" fontSize={13} sx={{ opacity: 0.7 }}>
                                {item.apellido ? item.apellido : ' '}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="h2"
                        fontSize={16}
                        textAlign={'center'}
                        sx={{ opacity: 0.8 }}
                        mr={0}
                        fontWeight={500}
                    >
                        {roll === 'vendedor' ? (
                            item.id === 8 ? (
                                <>S/. {new Intl.NumberFormat('es-PE').format(+item.ventas_soles)}</>
                            ) : (
                                <>
                                    {+idSeller === +item.id ? (
                                        <>
                                            {' '}
                                            s/.{' '}
                                            {new Intl.NumberFormat('es-PE').format(
                                                +item.ventas_soles
                                            )}
                                        </>
                                    ) : (
                                        <Typography sx={{ filter: 'blur(3px)' }}>
                                            S/ Dinero
                                        </Typography>
                                    )}
                                </>
                            )
                        ) : (
                            <Typography fontWeight={500}>
                                S/ {new Intl.NumberFormat('es-PE').format(+item.ventas_soles)}
                            </Typography>
                        )}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}
