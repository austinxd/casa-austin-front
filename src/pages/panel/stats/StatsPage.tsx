import { Box, Typography } from '@mui/material'
import StatsManagement from './components/StatsManagement'

export default function StatsPage() {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Estadísticas
            </Typography>
            
            <StatsManagement />
        </Box>
    )
}