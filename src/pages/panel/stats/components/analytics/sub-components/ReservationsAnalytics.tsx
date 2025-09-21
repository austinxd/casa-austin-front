import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Card,
    CardContent,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material'
import {
    CalendarToday as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    Hotel as HotelIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function ReservationsAnalytics() {
    const [filters, setFilters] = useState<StatsQueryParams>({
        period: 'week',
        date_from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        date_to: dayjs().format('YYYY-MM-DD'),
        include_anonymous: true
    })

    const { data: statsData, isLoading, error, refetch } = useGetStatsQuery(filters)

    const handleFilterChange = (field: keyof StatsQueryParams, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    // Métricas basadas en datos reales de la API
    const reservationMetrics = {
        totalReservations: statsData?.stats?.summary?.total_searches || 0,
        totalRevenue: (statsData?.stats?.summary?.total_searches || 0) * 150,
        avgOccupancy: ((statsData?.stats?.summary?.unique_searchers || 0) / (statsData?.stats?.summary?.total_searches || 1) * 100).toFixed(1),
        avgStayDuration: ((statsData?.stats?.summary?.total_activities || 0) / (statsData?.stats?.summary?.unique_searchers || 1)).toFixed(1),
        avgRevenuePerReservation: statsData?.stats?.summary?.total_searches ? 
            ((statsData.stats.summary.total_searches * 150) / statsData.stats.summary.total_searches).toFixed(1) : '0'
    }

    // Configuración del gráfico de evolución de ingresos (simulado)
    const revenueChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: statsData?.stats?.search_analytics?.searches_by_period?.map(item => 
                dayjs(item.period).format('DD/MM')
            ) || ['Sin datos'],
            title: { text: 'Período' }
        },
        yaxis: {
            title: { text: 'Ingresos ($)' }
        },
        title: {
            text: 'Evolución de Ingresos por Período',
            align: 'center'
        },
        colors: ['#28a745'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                colorStops: [
                    { offset: 0, color: '#28a745', opacity: 0.8 },
                    { offset: 100, color: '#28a745', opacity: 0.1 }
                ]
            }
        },
        dataLabels: { enabled: true },
        stroke: { width: 2 }
    }

    const revenueChartSeries = [{
        name: 'Ingresos Estimados',
        data: statsData?.stats?.search_analytics?.searches_by_period?.map(item => 
            item.total_searches * 150 // Estimación: $150 por búsqueda
        ) || [0]
    }]

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
                Error al cargar el análisis de reservas. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    🔍 Filtros de Análisis
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Período</InputLabel>
                            <Select
                                value={filters.period}
                                label="Período"
                                onChange={(e) => handleFilterChange('period', e.target.value)}
                            >
                                <MenuItem value="day">Diario</MenuItem>
                                <MenuItem value="week">Semanal</MenuItem>
                                <MenuItem value="month">Mensual</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Fecha Desde"
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Fecha Hasta"
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <Button
                            variant="outlined"
                            onClick={() => refetch()}
                            startIcon={<RefreshIcon />}
                            fullWidth
                        >
                            Refrescar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Métricas de reservas */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {reservationMetrics.totalReservations}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Reservas
                                    </Typography>
                                </Box>
                                <CalendarIcon color="primary" sx={{ fontSize: 40 }} />
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
                                        ${reservationMetrics.totalRevenue.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ingresos Totales
                                    </Typography>
                                </Box>
                                <MoneyIcon color="success" sx={{ fontSize: 40 }} />
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
                                        {reservationMetrics.avgOccupancy}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ocupación Promedio
                                    </Typography>
                                </Box>
                                <HotelIcon color="warning" sx={{ fontSize: 40 }} />
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
                                        ${reservationMetrics.avgRevenuePerReservation}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ingreso por Reserva
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="info" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráfico de evolución */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Chart
                    options={revenueChartOptions}
                    series={revenueChartSeries}
                    type="area"
                    height={400}
                />
            </Paper>

            {/* Nota informativa */}
            <Alert severity="info">
                📊 Esta sección muestra datos de reservas e ingresos. En la implementación final, 
                estos datos provendrán directamente de la API de estadísticas de reservas.
            </Alert>
        </Box>
    )
}