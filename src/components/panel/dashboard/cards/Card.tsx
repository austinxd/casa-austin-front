import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'
import useBoxShadow from '../../../../hook/useBoxShadow'

interface Props {
    icon: ReactNode
    quantity: number | string
    title: string
    percent: string
    subTitle: string
    color: string
}

export default function Card({ color, icon, quantity, title }: Props) {
    return (
        <Box
            sx={{
                borderBottom: `3.5px solid ${color}`,
                boxShadow: useBoxShadow(true),
                borderRadius: '6px',
                padding: '16px 20px',
                '@media screen and (max-width: 1240px)': {
                    padding: '12px 12px',
                },
                '@media screen and (max-width: 910px)': {
                    padding: '8px',
                },
            }}
        >
            <Box display={'flex'}>
                {icon}{' '}
                <Typography
                    color={'#444151'}
                    display={'flex'}
                    justifyContent={'start'}
                    alignItems={'center'}
                    ml={'16px'}
                    sx={{
                        fontSize: 23,
                        '@media screen and (max-width: 1240px)': {
                            fontSize: 19,
                            marginLeft: '12px',
                        },
                        '@media screen and (max-width: 910px)': {
                            fontSize: 16,
                            marginLeft: '4px',
                        },
                    }}
                >
                    {quantity}
                </Typography>
            </Box>
            <Typography
                color={'#444151'}
                sx={{
                    fontSize: 14,
                    '@media screen and (max-width: 1240px)': {
                        fontSize: 12,
                    },
                    '@media screen and (max-width: 910px)': {
                        fontSize: 11,
                    },
                }}
                mt={1.3}
                fontWeight={300}
            >
                {title}
            </Typography>
        </Box>
    )
}
