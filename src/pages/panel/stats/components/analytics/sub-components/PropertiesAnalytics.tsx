import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Alert,
    Button,
    Stack,
} from '@mui/material'
import {
    Home as HomeIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'

export default function PropertiesAnalytics() {
    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeIcon color="primary" />
                        Análisis de Propiedades
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                    >
                        Refrescar
                    </Button>
                </Stack>
                
                <Alert severity="info">
                    🏠 Esta sección está en desarrollo. Aquí se mostrarán análisis detallados de cada propiedad:
                    <br />• Ranking de propiedades por ingresos
                    • Comparativa de ocupación por propiedad
                    • Heatmap de ocupación
                    • Análisis de RevPAR (Revenue per Available Room)
                    <br />Los datos provendrán del endpoint de estadísticas comprehensivas.
                </Alert>
            </Paper>
        </Box>
    )
}