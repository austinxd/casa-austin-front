import { Box, Skeleton } from '@mui/material'

export default function DashboardSkeleton() {
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

            <Box
                display={'flex'}
                flexDirection={{ md: 'row', sm: 'column', xs: 'column' }}
                mt={2}
                gap={2}
                justifyContent={'space-between'}
            >
                <Box width={'100%'} display={'flex'} gap={2}>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '50%', bgcolor: '#DADADA' }}
                        height={100}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '50%', bgcolor: '#DADADA' }}
                        height={100}
                    />
                </Box>
                <Box width={'100%'} display={'flex'} gap={2}>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '50%', bgcolor: '#DADADA' }}
                        height={100}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '50%', bgcolor: '#DADADA' }}
                        height={100}
                    />
                </Box>
            </Box>

            <Box
                display={'flex'}
                flexDirection={{ md: 'row', sm: 'column', xs: 'column' }}
                mt={2}
                gap={2}
                justifyContent={'space-between'}
            >
                <Skeleton
                    variant="rounded"
                    sx={{ width: { md: '150%', sm: '100%', xs: '100%' }, bgcolor: '#DADADA' }}
                    height={380}
                />
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={400}
                />
            </Box>
        </Box>
    )
}
