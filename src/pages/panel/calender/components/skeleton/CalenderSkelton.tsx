import { Box, Skeleton } from '@mui/material'

const CalenderSkelton = () => {
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
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
                <Skeleton
                    variant="rounded"
                    sx={{ width: { md: '30%', sm: '100%', xs: '100%' }, mt: 2, bgcolor: '#DADADA' }}
                    height={45}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', mt: 1, bgcolor: '#DADADA' }}
                    height={55}
                />
            </Box>
            <Skeleton
                variant="rounded"
                sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                height={500}
            />
            <Skeleton
                variant="rounded"
                sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                height={500}
            />
            <Skeleton
                variant="rounded"
                sx={{ width: '100%', mt: 2, bgcolor: '#DADADA' }}
                height={500}
            />
        </Box>
    )
}

export default CalenderSkelton
