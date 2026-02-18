import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Alert,
    CircularProgress,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from '@mui/material'
import {
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon,
    Hotel as HotelIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useState } from 'react'

// Services y tipos
import { useGetIngresosQuery } from '@/services/analytics/ingresosService'
import { GlobalFilters } from '@/interfaces/analytics.interface'
import { formatNumber, formatPercent, formatCurrency, safeArray, safeString, safeNumber } from '@/utils/formatters'

interface IngresosDashboardProps {
    filters: GlobalFilters
}

export default function IngresosDashboard({ filters }: IngresosDashboardProps) {
    const [localPeriod, setLocalPeriod] = useState(filters.period)
    
    const { data: ingresosData, isLoading, error } = useGetIngresosQuery({
        date_from: filters.dateRange.date_from,
        date_to: filters.dateRange.date_to,
        period: localPeriod,
        currency: filters.currency
    })

    // Debug logging
    console.log('IngresosDashboard - ingresosData:', ingresosData)
    console.log('IngresosDashboard - error:', error)

    // Configuración del gráfico de evolución de ingresos
    const revenueChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: safeArray(ingresosData?.data?.revenue_by_period).map((item: any) => {
                return safeString(item?.period_label, 'N/A')
            }),
            title: { text: 'Período' }
        },
        yaxis: {
            title: { text: `Ingresos (${filters.currency})` }
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
        name: `Ingresos (${filters.currency})`,
        data: safeArray(ingresosData?.data?.revenue_by_period).map((item: any) => safeNumber(item?.revenue, 0))
    }]

    // Configuración del gráfico de distribución de pagos
    const paymentChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: safeArray(ingresosData?.data?.payment_distribution).map((item: any) => safeString(item?.payment_method, 'N/A')),
        title: {
            text: 'Distribución por Método de Pago',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745', '#ffc107', '#dc3545'],
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + '%'
            }
        },
        legend: { position: 'bottom' }
    }

    const paymentChartSeries = safeArray(ingresosData?.data?.payment_distribution).map((item: any) => safeNumber(item?.percentage, 0))

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        )
    }

    if (error) {
        console.error('IngresosDashboard API Error:', error)
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error al cargar el análisis de ingresos. Por favor intenta nuevamente.
                <br />
                <small>Error: {JSON.stringify(error)}</small>
            </Alert>
        )
    }

    if (!ingresosData?.success || !ingresosData?.data) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                No se pudieron cargar los datos de ingresos.
                <br />
                <small>Data: {JSON.stringify(ingresosData)}</small>
            </Alert>
        )
    }

    const summary = ingresosData.data.revenue_summary || {
        total_revenue: 0,
        total_nights: 0,
        total_reservations: 0,
        avg_revenue_per_reservation: 0,
        revenue_per_night: 0,
        avg_revenue_per_day: 0
    }
    const growth = ingresosData.data.growth_metrics || {
        revenue_growth_percentage: 0,
        reservations_growth_percentage: 0,
        current_period_revenue: 0,
        previous_period_revenue: 0,
        current_period_reservations: 0,
        previous_period_reservations: 0
    }
    const priceAnalysis = ingresosData.data.price_analysis || {
        avg_total_cost: 0,
        min_total_cost: 0,
        max_total_cost: 0,
        avg_price_per_night: 0,
        avg_nights_per_reservation: 0,
        price_distribution: []
    }

    return (
        <Box>
            {/* Control de período */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6">Configuración de Período:</Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Período</InputLabel>
                        <Select
                            value={localPeriod}
                            label="Período"
                            onChange={(e) => setLocalPeriod(e.target.value as 'day' | 'week' | 'month')}
                        >
                            <MenuItem value="day">Diario</MenuItem>
                            <MenuItem value="week">Semanal</MenuItem>
                            <MenuItem value="month">Mensual</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            {/* KPIs principales */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="success.main">
                                        {formatCurrency(summary.total_revenue, filters.currency)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ingresos Totales
                                    </Typography>
                                    {growth && (
                                        <Chip 
                                            label={`${safeNumber(growth.revenue_growth_percentage) > 0 ? '+' : ''}${formatPercent(growth.revenue_growth_percentage)}`}
                                            size="small"
                                            color={safeNumber(growth.revenue_growth_percentage) > 0 ? "success" : "error"}
                                            sx={{ mt: 1 }}
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
                                        {formatCurrency(summary.avg_revenue_per_reservation, filters.currency)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        RevPAR (Promedio/Reserva)
                                    </Typography>
                                </Box>
                                <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
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
                                        {formatNumber(summary.total_reservations)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Reservas
                                    </Typography>
                                    {growth && (
                                        <Chip 
                                            label={`${safeNumber(growth.reservations_growth_percentage) > 0 ? '+' : ''}${formatPercent(growth.reservations_growth_percentage)}`}
                                            size="small"
                                            color={safeNumber(growth.reservations_growth_percentage) > 0 ? "success" : "error"}
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </Box>
                                <HotelIcon color="info" sx={{ fontSize: 40 }} />
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
                                        {formatCurrency(summary.revenue_per_night, filters.currency)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ingreso por Noche
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="warning" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficos */}
            <Grid container spacing={3} mb={4}>
                {/* Evolución de ingresos */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3 }}>
                        {ingresosData.data.revenue_by_period?.length ? (
                            <Chart
                                options={revenueChartOptions}
                                series={revenueChartSeries}
                                type="area"
                                height={350}
                            />
                        ) : (
                            <Alert severity="info">
                                No hay datos de evolución de ingresos disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Distribución de pagos */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3 }}>
                        {ingresosData.data.payment_distribution?.length ? (
                            <Chart
                                options={paymentChartOptions}
                                series={paymentChartSeries}
                                type="donut"
                                height={350}
                            />
                        ) : (
                            <Alert severity="info">
                                No hay datos de distribución de pagos disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Análisis de precios */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={3}>
                    💰 Análisis de Precios
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Precio Mínimo:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {formatCurrency(priceAnalysis.min_total_cost, filters.currency)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Precio Máximo:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {formatCurrency(priceAnalysis.max_total_cost, filters.currency)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Precio Promedio:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {formatCurrency(priceAnalysis.avg_total_cost, filters.currency)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Precio Mediano:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {formatCurrency(priceAnalysis.avg_price_per_night, filters.currency)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Rangos de Precios:
                        </Typography>
                        <Stack spacing={1}>
                            {safeArray(priceAnalysis.price_distribution).map((range: any, index: number) => (
                                <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">{safeString(range?.price_range, 'N/A')}:</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body2" fontWeight="bold">
                                            {formatNumber(range?.reservations_count)} reservas
                                        </Typography>
                                        <Chip 
                                            label={formatPercent(range?.percentage)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}