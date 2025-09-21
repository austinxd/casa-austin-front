import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Stack,
    Alert,
    CircularProgress,
    Button,
} from '@mui/material'
import {
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    PersonAdd as PersonAddIcon,
    Star as StarIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function ClientsAnalytics() {
    const [filters] = useState<StatsQueryParams>({
        period: 'week',
        date_from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        date_to: dayjs().format('YYYY-MM-DD'),
        include_anonymous: true
    })

    const { data: statsData, isLoading, error, refetch } = useGetStatsQuery(filters)

    // Configuración del gráfico de distribución de huéspedes
    const guestDistributionOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: statsData?.stats?.guest_distribution?.map(item => 
            `${item.guest_count} ${item.guest_count === 1 ? 'huésped' : 'huéspedes'}`
        ) || [],
        title: {
            text: 'Distribución por Número de Huéspedes',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745', '#ffc107', '#dc3545', '#6f42c1'],
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + '%'
            }
        },
        legend: { position: 'bottom' }
    }

    const guestDistributionSeries = statsData?.stats?.guest_distribution?.map(item => 
        item.percentage
    ) || []

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error al cargar el análisis de clientes. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon color="primary" />
                    Análisis de Comportamiento de Clientes
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => refetch()}
                    startIcon={<RefreshIcon />}
                >
                    Refrescar
                </Button>
            </Stack>

            {/* Métricas de clientes */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {statsData?.stats?.summary?.unique_searchers?.toLocaleString() || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Usuarios Activos
                                    </Typography>
                                </Box>
                                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="success.main">
                                        {statsData?.stats?.summary?.new_clients?.toLocaleString() || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Nuevos Clientes
                                    </Typography>
                                </Box>
                                <PersonAddIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="warning.main">
                                        {statsData?.stats?.search_analytics?.unique_searching_clients || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Clientes Buscadores
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="warning" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="info.main">
                                        {((statsData?.stats?.summary?.new_clients || 0) / (statsData?.stats?.summary?.unique_searchers || 1) * 100).toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ratio Nuevos
                                    </Typography>
                                </Box>
                                <StarIcon color="info" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráfico de distribución de huéspedes */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        {statsData?.stats?.guest_distribution?.length ? (
                            <Chart
                                options={guestDistributionOptions}
                                series={guestDistributionSeries}
                                type="donut"
                                height={350}
                            />
                        ) : (
                            <Alert severity="info">
                                No hay datos de distribución de huéspedes disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            📊 Insights de Comportamiento
                        </Typography>
                        
                        <Alert severity="info" sx={{ mb: 2 }}>
                            🔍 Esta sección mostrará análisis avanzados de comportamiento:
                            <br />• Patrones de búsqueda por día de semana
                            • Análisis de conversión búsqueda → reserva
                            <br />• Segmentación de clientes por actividad
                            <br />• Análisis de retención de clientes
                        </Alert>

                        {statsData?.stats?.summary && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    📈 Resumen del período:
                                </Typography>
                                <Stack spacing={1}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Total búsquedas:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {statsData.stats.summary.total_searches}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Usuarios únicos:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {statsData.stats.summary.unique_searchers}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Promedio búsquedas/usuario:</Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            {((statsData.stats.summary.total_searches || 0) / 
                                              (statsData.stats.summary.unique_searchers || 1)).toFixed(1)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}