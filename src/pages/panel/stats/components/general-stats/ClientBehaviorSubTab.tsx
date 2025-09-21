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
    People as PeopleIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Refresh as RefreshIcon,
    Groups as GroupsIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function ClientBehaviorSubTab() {
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

    // Configuración del gráfico de patrones por día de semana
    const weekdayPatternsOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300
        },
        xaxis: {
            categories: statsData?.stats?.search_patterns?.by_day_of_week?.map(item => 
                item.day_name
            ) || []
        },
        title: {
            text: 'Patrones de Búsqueda por Día de la Semana',
            align: 'center'
        },
        colors: ['#0E6191'],
        dataLabels: { enabled: true }
    }

    const weekdayPatternsSeries = [{
        name: 'Búsquedas',
        data: statsData?.stats?.search_patterns?.by_day_of_week?.map(item => item.searches_count) || []
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
                Error al cargar el análisis de comportamiento de clientes. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon />
                    Filtros de Análisis de Clientes
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

            {/* Cards de métricas */}
            {statsData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="primary">
                                            {statsData.stats.summary.new_clients?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Nuevos Clientes
                                        </Typography>
                                    </Box>
                                    <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="success.main">
                                            {statsData.stats.summary.unique_searchers?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Usuarios Únicos
                                        </Typography>
                                    </Box>
                                    <GroupsIcon color="success" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="warning.main">
                                            {statsData.stats.summary.average_stay_duration?.toFixed(1) || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Días Promedio Estadía
                                        </Typography>
                                    </Box>
                                    <CalendarIcon color="warning" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Gráficos */}
            <Grid container spacing={3} mb={3}>
                {/* Distribución de huéspedes */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={guestDistributionOptions}
                            series={guestDistributionSeries}
                            type="donut"
                            height={350}
                        />
                    </Paper>
                </Grid>
                
                {/* Patrones por día de semana */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={weekdayPatternsOptions}
                            series={weekdayPatternsSeries}
                            type="bar"
                            height={350}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabla de distribución detallada */}
            {statsData?.stats?.guest_distribution && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" mb={2}>
                        Distribución Detallada por Número de Huéspedes
                    </Typography>
                    <Grid container spacing={2}>
                        {statsData.stats.guest_distribution.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h5" color="primary">
                                            {item.guest_count}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            {item.guest_count === 1 ? 'Huésped' : 'Huéspedes'}
                                        </Typography>
                                        <Typography variant="h6" color="success.main">
                                            {item.reservations_count}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            reservas ({item.percentage.toFixed(1)}%)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

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