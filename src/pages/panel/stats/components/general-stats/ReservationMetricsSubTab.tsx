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
    CircularProgress,
    Alert,
    Stack,
} from '@mui/material'
import {
    CalendarToday as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    Hotel as HotelIcon,
    AccessTime as TimeIcon,
    Refresh as RefreshIcon,
    CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function ReservationMetricsSubTab() {
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

    // Configuración del gráfico de tendencias
    const reservationTrendOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: statsData?.stats?.reservations_by_period?.map(item => 
                dayjs(item.period).format('DD/MM')
            ) || [],
            title: { text: 'Período' }
        },
        yaxis: [
            {
                title: { text: 'Reservas' },
                seriesName: 'Reservas'
            },
            {
                opposite: true,
                title: { text: 'Ingresos ($)' },
                seriesName: 'Ingresos'
            }
        ],
        title: {
            text: 'Evolución de Reservas e Ingresos',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745'],
        stroke: { width: 3 },
        dataLabels: { enabled: true }
    }

    const reservationTrendSeries = [
        {
            name: 'Reservas',
            data: statsData?.stats?.reservations_by_period?.map(item => item.reservations_count) || []
        },
        {
            name: 'Ingresos',
            yAxisIndex: 1,
            data: statsData?.stats?.reservations_by_period?.map(item => item.revenue) || []
        }
    ]

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
                Error al cargar las métricas de reservas. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon />
                    Filtros de Período
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

            {/* Cards de métricas principales */}
            {statsData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="primary">
                                            {statsData.stats.summary.total_reservations?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Reservas
                                        </Typography>
                                        {statsData.stats.growth_metrics?.reservations_growth && (
                                            <Typography 
                                                variant="caption" 
                                                color={statsData.stats.growth_metrics.reservations_growth > 0 ? "success.main" : "error.main"}
                                            >
                                                {statsData.stats.growth_metrics.reservations_growth > 0 ? "+" : ""}
                                                {statsData.stats.growth_metrics.reservations_growth.toFixed(1)}% vs período anterior
                                            </Typography>
                                        )}
                                    </Box>
                                    <CalendarMonthIcon color="primary" sx={{ fontSize: 40 }} />
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
                                            ${statsData.stats.summary.total_revenue?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ingresos Totales
                                        </Typography>
                                        {statsData.stats.growth_metrics?.revenue_growth && (
                                            <Typography 
                                                variant="caption" 
                                                color={statsData.stats.growth_metrics.revenue_growth > 0 ? "success.main" : "error.main"}
                                            >
                                                {statsData.stats.growth_metrics.revenue_growth > 0 ? "+" : ""}
                                                {statsData.stats.growth_metrics.revenue_growth.toFixed(1)}% vs período anterior
                                            </Typography>
                                        )}
                                    </Box>
                                    <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
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
                                            {statsData.stats.summary.average_occupancy?.toFixed(1) || 0}%
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
                                            {statsData.stats.summary.average_stay_duration?.toFixed(1) || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Días Promedio
                                        </Typography>
                                    </Box>
                                    <TimeIcon color="info" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Gráfico de tendencias */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Chart
                    options={reservationTrendOptions}
                    series={reservationTrendSeries}
                    type="line"
                    height={400}
                />
            </Paper>

            {/* Información del período */}
            {statsData && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Período analizado:</strong> {' '}
                        {dayjs(statsData.stats.period_info.start_date).format('DD/MM/YYYY')} - {' '}
                        {dayjs(statsData.stats.period_info.end_date).format('DD/MM/YYYY')} {' '}
                        ({statsData.stats.period_info.days_analyzed} días) | {' '}
                        <strong>Generado:</strong> {dayjs(statsData.generated_at).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}