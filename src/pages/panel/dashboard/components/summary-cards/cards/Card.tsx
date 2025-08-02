import { Box, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import { useBoxShadow } from '@/core/utils'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
interface Props {
    icon: ReactNode
    quantity: number | string
    title: string
    color: string
    nigthReserv?: number
}

export default function Card({ color, icon, quantity, title, nigthReserv }: Props) {
    const { palette } = useTheme()
    return (
        <Box
            sx={{
                borderBottom: `3.5px solid ${color}`,
                background: palette.primary.contrastText,
                boxShadow: useBoxShadow(true),
                borderRadius: 2,
                padding: '16px 20px',
                '@media screen and (max-width: 1240px)': {
                    padding: '12px 12px',
                },
                '@media screen and (max-width: 910px)': {
                    padding: '8px',
                },
            }}
        >
            <Box display={'flex'} gap={2}>
                <Box display={'flex'}>
                    {icon}
                    <Typography
                        ml={'8px'}
                        sx={{
                            fontSize: { md: 22, sm: 18, xs: 14 },
                        }}
                    >
                        {quantity}
                    </Typography>
                </Box>

                {nigthReserv && (
                    <>
                        <Box display={'flex'}>
                            <EventBusyOutlinedIcon
                                sx={{ color: '#ff1744', fontSize: { md: '34px', xs: '22px' } }}
                            />
                            <Typography
                                ml={'8px'}
                                sx={{
                                    fontSize: { md: 22, sm: 18, xs: 14 },
                                }}
                            >
                                {nigthReserv}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
            <Box display={'flex'}>
                <Typography
                    sx={{
                        fontSize: { md: 14, sm: 12, xs: 11 },
                    }}
                    mt={1.3}
                    fontWeight={300}
                >
                    {title}
                </Typography>
                {nigthReserv && (
                    <Typography
                        sx={{
                            fontSize: { md: 14, sm: 12, xs: 11 },
                        }}
                        ml={0.5}
                        mt={1.3}
                        fontWeight={300}
                    >
                        | Ocupadas
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
