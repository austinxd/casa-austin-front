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
            }}
        >
            <Box display={'flex'}>
                {icon}{' '}
                <Typography color={'#444151'} mt={0.4} fontSize={{ md: 23, xs: 14 }} ml={'16px'}>
                    {quantity}
                </Typography>
            </Box>
            <Typography color={'#444151'} fontSize={{ md: 14, xs: 10 }} mt={1} fontWeight={300}>
                {title}
            </Typography>
            {/*             <Box display={'flex'} mt={'4px'}>
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
            </Box> */}
        </Box>
    )
}
