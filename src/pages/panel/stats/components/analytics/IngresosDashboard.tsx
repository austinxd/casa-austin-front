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
    Chip,
    Divider,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

// Services y tipos
import { useGetIngresosQuery } from '@/services/analytics/ingresosService'
import { GlobalFilters } from '@/interfaces/analytics.interface'
import { safeArray, safeNumber } from '@/utils/formatters'

interface IngresosDashboardProps {
    filters: GlobalFilters
}

const formatSoles = (value: number) => `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

export default function IngresosDashboard({ filters }: IngresosDashboardProps) {
    const { data: ingresosData, isLoading, error } = useGetIngresosQuery({
        date_from: filters.dateRange.date_from,
        date_to: filters.dateRange.date_to,
        period: 'month',
        currency: filters.currency
    })

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={48} />
            </Box>
        )
    }

    if (error || !ingresosData?.success || !ingresosData?.data) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error al cargar las estadísticas de ingresos.
            </Alert>
        )
    }

    const summary = ingresosData.data.revenue_summary || {
        total_revenue: 0, total_nights: 0, total_reservations: 0,
        avg_revenue_per_reservation: 0, revenue_per_night: 0, avg_revenue_per_day: 0
    }
    const growth = ingresosData.data.growth_metrics || {
        revenue_growth_percentage: 0, reservations_growth_percentage: 0,
        current_period_revenue: 0, previous_period_revenue: 0,
        current_period_reservations: 0, previous_period_reservations: 0
    }
    const priceAnalysis = ingresosData.data.price_analysis || {
        avg_total_cost: 0, min_total_cost: 0, max_total_cost: 0,
        avg_price_per_night: 0, avg_nights_per_reservation: 0, price_distribution: []
    }
    const periods = safeArray(ingresosData.data.revenue_by_period)

    const revenueGrowth = safeNumber(growth.revenue_growth_percentage)
    const reservationsGrowth = safeNumber(growth.reservations_growth_percentage)

    // --- Gráfico de barras mensual ---
    const barChartOptions: ApexOptions = {
        chart: { type: 'bar', height: 320, toolbar: { show: false } },
        plotOptions: {
            bar: { borderRadius: 6, columnWidth: '55%' }
        },
        xaxis: {
            categories: periods.map((p: any) => {
                const label = p?.period_label || ''
                // Acortar "Enero 2025" → "Ene"
                return label.split(' ')[0]?.substring(0, 3) || label
            }),
            labels: { style: { fontSize: '12px' } }
        },
        yaxis: {
            labels: {
                formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`
            }
        },
        colors: ['#1976d2'],
        dataLabels: { enabled: false },
        tooltip: {
            y: { formatter: (val: number) => formatSoles(val) }
        },
        grid: { borderColor: '#f0f0f0' },
    }
    const barChartSeries = [{
        name: 'Ingresos',
        data: periods.map((p: any) => safeNumber(p?.revenue, 0))
    }]

    // --- Gráfico comparativo reservas vs noches ---
    const comparisonChartOptions: ApexOptions = {
        chart: { type: 'line', height: 280, toolbar: { show: false } },
        xaxis: {
            categories: periods.map((p: any) => {
                const label = p?.period_label || ''
                return label.split(' ')[0]?.substring(0, 3) || label
            }),
        },
        yaxis: [
            { title: { text: 'Reservas' }, labels: { formatter: (v: number) => `${Math.round(v)}` } },
            { opposite: true, title: { text: 'Noches' }, labels: { formatter: (v: number) => `${Math.round(v)}` } },
        ],
        colors: ['#1976d2', '#ed6c02'],
        stroke: { width: [3, 3], curve: 'smooth' },
        markers: { size: 4 },
        dataLabels: { enabled: false },
        legend: { position: 'top' },
        grid: { borderColor: '#f0f0f0' },
    }
    const comparisonChartSeries = [
        { name: 'Reservas', type: 'line', data: periods.map((p: any) => safeNumber(p?.count, 0)) },
        { name: 'Noches', type: 'line', data: periods.map((p: any) => safeNumber(p?.nights_count, 0)) },
    ]

    // --- Mejor y peor mes ---
    const bestMonth: any = periods.reduce((best: any, p: any) =>
        safeNumber(p?.revenue, 0) > safeNumber(best?.revenue, 0) ? p : best, periods[0])
    const worstMonth: any = periods.filter((p: any) => safeNumber(p?.revenue, 0) > 0)
        .reduce((worst: any, p: any) =>
            safeNumber(p?.revenue, 0) < safeNumber(worst?.revenue, 0) ? p : worst,
            periods.find((p: any) => safeNumber(p?.revenue, 0) > 0) || periods[0])

    return (
        <Box display="flex" flexDirection="column" gap={3}>

            {/* === FILA 1: KPIs principales === */}
            <Grid container spacing={2}>
                {/* Ingreso Total */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                                Ingreso Total
                            </Typography>
                            <Typography variant="h4" fontWeight={700} mt={0.5}>
                                {formatSoles(summary.total_revenue)}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                                {revenueGrowth >= 0 ? (
                                    <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                                )}
                                <Typography variant="body2" color={revenueGrowth >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                                    {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    vs período anterior
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reservas */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                                Reservas
                            </Typography>
                            <Typography variant="h4" fontWeight={700} mt={0.5}>
                                {summary.total_reservations}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                                {reservationsGrowth >= 0 ? (
                                    <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                                )}
                                <Typography variant="body2" color={reservationsGrowth >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                                    {reservationsGrowth > 0 ? '+' : ''}{reservationsGrowth.toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    vs período anterior
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Noches Vendidas */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                                Noches Vendidas
                            </Typography>
                            <Typography variant="h4" fontWeight={700} mt={0.5}>
                                {summary.total_nights.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                {(summary.total_nights / Math.max(summary.total_reservations, 1)).toFixed(1)} noches/reserva promedio
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Ingreso por Noche */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                                Ingreso por Noche
                            </Typography>
                            <Typography variant="h4" fontWeight={700} mt={0.5}>
                                {formatSoles(summary.revenue_per_night)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                {formatSoles(summary.avg_revenue_per_day)} promedio/día
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* === FILA 2: Gráfico de ingresos mensuales === */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Ingresos Mensuales
                </Typography>
                {periods.length > 0 ? (
                    <Chart options={barChartOptions} series={barChartSeries} type="bar" height={320} />
                ) : (
                    <Alert severity="info">No hay datos disponibles para el período seleccionado.</Alert>
                )}
            </Paper>

            {/* === FILA 3: Reservas/Noches + Resumen de precios === */}
            <Grid container spacing={3}>
                {/* Gráfico comparativo */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Reservas vs Noches por Mes
                        </Typography>
                        {periods.length > 0 ? (
                            <Chart options={comparisonChartOptions} series={comparisonChartSeries} type="line" height={280} />
                        ) : (
                            <Alert severity="info">No hay datos disponibles.</Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Panel resumen */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Resumen de Precios
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" color="text.secondary">Precio promedio por reserva</Typography>
                                    <Typography variant="body2" fontWeight={700}>{formatSoles(priceAnalysis.avg_total_cost)}</Typography>
                                </Stack>
                                <Divider />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" color="text.secondary">Precio promedio por noche</Typography>
                                    <Typography variant="body2" fontWeight={700}>{formatSoles(priceAnalysis.avg_price_per_night)}</Typography>
                                </Stack>
                                <Divider />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" color="text.secondary">Reserva más barata</Typography>
                                    <Typography variant="body2" fontWeight={700}>{formatSoles(priceAnalysis.min_total_cost)}</Typography>
                                </Stack>
                                <Divider />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" color="text.secondary">Reserva más cara</Typography>
                                    <Typography variant="body2" fontWeight={700}>{formatSoles(priceAnalysis.max_total_cost)}</Typography>
                                </Stack>
                                <Divider />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" color="text.secondary">Estadía promedio</Typography>
                                    <Typography variant="body2" fontWeight={700}>{priceAnalysis.avg_nights_per_reservation} noches</Typography>
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Mejor y peor mes */}
                        {bestMonth && worstMonth && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                            <Typography variant="body2" color="text.secondary">Mejor mes</Typography>
                                        </Stack>
                                        <Box textAlign="right">
                                            <Typography variant="body2" fontWeight={700}>{formatSoles(safeNumber(bestMonth?.revenue, 0))}</Typography>
                                            <Typography variant="caption" color="text.secondary">{bestMonth?.period_label}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                                            <Typography variant="body2" color="text.secondary">Mes más bajo</Typography>
                                        </Stack>
                                        <Box textAlign="right">
                                            <Typography variant="body2" fontWeight={700}>{formatSoles(safeNumber(worstMonth?.revenue, 0))}</Typography>
                                            <Typography variant="caption" color="text.secondary">{worstMonth?.period_label}</Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* === FILA 4: Tabla detallada mensual === */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Detalle Mensual
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Mes</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Ingresos</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Reservas</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Noches</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>S/ por Noche</TableCell>
                                <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>% del Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {periods.map((p: any, i: number) => {
                                const rev = safeNumber(p?.revenue, 0)
                                const pct = summary.total_revenue > 0 ? (rev / summary.total_revenue) * 100 : 0
                                return (
                                    <TableRow key={i} hover>
                                        <TableCell>{p?.period_label}</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600 }}>{formatSoles(rev)}</TableCell>
                                        <TableCell align="right">{safeNumber(p?.count, 0)}</TableCell>
                                        <TableCell align="right">{safeNumber(p?.nights_count, 0)}</TableCell>
                                        <TableCell align="right">{formatSoles(safeNumber(p?.revenue_per_night, 0))}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={Math.min(pct, 100)}
                                                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                                />
                                                <Typography variant="caption" sx={{ minWidth: 35 }}>
                                                    {pct.toFixed(0)}%
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {/* Fila total */}
                            <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>{formatSoles(summary.total_revenue)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>{summary.total_reservations}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>{summary.total_nights}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>{formatSoles(summary.revenue_per_night)}</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>100%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* === FILA 5: Comparación vs período anterior === */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Comparación vs Período Anterior
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: revenueGrowth >= 0 ? 'success.50' : 'error.50', border: 1, borderColor: revenueGrowth >= 0 ? 'success.200' : 'error.200' }}>
                            <Typography variant="body2" color="text.secondary" mb={1}>Ingresos</Typography>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Período actual</Typography>
                                    <Typography variant="h6" fontWeight={700}>{formatSoles(growth.current_period_revenue)}</Typography>
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="body2" color="text.secondary">Período anterior</Typography>
                                    <Typography variant="h6" fontWeight={700} color="text.secondary">{formatSoles(growth.previous_period_revenue)}</Typography>
                                </Box>
                            </Stack>
                            <Box mt={1}>
                                <Chip
                                    icon={revenueGrowth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                    label={`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`}
                                    size="small"
                                    color={revenueGrowth >= 0 ? 'success' : 'error'}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: reservationsGrowth >= 0 ? 'success.50' : 'error.50', border: 1, borderColor: reservationsGrowth >= 0 ? 'success.200' : 'error.200' }}>
                            <Typography variant="body2" color="text.secondary" mb={1}>Reservas</Typography>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Período actual</Typography>
                                    <Typography variant="h6" fontWeight={700}>{growth.current_period_reservations}</Typography>
                                </Box>
                                <Box textAlign="right">
                                    <Typography variant="body2" color="text.secondary">Período anterior</Typography>
                                    <Typography variant="h6" fontWeight={700} color="text.secondary">{growth.previous_period_reservations}</Typography>
                                </Box>
                            </Stack>
                            <Box mt={1}>
                                <Chip
                                    icon={reservationsGrowth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                    label={`${reservationsGrowth > 0 ? '+' : ''}${reservationsGrowth.toFixed(1)}%`}
                                    size="small"
                                    color={reservationsGrowth >= 0 ? 'success' : 'error'}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}
