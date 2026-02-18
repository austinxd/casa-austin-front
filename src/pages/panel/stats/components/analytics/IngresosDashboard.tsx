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
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useState, useMemo } from 'react'

// Services y tipos
import { useGetIngresosQuery } from '@/services/analytics/ingresosService'
import { safeArray, safeNumber } from '@/utils/formatters'

interface IngresosDashboardProps {
    year: number
}

const MONTHS = ['Todos', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const formatSoles = (value: number) => `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function IngresosDashboard({ year }: IngresosDashboardProps) {
    const [selectedMonth, setSelectedMonth] = useState(0) // 0 = Todos, 1-12 = mes

    // Calcular date_from y date_to inteligentemente
    const today = new Date()
    const isCurrentYear = year === today.getFullYear()

    const dateRange = useMemo(() => {
        if (selectedMonth === 0) {
            // Año completo, pero si es el año actual, cortar en hoy
            const from = `${year}-01-01`
            const to = isCurrentYear
                ? `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                : `${year}-12-31`
            return { from, to }
        } else {
            // Mes específico
            const lastDay = new Date(year, selectedMonth, 0).getDate()
            const isCurrentMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
            const from = `${year}-${String(selectedMonth).padStart(2, '0')}-01`
            const to = isCurrentMonth
                ? `${year}-${String(selectedMonth).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                : `${year}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
            return { from, to }
        }
    }, [year, selectedMonth, isCurrentYear])

    const { data: ingresosData, isLoading, error } = useGetIngresosQuery({
        date_from: dateRange.from,
        date_to: dateRange.to,
        period: 'month',
        currency: 'PEN'
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
        current_period_reservations: 0, previous_period_reservations: 0,
        current_period_label: '', previous_period_label: '',
    }
    const priceAnalysis = ingresosData.data.price_analysis || {
        avg_total_cost: 0, min_total_cost: 0, max_total_cost: 0,
        avg_price_per_night: 0, avg_nights_per_reservation: 0, price_distribution: []
    }
    const periods = safeArray(ingresosData.data.revenue_by_period)

    const revenueGrowth = safeNumber(growth.revenue_growth_percentage)
    const reservationsGrowth = safeNumber(growth.reservations_growth_percentage)

    // Labels explícitos de comparación
    const currentLabel = (growth as any).current_period_label || `${formatDateLabel(dateRange.from)} - ${formatDateLabel(dateRange.to)}`
    const previousLabel = (growth as any).previous_period_label || `Mismo período ${year - 1}`

    // Texto descriptivo del período
    const periodDescription = selectedMonth === 0
        ? isCurrentYear
            ? `1 Ene - ${today.getDate()} ${today.toLocaleDateString('es-PE', { month: 'short' })} ${year}`
            : `Año completo ${year}`
        : (() => {
            const monthName = new Date(year, selectedMonth - 1).toLocaleDateString('es-PE', { month: 'long' })
            const isCurrentMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
            return isCurrentMonth
                ? `1 - ${today.getDate()} de ${monthName} ${year} (en curso)`
                : `${monthName} ${year}`
        })()

    // --- Gráfico de barras mensual ---
    const barChartOptions: ApexOptions = {
        chart: { type: 'bar', height: 320, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
        xaxis: {
            categories: periods.map((p: any) => {
                const label = p?.period_label || ''
                return label.split(' ')[0]?.substring(0, 3) || label
            }),
            labels: { style: { fontSize: '12px' } }
        },
        yaxis: {
            labels: { formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}` }
        },
        colors: ['#1976d2'],
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: (val: number) => formatSoles(val) } },
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
        { name: 'Reservas', type: 'line' as const, data: periods.map((p: any) => safeNumber(p?.reservations_count, 0)) },
        { name: 'Noches', type: 'line' as const, data: periods.map((p: any) => safeNumber(p?.nights_count, 0)) },
    ]

    // --- Mejor y peor mes ---
    const bestMonth: any = periods.length > 0
        ? periods.reduce((best: any, p: any) => safeNumber(p?.revenue, 0) > safeNumber(best?.revenue, 0) ? p : best, periods[0])
        : null
    const positivePeriods = periods.filter((p: any) => safeNumber(p?.revenue, 0) > 0)
    const worstMonth: any = positivePeriods.length > 0
        ? positivePeriods.reduce((worst: any, p: any) => safeNumber(p?.revenue, 0) < safeNumber(worst?.revenue, 0) ? p : worst, positivePeriods[0])
        : null

    return (
        <Box display="flex" flexDirection="column" gap={3}>

            {/* === SELECTOR DE MES === */}
            <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        Filtrar por:
                    </Typography>
                    <ToggleButtonGroup
                        value={selectedMonth}
                        exclusive
                        onChange={(_, v) => { if (v !== null) setSelectedMonth(v) }}
                        size="small"
                        sx={{ flexWrap: 'wrap' }}
                    >
                        {MONTHS.map((m, i) => (
                            <ToggleButton key={i} value={i} sx={{ px: 1.5, py: 0.5, textTransform: 'none', fontSize: '0.8rem' }}>
                                {m}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                    Mostrando: <strong>{periodDescription}</strong>
                    {' '}| Comparando con: <strong>{previousLabel}</strong>
                </Typography>
            </Paper>

            {/* === KPIs === */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                                Ingreso Total
                            </Typography>
                            <Typography variant="h4" fontWeight={700} mt={0.5}>
                                {formatSoles(summary.total_revenue)}
                            </Typography>
                            <GrowthIndicator value={revenueGrowth} label={`vs ${year - 1}`} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                                Reservas
                            </Typography>
                            <Typography variant="h4" fontWeight={700} mt={0.5}>
                                {summary.total_reservations}
                            </Typography>
                            <GrowthIndicator value={reservationsGrowth} label={`vs ${year - 1}`} />
                        </CardContent>
                    </Card>
                </Grid>
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
                                {(summary.total_nights / Math.max(summary.total_reservations, 1)).toFixed(1)} noches/reserva
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
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

            {/* === GRÁFICO MENSUAL (solo si es vista anual) === */}
            {selectedMonth === 0 && periods.length > 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Ingresos Mensuales {year}
                        {isCurrentYear && (
                            <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                                (hasta hoy)
                            </Typography>
                        )}
                    </Typography>
                    <Chart options={barChartOptions} series={barChartSeries} type="bar" height={320} />
                </Paper>
            )}

            {/* === RESERVAS VS NOCHES + RESUMEN (solo vista anual) === */}
            {selectedMonth === 0 && periods.length > 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Reservas vs Noches por Mes
                            </Typography>
                            <Chart options={comparisonChartOptions} series={comparisonChartSeries} type="line" height={280} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Resumen de Precios
                            </Typography>
                            <PriceSummary priceAnalysis={priceAnalysis} bestMonth={bestMonth} worstMonth={worstMonth} />
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* === RESUMEN DE PRECIOS (vista de mes individual) === */}
            {selectedMonth > 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Resumen de Precios
                    </Typography>
                    <PriceSummary priceAnalysis={priceAnalysis} bestMonth={null} worstMonth={null} />
                </Paper>
            )}

            {/* === COMPARACIÓN VS AÑO ANTERIOR === */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={0.5}>
                    Comparación Interanual
                </Typography>
                <Typography variant="caption" color="text.secondary" mb={2} display="block">
                    {currentLabel} vs {previousLabel}
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <ComparisonCard
                            title="Ingresos"
                            current={growth.current_period_revenue}
                            previous={growth.previous_period_revenue}
                            growthPct={revenueGrowth}
                            currentYear={year}
                            previousYear={year - 1}
                            formatFn={formatSoles}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ComparisonCard
                            title="Reservas"
                            current={growth.current_period_reservations}
                            previous={growth.previous_period_reservations}
                            growthPct={reservationsGrowth}
                            currentYear={year}
                            previousYear={year - 1}
                            formatFn={(v) => `${v}`}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* === TABLA DETALLADA (solo vista anual) === */}
            {selectedMonth === 0 && periods.length > 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Detalle Mensual {year}
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
                                            <TableCell align="right">{safeNumber(p?.reservations_count, 0)}</TableCell>
                                            <TableCell align="right">{safeNumber(p?.nights_count, 0)}</TableCell>
                                            <TableCell align="right">{formatSoles(safeNumber(p?.revenue_per_night, 0))}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <LinearProgress variant="determinate" value={Math.min(pct, 100)} sx={{ flex: 1, height: 8, borderRadius: 4 }} />
                                                    <Typography variant="caption" sx={{ minWidth: 35 }}>{pct.toFixed(0)}%</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
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
            )}
        </Box>
    )
}

// --- Sub-componentes ---

function GrowthIndicator({ value, label }: { value: number; label: string }) {
    return (
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
            {value >= 0 ? (
                <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
            ) : (
                <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
            )}
            <Typography variant="body2" color={value >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                {value > 0 ? '+' : ''}{value.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Stack>
    )
}

function PriceSummary({ priceAnalysis, bestMonth, worstMonth }: { priceAnalysis: any; bestMonth: any; worstMonth: any }) {
    return (
        <Stack spacing={2}>
            <SummaryRow label="Precio promedio por reserva" value={formatSoles(priceAnalysis.avg_total_cost)} />
            <SummaryRow label="Precio promedio por noche" value={formatSoles(priceAnalysis.avg_price_per_night)} />
            <SummaryRow label="Reserva más barata" value={formatSoles(priceAnalysis.min_total_cost)} />
            <SummaryRow label="Reserva más cara" value={formatSoles(priceAnalysis.max_total_cost)} />
            <SummaryRow label="Estadía promedio" value={`${priceAnalysis.avg_nights_per_reservation} noches`} />
            {bestMonth && worstMonth && (
                <>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            <Typography variant="body2" color="text.secondary">Mejor mes</Typography>
                        </Stack>
                        <Box textAlign="right">
                            <Typography variant="body2" fontWeight={700}>{formatSoles(safeNumber(bestMonth.revenue, 0))}</Typography>
                            <Typography variant="caption" color="text.secondary">{bestMonth.period_label}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TrendingDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                            <Typography variant="body2" color="text.secondary">Mes más bajo</Typography>
                        </Stack>
                        <Box textAlign="right">
                            <Typography variant="body2" fontWeight={700}>{formatSoles(safeNumber(worstMonth.revenue, 0))}</Typography>
                            <Typography variant="caption" color="text.secondary">{worstMonth.period_label}</Typography>
                        </Box>
                    </Stack>
                </>
            )}
        </Stack>
    )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={700}>{value}</Typography>
            </Stack>
            <Divider />
        </Box>
    )
}

function ComparisonCard({ title, current, previous, growthPct, currentYear, previousYear, formatFn }: {
    title: string; current: number; previous: number; growthPct: number;
    currentYear: number; previousYear: number; formatFn: (v: number) => string
}) {
    const isPositive = growthPct >= 0
    return (
        <Box sx={{
            p: 2, borderRadius: 2, border: 1,
            borderColor: isPositive ? 'success.light' : 'error.light',
            bgcolor: isPositive ? 'rgba(46,125,50,0.04)' : 'rgba(211,47,47,0.04)',
        }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1.5}>{title}</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                <Box>
                    <Typography variant="caption" color="text.secondary">{currentYear}</Typography>
                    <Typography variant="h6" fontWeight={700}>{formatFn(current)}</Typography>
                </Box>
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">{previousYear}</Typography>
                    <Typography variant="h6" fontWeight={700} color="text.secondary">{formatFn(previous)}</Typography>
                </Box>
            </Stack>
            <Box mt={1}>
                <Chip
                    icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={`${growthPct > 0 ? '+' : ''}${growthPct.toFixed(1)}%`}
                    size="small"
                    color={isPositive ? 'success' : 'error'}
                />
            </Box>
        </Box>
    )
}
