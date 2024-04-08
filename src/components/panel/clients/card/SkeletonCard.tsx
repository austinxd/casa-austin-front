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
                        '@media (max-width: 900px)': {
                            display: 'none',
                        },
                    }}
                >
                    <Box display={'flex'} width={'100%'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '50%', bgcolor: '#DADADA' }}
                            height={57}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '50%', bgcolor: '#DADADA' }}
                            height={57}
                        />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={57}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={57}
                    />
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={57}
                    />
                    <Box display={'flex'} width={'100%'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '50%', bgcolor: '#DADADA' }}
                            height={57}
                        />
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '50%', bgcolor: '#DADADA' }}
                            height={57}
                        />
                    </Box>
                    <Box display={'flex'} width={'100%'} gap={2}>
                        <Skeleton
                            variant="rounded"
                            sx={{ width: '50%', bgcolor: '#DADADA' }}
                            height={39}
                        />
                    </Box>
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA' }}
                        height={48}
                    />
                </Box>
            </Box>
        </Stack>
    )
}
