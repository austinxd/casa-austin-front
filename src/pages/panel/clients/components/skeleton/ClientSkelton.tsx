import { Box, Skeleton } from '@mui/material'

const ClientSkelton = () => {
    return (
        <Box width={'100%'}>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Skeleton
                    variant="rounded"
                    sx={{ width: 150, mt: 2, bgcolor: '#DADADA' }}
                    height={45}
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
                <Skeleton
                    variant="rounded"
                    sx={{ width: { md: '30%', sm: '100%', xs: '100%' }, mt: 2, bgcolor: '#DADADA' }}
                    height={55}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    '@media (max-width: 1000px)': {
                        display: 'none',
                    },
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                    height={600}
                />
            </Box>
            <Box
                sx={{
                    display: 'none',
                    '@media (max-width: 1000px)': {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    },
                }}
            >
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                    height={100}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                    height={100}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                    height={100}
                />
            </Box>
        </Box>
    )
}

export default ClientSkelton
