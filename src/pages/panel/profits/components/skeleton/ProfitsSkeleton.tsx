import { Box, Skeleton } from '@mui/material'

const ProfitsSkeleton = () => {
    return (
        <Box width={'100%'}>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Skeleton
                    variant="rounded"
                    sx={{ width: 150, mt: 2, bgcolor: '#DADADA' }}
                    height={45}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: 80, mt: 2, bgcolor: '#DADADA' }}
                    height={45}
                />
            </Box>

            <Box mt={2}>
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={380}
                />
            </Box>
            <Box mt={2} display={{ md: 'flex', sm: 'none', xs: 'none' }}>
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={380}
                />
            </Box>
            <Box
                display={{ md: 'none', sm: 'flex', xs: 'flex' }}
                flexDirection={'column'}
                mt={2}
                gap={2}
                justifyContent={'space-between'}
            >
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={350}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={350}
                />
            </Box>
        </Box>
    )
}

export default ProfitsSkeleton
