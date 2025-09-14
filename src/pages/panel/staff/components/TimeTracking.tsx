import { Box, Typography, Paper, Card, CardContent, Grid } from '@mui/material'

export default function TimeTracking() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Seguimiento de Tiempo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sistema de registro de entradas y salidas
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" color="success.main" gutterBottom>
                                ✅ Check-In
                            </Typography>
                            <Typography variant="body2">
                                Registrar entrada al trabajo
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" color="error.main" gutterBottom>
                                🚪 Check-Out
                            </Typography>
                            <Typography variant="body2">
                                Registrar salida del trabajo
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}