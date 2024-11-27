import { Box, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import { useBoxShadow } from '@/core/utils'
import ConstructionIcon from '@mui/icons-material/Construction'
interface Props {
    icon: ReactNode
    quantity: number | string
    title: string
    color: string
    nochesMan?: number
}

export default function Card({ color, icon, quantity, title, nochesMan }: Props) {
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

                {nochesMan && (
                    <>
                        <Box display={'flex'}>
                            <ConstructionIcon
                                sx={{ color: '#808080', fontSize: { md: '32px', xs: '22px' } }}
                            />
                            <Typography
                                ml={'8px'}
                                sx={{
                                    fontSize: { md: 22, sm: 18, xs: 14 },
                                }}
                            >
                                {nochesMan}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
            <Typography
                sx={{
                    fontSize: { md: 14, sm: 12, xs: 11 },
                }}
                mt={1.3}
                fontWeight={300}
            >
                {title}
            </Typography>
        </Box>
    )
}
