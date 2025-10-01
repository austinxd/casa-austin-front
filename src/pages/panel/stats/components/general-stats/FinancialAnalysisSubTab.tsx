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
    Chip,
} from '@mui/material'
import {
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon,
    Analytics as AnalyticsIcon,
    ShowChart as ShowChartIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function FinancialAnalysisSubTab() {
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

    // Calcular métricas financieras adicionales
    const totalReservations = statsData?.stats?.summary?.total_reservations || 0
    const totalRevenue = statsData?.stats?.summary?.total_revenue || 0
    const averageRevenuePerReservation = totalReservations > 0 ? totalRevenue / totalReservations : 0

    // Calcular RevPAR por propiedad (Revenue per Available Room)
    const propertiesWithRevPAR = statsData?.stats?.properties_breakdown?.map((prop: any) => ({
        ...prop,
        revpar: prop.total_nights > 0 ? prop.total_revenue / prop.total_nights : 0
    })) || []

    // Configuración del gráfico de ingresos por período
    const revenueChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: statsData?.stats?.reservations_by_period?.map((item: any) => 
                dayjs(item.period).format('DD/MM')
            ) || [],
            title: { text: 'Período' }
        },
        yaxis: {
            title: { text: 'Ingresos ($)' }
        },
        title: {
            text: 'Evolución de Ingresos',
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
        name: 'Ingresos',
        data: statsData?.stats?.reservations_by_period?.map((item: any) => item.revenue) || []
    }]

    // Configuración del gráfico RevPAR por propiedad
    const revparChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300
        },
        xaxis: {
            categories: propertiesWithRevPAR.map((prop: any) => prop.property_name)
        },
        title: {
            text: 'RevPAR por Propiedad (Ingreso por Noche Disponible)',
            align: 'center'
        },
        colors: ['#ffc107'],
        dataLabels: { enabled: true }
    }

    const revparChartSeries = [{
        name: 'RevPAR ($)',
        data: propertiesWithRevPAR.map((prop: any) => prop.revpar)
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
                Error al cargar el análisis financiero. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon />
                    Filtros de Análisis Financiero
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

            {/* Cards de métricas financieras */}
            {statsData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="success.main">
                                            ${totalRevenue.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ingresos Totales
                                        </Typography>
                                        {statsData.stats.growth_metrics?.revenue_growth && (
                                            <Chip 
                                                label={`${statsData.stats.growth_metrics.revenue_growth > 0 ? '+' : ''}${statsData.stats.growth_metrics.revenue_growth.toFixed(1)}%`}
                                                color={statsData.stats.growth_metrics.revenue_growth > 0 ? "success" : "error"}
                                                size="small"
                                            />
                                        )}
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
                                        <Typography variant="h4" color="primary">
                                            ${averageRevenuePerReservation.toFixed(0)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ticket Promedio
                                        </Typography>
                                    </Box>
                                    <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
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
                                            {propertiesWithRevPAR.length > 0 ? 
                                                `$${(propertiesWithRevPAR.reduce((sum, prop) => sum + prop.revpar, 0) / propertiesWithRevPAR.length).toFixed(0)}` 
                                                : '$0'
                                            }
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            RevPAR Promedio
                                        </Typography>
                                    </Box>
                                    <AnalyticsIcon color="warning" sx={{ fontSize: 40 }} />
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
                                            {statsData.stats.summary.average_occupancy?.toFixed(1) || 0}%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ocupación Media
                                        </Typography>
                                    </Box>
                                    <ShowChartIcon color="info" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Gráficos financieros */}
            <Grid container spacing={3} mb={3}>
                {/* Evolución de ingresos */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={revenueChartOptions}
                            series={revenueChartSeries}
                            type="area"
                            height={350}
                        />
                    </Paper>
                </Grid>
                
                {/* RevPAR por propiedad */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={revparChartOptions}
                            series={revparChartSeries}
                            type="bar"
                            height={350}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabla de rentabilidad por propiedad */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    Análisis de Rentabilidad por Propiedad
                </Typography>
                <Grid container spacing={2}>
                    {propertiesWithRevPAR.map((property: any) => (
                        <Grid item xs={12} md={6} lg={4} key={property.property_name}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" color="primary" noWrap>
                                        {property.property_name}
                                    </Typography>
                                    <Stack spacing={1} mt={1}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2">Ingresos:</Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                ${property.total_revenue.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2">RevPAR:</Typography>
                                            <Typography variant="body2" fontWeight="bold" color="warning.main">
                                                ${property.revpar.toFixed(0)}/noche
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2">Ocupación:</Typography>
                                            <Chip 
                                                label={`${property.occupancy_rate.toFixed(1)}%`}
                                                color={property.occupancy_rate > 70 ? "success" : property.occupancy_rate > 50 ? "warning" : "error"}
                                                size="small"
                                            />
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2">Precio Promedio:</Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                ${property.average_price.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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