import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'
import useBoxShadow from '../../../../hook/useBoxShadow'

interface Props {
    icon: ReactNode
    quantity: number
    title: string
    percent: string
    subTitle: string
    color: string
}

export default function Card({ color, icon, percent, quantity, subTitle, title }: Props) {
    return (
        <Box
            sx={{
                borderBottom: `3.5px solid ${color}`,

                boxShadow: useBoxShadow(true),
                borderRadius: '6px',
                padding: '20px 24px',
            }}
        >
            <Box display={'flex'}>
                {icon}{' '}
                <Typography color={'#444151'} fontSize={30} ml={'16px'}>
                    {quantity}
                </Typography>
            </Box>
            <Typography color={'#444151'} fontSize={15} fontWeight={300}>
                {title}
            </Typography>
            <Box display={'flex'} mt={'4px'}>
                <Typography color={'#444151'} fontSize={15} fontWeight={400}>
                    {percent}
                </Typography>
                <Typography
                    color={'#444151'}
                    fontSize={12}
                    sx={{ opacity: '0.7', ml: 1 }}
                    fontWeight={300}
                >
                    {subTitle}
                </Typography>
            </Box>
        </Box>
    )
}
