import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { Box } from '@mui/material'

export default function SkeletonFormRental() {
    return (
        <Stack>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    width={'100%'}
                    maxWidth={'1200px'}
                    display={'flex'}
                    mx={'auto'}
                    gap={2}
                    flexDirection={'column'}
                >
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={56}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={56}
                    />
                    <Box display={'flex'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={56}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={56}
                        />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={56}
                    />
                    <Box display={'flex'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={56}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={56}
                        />
                    </Box>
                    <Box display={'flex'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={56}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={56}
                        />
                    </Box>
                    <Box display={'flex'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: 80, bgcolor: '#DADADA' }}
                            height={80}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: 80, bgcolor: '#DADADA' }}
                            height={80}
                        />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', mt: 1, bgcolor: '#DADADA' }}
                        height={45}
                    />
                </Box>
            </Box>
        </Stack>
    )
}
