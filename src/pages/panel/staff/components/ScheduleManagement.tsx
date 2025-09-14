import { Box, Typography, Paper, Card, CardContent, Grid } from '@mui/material'

export default function ScheduleManagement() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Gestión de Horarios
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sistema de programación de horarios de trabajo
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="primary.main" gutterBottom>
                                📅 Programación
                            </Typography>
                            <Typography variant="body2">
                                Gestionar horarios de trabajo del personal
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="secondary.main" gutterBottom>
                                ⏰ Turnos
                            </Typography>
                            <Typography variant="body2">
                                Organizar turnos de trabajo por día
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="info.main" gutterBottom>
                                📊 Reportes
                            </Typography>
                            <Typography variant="body2">
                                Ver estadísticas de horarios
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}