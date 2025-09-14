import { Box, Typography, Paper, Card, CardContent, Grid, Chip } from '@mui/material'

export default function TaskManagement() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Gestión de Tareas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sistema de administración de tareas de trabajo
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Chip label="Pendientes" color="warning" sx={{ mb: 2 }} />
                            <Typography variant="h4" color="warning.main">0</Typography>
                            <Typography variant="body2">Tareas pendientes</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Chip label="En Progreso" color="info" sx={{ mb: 2 }} />
                            <Typography variant="h4" color="info.main">0</Typography>
                            <Typography variant="body2">En desarrollo</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Chip label="Completadas" color="success" sx={{ mb: 2 }} />
                            <Typography variant="h4" color="success.main">0</Typography>
                            <Typography variant="body2">Finalizadas</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Chip label="Total" color="primary" sx={{ mb: 2 }} />
                            <Typography variant="h4" color="primary.main">0</Typography>
                            <Typography variant="body2">Total tareas</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}