import { Box, Typography, Paper } from '@mui/material'

export default function StaffList() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'success.50' }}>
                <Typography variant="h4" color="success.main" gutterBottom>
                    ✅ Personal - Versión Simplificada
                </Typography>
                <Typography variant="body1">
                    El componente está funcionando correctamente con diseño básico.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Ahora podemos agregar gradualmente la funcionalidad completa.
                </Typography>
            </Paper>
        </Box>
    )
}