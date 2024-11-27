import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { Box } from '@mui/material'

export default function SkeletonCard() {
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
                    sx={{
                        '@media (max-width: 1400px)': {
                            display: 'none',
                        },
                    }}
                >
                    <Box display={'flex'} width={'100%'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                    </Box>
                    <Box display={'flex'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                    </Box>
                    <Box display={'flex'} width={'100%'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                    </Box>
                    <Box display={'flex'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '100%', bgcolor: '#DADADA' }}
                            height={126}
                        />
                    </Box>
                </Box>
                <Box
                    width={'100%'}
                    maxWidth={'1200px'}
                    display={'none'}
                    mx={'auto'}
                    gap={2}
                    flexDirection={'column'}
                    sx={{
                        '@media (max-width: 1400px)': {
                            display: 'flex',
                        },
                    }}
                >
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />{' '}
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={126}
                    />
                </Box>
            </Box>
        </Stack>
    )
}
