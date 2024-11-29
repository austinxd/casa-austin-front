import { Box, Skeleton } from '@mui/material'
import style from '../../rental.module.css'

const ReservationSkeleton = () => {
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
                <Skeleton variant="rounded" sx={{ mt: 2, bgcolor: '#DADADA' }} height={60} />
            </Box>
            {
                <div className={style.container} style={{ marginTop: '12px' }}>
                    {['1', '2', '3', '4', '5', '6'].map((item) => (
                        <div key={item} className={style.item}>
                            <Skeleton
                                variant="rounded"
                                sx={{ width: '100%', bgcolor: '#DADADA' }}
                                height={180}
                            />
                        </div>
                    ))}
                </div>
            }
        </Box>
    )
}

export default ReservationSkeleton
