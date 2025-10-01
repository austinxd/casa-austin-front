import { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Stack,
    Chip,
} from '@mui/material'
import {
    Analytics as AnalyticsIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Public as PublicIcon,
    Search as SearchIcon,
    TrendingUp as TrendingUpIcon,
    Refresh as RefreshIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetUpcomingCheckinsQuery } from '@/services/upcoming-checkins/upcomingCheckinsService'
import { UpcomingCheckinsParams, SearchByWeekday } from '@/interfaces/analytics.interface'

export default function SearchMetricsSubTab() {
    const [filters] = useState<UpcomingCheckinsParams>({
        days_ahead: 60,
        limit: 50,
        include_anonymous: true
    })

    const { data: upcomingData, isLoading, error, refetch } = useGetUpcomingCheckinsQuery(filters)

    // Calcular preferencias por día de semana
    const weekdayPreferences: SearchByWeekday[] = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) return []
        
        const weekdayData: { [key: string]: number } = {}
        let totalSearches = 0
        
        upcomingData.data.top_upcoming_checkins.forEach(date => {
            const weekday = date.weekday
            weekdayData[weekday] = (weekdayData[weekday] || 0) + date.total_searches
            totalSearches += date.total_searches
        })
        
        return Object.entries(weekdayData).map(([weekday, searches], index) => ({
            weekday,
            day_number: index,
            searches_count: searches,
            percentage: totalSearches > 0 ? (searches / totalSearches) * 100 : 0,
            avg_guests_searched: 0
        })).sort((a, b) => b.searches_count - a.searches_count)
    }, [upcomingData])

    // Calcular métricas resumen
    const summaryMetrics = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) {
            return {
                total_upcoming_searches: 0,
                unique_dates_searched: 0,
                avg_searches_per_date: 0,
                unique_clients_searching: 0,
                unique_anonymous_ips: 0
            }
        }
        
        const checkins = upcomingData.data.top_upcoming_checkins
        const totalSearches = checkins.reduce((sum, date) => sum + date.total_searches, 0)
        const uniqueDates = checkins.length
        const avgSearchesPerDate = uniqueDates > 0 ? totalSearches / uniqueDates : 0
        
        // Track unique clients and IPs using Sets to avoid counting duplicates
        const uniqueClientIds = new Set<string>()
        const uniqueIpAddresses = new Set<string>()
        
        checkins.forEach(date => {
            date.searching_clients?.forEach(client => {
                uniqueClientIds.add(client.client_id)
            })
            date.searching_ips?.forEach(ip => {
                uniqueIpAddresses.add(ip.ip_address)
            })
        })
        
        return {
            total_upcoming_searches: totalSearches,
            unique_dates_searched: uniqueDates,
            avg_searches_per_date: avgSearchesPerDate,
            unique_clients_searching: uniqueClientIds.size,
            unique_anonymous_ips: uniqueIpAddresses.size
        }
    }, [upcomingData])

    // Calcular anticipación promedio (días antes de buscar)
    const averageAnticipation = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) return 0
        
        const totalDays = upcomingData.data.top_upcoming_checkins.reduce((sum, date) => {
            return sum + (date.days_until_checkin * date.total_searches)
        }, 0)
        
        const totalSearches = upcomingData.data.top_upcoming_checkins.reduce((sum, date) => {
            return sum + date.total_searches
        }, 0)
        
        return totalSearches > 0 ? totalDays / totalSearches : 0
    }, [upcomingData])

    // Configuración del gráfico de días de semana
    const weekdayChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: weekdayPreferences.map(item => item.weekday),
        title: {
            text: 'Días de Semana Preferidos para Check-in',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997'],
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + '%'
            }
        },
        legend: { position: 'bottom' }
    }

    const weekdayChartSeries = weekdayPreferences.map(item => item.percentage)

    // Configuración del gráfico de anticipación
    const anticipationData = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) return []
        
        const ranges = [
            { label: '1-7 días', min: 1, max: 7, count: 0 },
            { label: '8-15 días', min: 8, max: 15, count: 0 },
            { label: '16-30 días', min: 16, max: 30, count: 0 },
            { label: '31-60 días', min: 31, max: 60, count: 0 },
            { label: '60+ días', min: 61, max: 999, count: 0 }
        ]
        
        upcomingData.data.top_upcoming_checkins.forEach(date => {
            const days = date.days_until_checkin
            const range = ranges.find(r => days >= r.min && days <= r.max)
            if (range) {
                range.count += date.total_searches
            }
        })
        
        return ranges
    }, [upcomingData])

    const anticipationChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300
        },
        xaxis: {
            categories: anticipationData.map(item => item.label)
        },
        title: {
            text: 'Anticipación en Búsquedas (Días Antes del Check-in)',
            align: 'center'
        },
        colors: ['#0E6191'],
        dataLabels: { enabled: true }
    }

    const anticipationChartSeries = [{
        name: 'Búsquedas',
        data: anticipationData.map(item => item.count)
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
                Error al cargar las métricas de búsqueda. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AnalyticsIcon />
                        Métricas de Búsqueda
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => refetch()}
                        startIcon={<RefreshIcon />}
                    >
                        Refrescar
                    </Button>
                </Stack>
            </Paper>

            {/* Cards de métricas principales */}
            {upcomingData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="primary">
                                            {summaryMetrics.total_upcoming_searches}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Búsquedas
                                        </Typography>
                                    </Box>
                                    <SearchIcon color="primary" sx={{ fontSize: 40 }} />
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
                                            {summaryMetrics.unique_dates_searched}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fechas Únicas
                                        </Typography>
                                    </Box>
                                    <CalendarIcon color="success" sx={{ fontSize: 40 }} />
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
                                            {summaryMetrics.avg_searches_per_date.toFixed(1)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Promedio por Fecha
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
                                            {averageAnticipation.toFixed(0)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Días Anticipación
                                        </Typography>
                                    </Box>
                                    <ScheduleIcon color="info" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Gráficos de análisis temporal */}
            <Grid container spacing={3} mb={3}>
                {/* Días de semana preferidos */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={weekdayChartOptions}
                            series={weekdayChartSeries}
                            type="donut"
                            height={350}
                        />
                    </Paper>
                </Grid>
                
                {/* Anticipación en búsquedas */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={anticipationChartOptions}
                            series={anticipationChartSeries}
                            type="bar"
                            height={350}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabla de desglose por usuarios */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="success" />
                            Desglose por Tipo de Usuario
                        </Typography>
                        
                        <Stack spacing={2}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="h6" color="success.main">
                                                {summaryMetrics.unique_clients_searching}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Clientes Únicos Buscando
                                            </Typography>
                                        </Box>
                                        <PersonIcon color="success" />
                                    </Stack>
                                </CardContent>
                            </Card>
                            
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="h6" color="info.main">
                                                {summaryMetrics.unique_anonymous_ips}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                IPs Anónimas Únicas
                                            </Typography>
                                        </Box>
                                        <PublicIcon color="info" />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Paper>
                </Grid>
                
                {/* Top días de semana */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon color="primary" />
                            Ranking de Días Preferidos
                        </Typography>
                        
                        <Stack spacing={1}>
                            {weekdayPreferences.slice(0, 7).map((day, index) => (
                                <Box key={day.weekday}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" py={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Chip 
                                                label={index + 1} 
                                                size="small" 
                                                color={index < 3 ? "primary" : "default"}
                                            />
                                            <Typography variant="body2" fontWeight="medium">
                                                {day.weekday}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography variant="body2" color="primary">
                                                {day.searches_count} búsquedas
                                            </Typography>
                                            <Chip 
                                                label={`${day.percentage.toFixed(1)}%`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </Stack>
                                    {index < weekdayPreferences.length - 1 && <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e0e0e0' }} />}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Patrones estacionales */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    Análisis de Patrones Temporales
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="primary">
                                    {weekdayPreferences[0]?.weekday || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Día Más Popular
                                </Typography>
                                <Typography variant="caption" color="primary">
                                    {weekdayPreferences[0]?.percentage.toFixed(1) || 0}% de búsquedas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="success.main">
                                    {anticipationData.find(d => d.count === Math.max(...anticipationData.map(d => d.count)))?.label || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Rango Anticipación Común
                                </Typography>
                                <Typography variant="caption" color="success.main">
                                    Mayoría busca en este rango
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="warning.main">
                                    {averageAnticipation.toFixed(0)} días
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Anticipación Promedio
                                </Typography>
                                <Typography variant="caption" color="warning.main">
                                    Tiempo medio de planificación
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="info.main">
                                    {((summaryMetrics.unique_clients_searching) / (summaryMetrics.total_upcoming_searches || 1) * 100).toFixed(1)}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ratio Clientes/Total
                                </Typography>
                                <Typography variant="caption" color="info.main">
                                    Búsquedas de usuarios registrados
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Información del análisis */}
            {upcomingData && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Métricas calculadas:</strong> {dayjs(upcomingData.generated_at).format('DD/MM/YYYY HH:mm')} | {' '}
                        <strong>Período de análisis:</strong> {dayjs(upcomingData.data.period_info.analysis_from).format('DD/MM/YYYY')} 
                        - {dayjs(upcomingData.data.period_info.analysis_to).format('DD/MM/YYYY')} | {' '}
                        <strong>Días analizados:</strong> {upcomingData.data.period_info.days_ahead}
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}