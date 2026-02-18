import {
    Box,
    Grid,
    Typography,
    Stack,
    Alert,
    CircularProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    alpha,
    useTheme,
} from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon,
    CalendarToday as CalendarIcon,
    Hotel as HotelIcon,
    NightsStay as NightsIcon,
    Payments as PaymentsIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useState, useMemo } from 'react'

import { useGetIngresosQuery } from '@/services/analytics/ingresosService'
import { safeArray, safeNumber } from '@/utils/formatters'

interface IngresosDashboardProps {
    year: number
}

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MONTHS_FILTER = ['Anual', ...MONTH_LABELS]

const fmtSoles = (v: number) => `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

// Glassmorphism card styles
const glassCard = (bgColor: string, borderColor: string) => ({
    background: `linear-gradient(135deg, ${alpha(bgColor, 0.08)} 0%, ${alpha(bgColor, 0.03)} 100%)`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(borderColor, 0.12)}`,
    borderRadius: 3,
    p: 2.5,
    position: 'relative' as const,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${bgColor}, ${alpha(bgColor, 0.3)})`,
    },
})

export default function IngresosDashboard({ year }: IngresosDashboardProps) {
    const theme = useTheme()
    const [selectedMonth, setSelectedMonth] = useState(0) // 0 = Anual

    const today = new Date()
    const isCurrentYear = year === today.getFullYear()

    // Rango del año seleccionado
    const dateRange = useMemo(() => {
        if (selectedMonth === 0) {
            const from = `${year}-01-01`
            const to = isCurrentYear
                ? `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                : `${year}-12-31`
            return { from, to }
        } else {
            const lastDay = new Date(year, selectedMonth, 0).getDate()
            const isCurrentMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
            const mm = String(selectedMonth).padStart(2, '0')
            return {
                from: `${year}-${mm}-01`,
                to: isCurrentMonth
                    ? `${year}-${mm}-${String(today.getDate()).padStart(2, '0')}`
                    : `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
            }
        }
    }, [year, selectedMonth, isCurrentYear])

    // Rango del año anterior (mismas fechas)
    const prevDateRange = useMemo(() => {
        if (selectedMonth === 0) {
            const from = `${year - 1}-01-01`
            const to = isCurrentYear
                ? `${year - 1}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(Math.min(today.getDate(), 28)).padStart(2, '0')}`
                : `${year - 1}-12-31`
            return { from, to }
        } else {
            const lastDay = new Date(year - 1, selectedMonth, 0).getDate()
            const isCurrentMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
            const mm = String(selectedMonth).padStart(2, '0')
            return {
                from: `${year - 1}-${mm}-01`,
                to: isCurrentMonth
                    ? `${year - 1}-${mm}-${String(Math.min(today.getDate(), lastDay)).padStart(2, '0')}`
                    : `${year - 1}-${mm}-${String(lastDay).padStart(2, '0')}`,
            }
        }
    }, [year, selectedMonth, isCurrentYear])

    // Rango anual completo (para gráfico de contexto en vista mensual)
    const fullYearRange = useMemo(() => ({
        from: `${year}-01-01`,
        to: isCurrentYear
            ? `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            : `${year}-12-31`,
    }), [year, isCurrentYear])

    // Queries
    const { data: currentData, isLoading: loadingCurrent, error: errorCurrent } = useGetIngresosQuery({
        date_from: dateRange.from, date_to: dateRange.to, period: 'month', currency: 'PEN'
    })
    const { data: prevData, isLoading: loadingPrev } = useGetIngresosQuery({
        date_from: prevDateRange.from, date_to: prevDateRange.to, period: 'month', currency: 'PEN'
    })
    // Datos anuales completos (para contexto en vista mensual)
    const { data: fullYearData } = useGetIngresosQuery(
        { date_from: fullYearRange.from, date_to: fullYearRange.to, period: 'month', currency: 'PEN' },
        { skip: selectedMonth === 0 } // Solo cuando hay mes seleccionado
    )

    if (loadingCurrent || loadingPrev) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
                <CircularProgress size={44} sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" color="text.secondary">Cargando estadísticas...</Typography>
            </Box>
        )
    }
    if (errorCurrent || !currentData?.success || !currentData?.data) {
        return <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>Error al cargar las estadísticas.</Alert>
    }

    const summary: any = currentData.data.revenue_summary || {}
    const prevSummary: any = prevData?.data?.revenue_summary || {}
    const periods = safeArray(currentData.data.revenue_by_period)
    const prevPeriods = safeArray(prevData?.data?.revenue_by_period)

    // Crecimiento
    const calcGrowth = (cur: number, prev: number) => prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? 100 : 0
    const revGrowth = calcGrowth(safeNumber(summary.total_revenue), safeNumber(prevSummary.total_revenue))
    const resGrowth = calcGrowth(safeNumber(summary.total_reservations), safeNumber(prevSummary.total_reservations))
    const nightsGrowth = calcGrowth(safeNumber(summary.total_nights), safeNumber(prevSummary.total_nights))
    const perNightGrowth = calcGrowth(safeNumber(summary.revenue_per_night), safeNumber(prevSummary.revenue_per_night))

    // Helpers para extraer datos por mes
    const getMonthData = (periodsArr: any[], monthIndex: number, field: string) => {
        const p = periodsArr.find((item: any) => {
            if (!item?.period) return false
            return new Date(item.period + 'T00:00:00').getMonth() === monthIndex
        })
        return safeNumber(p?.[field], 0)
    }

    const monthIndices = selectedMonth === 0
        ? Array.from({ length: isCurrentYear ? today.getMonth() + 1 : 12 }, (_, i) => i)
        : [selectedMonth - 1]

    const currentRevByMonth = monthIndices.map(i => getMonthData(periods, i, 'revenue'))
    const prevRevByMonth = monthIndices.map(i => getMonthData(prevPeriods, i, 'revenue'))
    const monthLabels = monthIndices.map(i => MONTH_LABELS[i])

    // === VISTA ANUAL ===
    const isAnnualView = selectedMonth === 0

    // Gráfico de barras: año vs año anterior
    const barChartOptions: ApexOptions = {
        chart: { type: 'bar', height: 380, toolbar: { show: false }, fontFamily: 'inherit' },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: isAnnualView ? '55%' : '40%',
            },
        },
        xaxis: {
            categories: monthLabels,
            labels: { style: { fontSize: '12px', fontWeight: 600 } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
                style: { fontSize: '11px' },
            },
        },
        colors: [theme.palette.primary.main, alpha('#9e9e9e', 0.5)],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.15,
                opacityFrom: 0.95,
                opacityTo: 0.85,
            },
        },
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'dark',
            y: { formatter: (v: number) => fmtSoles(v) },
        },
        legend: {
            position: 'top',
            fontSize: '13px',
            fontWeight: 600,
            markers: { width: 8, height: 8 },
        },
        grid: {
            borderColor: alpha('#000', 0.06),
            strokeDashArray: 4,
            padding: { left: 8, right: 8 },
        },
    }
    const barChartSeries = [
        { name: `${year}`, data: currentRevByMonth },
        { name: `${year - 1}`, data: prevRevByMonth },
    ]

    // Acumulado (solo anual)
    let cumulativeCurrent: number[] = []
    let cumulativePrev: number[] = []
    if (isAnnualView && monthIndices.length > 1) {
        let accCur = 0, accPrev = 0
        monthIndices.forEach(i => {
            accCur += getMonthData(periods, i, 'revenue')
            accPrev += getMonthData(prevPeriods, i, 'revenue')
            cumulativeCurrent.push(accCur)
            cumulativePrev.push(accPrev)
        })
    }

    const areaChartOptions: ApexOptions = {
        chart: { type: 'area', height: 320, toolbar: { show: false }, fontFamily: 'inherit' },
        xaxis: {
            categories: monthLabels,
            labels: { style: { fontSize: '11px' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
                style: { fontSize: '11px' },
            },
        },
        colors: [theme.palette.primary.main, '#bdbdbd'],
        stroke: { width: [3, 2], curve: 'smooth', dashArray: [0, 6] },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.2,
                opacityTo: 0.02,
            },
        },
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'dark',
            y: { formatter: (v: number) => fmtSoles(v) },
        },
        legend: {
            position: 'top',
            fontSize: '13px',
            fontWeight: 600,
            markers: { width: 8, height: 8 },
        },
        grid: {
            borderColor: alpha('#000', 0.06),
            strokeDashArray: 4,
        },
    }
    const areaChartSeries = [
        { name: `Acumulado ${year}`, data: cumulativeCurrent },
        { name: `Acumulado ${year - 1}`, data: cumulativePrev },
    ]

    // === VISTA MENSUAL: datos específicos del mes ===
    const monthName = selectedMonth > 0 ? MONTH_FULL[selectedMonth - 1] : ''
    const curMonthRev = isAnnualView ? 0 : currentRevByMonth[0]
    const prevMonthRev = isAnnualView ? 0 : prevRevByMonth[0]
    const curMonthRes = isAnnualView ? 0 : getMonthData(periods, selectedMonth - 1, 'reservations_count')
    const prevMonthRes = isAnnualView ? 0 : getMonthData(prevPeriods, selectedMonth - 1, 'reservations_count')
    const curMonthNights = isAnnualView ? 0 : getMonthData(periods, selectedMonth - 1, 'nights')
    const prevMonthNights = isAnnualView ? 0 : getMonthData(prevPeriods, selectedMonth - 1, 'nights')
    // Radial chart para vista mensual (% respecto al mes del año anterior)
    const radialValue = prevMonthRev > 0 ? Math.min(Math.round((curMonthRev / prevMonthRev) * 100), 200) : curMonthRev > 0 ? 100 : 0
    const radialChartOptions: ApexOptions = {
        chart: { type: 'radialBar', height: 280, fontFamily: 'inherit' },
        plotOptions: {
            radialBar: {
                startAngle: -135, endAngle: 135,
                hollow: { size: '65%', background: 'transparent' },
                track: {
                    background: alpha('#000', 0.05),
                    strokeWidth: '100%',
                },
                dataLabels: {
                    name: { fontSize: '13px', color: theme.palette.text.secondary, offsetY: -8 },
                    value: {
                        fontSize: '28px',
                        fontWeight: 700,
                        color: radialValue >= 100 ? theme.palette.success.main : theme.palette.warning.main,
                        offsetY: 4,
                        formatter: () => `${radialValue}%`,
                    },
                },
            },
        },
        colors: [radialValue >= 100 ? theme.palette.success.main : radialValue >= 80 ? theme.palette.warning.main : theme.palette.error.main],
        labels: [`vs ${year - 1}`],
    }

    // Gráfico horizontal de barras para comparar métricas del mes
    const hBarOptions: ApexOptions = {
        chart: { type: 'bar', height: 200, toolbar: { show: false }, fontFamily: 'inherit' },
        plotOptions: {
            bar: { horizontal: true, borderRadius: 6, barHeight: '55%' },
        },
        xaxis: {
            labels: {
                formatter: (v: string) => {
                    const n = Number(v)
                    return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { labels: { style: { fontSize: '12px', fontWeight: 600 } } },
        colors: [theme.palette.primary.main, alpha('#9e9e9e', 0.45)],
        dataLabels: {
            enabled: true,
            formatter: (v: number) => fmtSoles(v),
            style: { fontSize: '11px' },
        },
        tooltip: { theme: 'dark', y: { formatter: (v: number) => fmtSoles(v) } },
        legend: { position: 'top', fontSize: '12px', fontWeight: 600 },
        grid: { borderColor: alpha('#000', 0.04), strokeDashArray: 4 },
    }
    const hBarSeries = [
        { name: `${monthName} ${year}`, data: [curMonthRev] },
        { name: `${monthName} ${year - 1}`, data: [prevMonthRev] },
    ]

    // Período descriptivo
    const periodDesc = isAnnualView
        ? isCurrentYear ? `Ene - ${today.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} ${year}` : `Año completo ${year}`
        : (() => {
            const isCurMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
            return isCurMonth ? `1 - ${today.getDate()} de ${monthName} ${year} (en curso)` : `${monthName} ${year}`
        })()

    // Colores accent
    const primary = theme.palette.primary.main
    const success = theme.palette.success.main
    const error = theme.palette.error.main

    return (
        <Box display="flex" flexDirection="column" gap={2.5}>

            {/* === HEADER + SELECTOR DE MES === */}
            <Box sx={{
                ...glassCard(primary, primary),
                p: 2,
                '&::before': {
                    height: '2px',
                    background: `linear-gradient(90deg, ${primary}, ${alpha(primary, 0.1)})`,
                },
            }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                    <Box>
                        <Typography variant="body2" fontWeight={700} color="text.primary" letterSpacing={0.5}>
                            {periodDesc}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Comparando con mismo período de {year - 1}
                        </Typography>
                    </Box>
                    <ToggleButtonGroup
                        value={selectedMonth} exclusive size="small"
                        onChange={(_, v) => { if (v !== null) setSelectedMonth(v) }}
                        sx={{
                            flexWrap: 'wrap',
                            '& .MuiToggleButton-root': {
                                px: 1.2, py: 0.4, textTransform: 'none', fontSize: '0.75rem',
                                fontWeight: 600, borderRadius: '8px !important', border: 'none',
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    background: `linear-gradient(135deg, ${primary}, ${alpha(primary, 0.8)})`,
                                    color: '#fff',
                                    boxShadow: `0 2px 8px ${alpha(primary, 0.3)}`,
                                    '&:hover': { background: `linear-gradient(135deg, ${primary}, ${alpha(primary, 0.7)})` },
                                },
                            },
                        }}
                    >
                        {MONTHS_FILTER.map((m, i) => (
                            <ToggleButton key={i} value={i}>{m}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>
            </Box>

            {/* === KPIs === */}
            <Grid container spacing={2}>
                {[
                    { label: 'Ingreso Total', icon: PaymentsIcon, cur: safeNumber(summary.total_revenue), prev: safeNumber(prevSummary.total_revenue), growth: revGrowth, fmt: fmtSoles, color: primary },
                    { label: 'Reservas', icon: CalendarIcon, cur: safeNumber(summary.total_reservations), prev: safeNumber(prevSummary.total_reservations), growth: resGrowth, fmt: (v: number) => `${v}`, color: '#7c4dff' },
                    { label: 'Noches', icon: NightsIcon, cur: safeNumber(summary.total_nights), prev: safeNumber(prevSummary.total_nights), growth: nightsGrowth, fmt: (v: number) => v.toLocaleString(), color: '#00bfa5' },
                    { label: 'S/ por Noche', icon: HotelIcon, cur: safeNumber(summary.revenue_per_night), prev: safeNumber(prevSummary.revenue_per_night), growth: perNightGrowth, fmt: fmtSoles, color: '#ff6d00' },
                ].map((kpi, idx) => (
                    <Grid item xs={6} md={3} key={idx}>
                        <Box sx={glassCard(kpi.color, kpi.color)}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8} fontSize="0.65rem">
                                        {kpi.label}
                                    </Typography>
                                    <Typography variant="h5" fontWeight={800} mt={0.5} lineHeight={1.2}>
                                        {kpi.fmt(kpi.cur)}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    width: 36, height: 36, borderRadius: 2,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: `linear-gradient(135deg, ${alpha(kpi.color, 0.15)}, ${alpha(kpi.color, 0.05)})`,
                                }}>
                                    <kpi.icon sx={{ fontSize: 18, color: kpi.color }} />
                                </Box>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1.5}>
                                <Box sx={{
                                    display: 'inline-flex', alignItems: 'center', gap: 0.3,
                                    px: 0.8, py: 0.2, borderRadius: 1,
                                    bgcolor: kpi.growth >= 0 ? alpha(success, 0.1) : alpha(error, 0.1),
                                }}>
                                    {kpi.growth >= 0
                                        ? <ArrowUpIcon sx={{ fontSize: 14, color: success }} />
                                        : <ArrowDownIcon sx={{ fontSize: 14, color: error }} />
                                    }
                                    <Typography variant="caption" fontWeight={700} color={kpi.growth >= 0 ? success : error} fontSize="0.7rem">
                                        {fmtPct(kpi.growth)}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                                    vs {year - 1}: {kpi.fmt(kpi.prev)}
                                </Typography>
                            </Stack>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* === GRÁFICAS: VISTA ANUAL === */}
            {isAnnualView && (
                <>
                    {/* Barras: año vs año anterior por mes */}
                    <Box sx={glassCard('#000', '#000')}>
                        <Typography variant="subtitle1" fontWeight={700} mb={0.3}>
                            Ingresos Mensuales: {year} vs {year - 1}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Comparativa mes a mes del ingreso total
                        </Typography>
                        <Chart options={barChartOptions} series={barChartSeries} type="bar" height={380} />
                    </Box>

                    {/* Acumulado */}
                    {cumulativeCurrent.length > 1 && (
                        <Box sx={glassCard('#000', '#000')}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} mb={0.3}>
                                        Ingresos Acumulados
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Evolución acumulada del año — {year} vs {year - 1}
                                    </Typography>
                                </Box>
                                <Chip
                                    size="small"
                                    icon={cumulativeCurrent[cumulativeCurrent.length - 1] >= cumulativePrev[cumulativePrev.length - 1]
                                        ? <TrendingUpIcon sx={{ fontSize: 14 }} />
                                        : <TrendingDownIcon sx={{ fontSize: 14 }} />
                                    }
                                    label={(() => {
                                        const diff = cumulativeCurrent[cumulativeCurrent.length - 1] - cumulativePrev[cumulativePrev.length - 1]
                                        return diff >= 0 ? `+${fmtSoles(diff)} sobre ${year - 1}` : `${fmtSoles(Math.abs(diff))} debajo de ${year - 1}`
                                    })()}
                                    color={cumulativeCurrent[cumulativeCurrent.length - 1] >= cumulativePrev[cumulativePrev.length - 1] ? 'success' : 'error'}
                                    variant="outlined"
                                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                />
                            </Stack>
                            <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={320} />
                        </Box>
                    )}

                    {/* Tabla comparativa */}
                    {periods.length > 0 && (
                        <Box sx={{ ...glassCard('#000', '#000'), p: 0, overflow: 'hidden' }}>
                            <Box px={2.5} pt={2.5} pb={1.5}>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Detalle Mensual
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Desglose mes a mes con diferencia y variación interanual
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', borderBottom: `2px solid ${alpha('#000', 0.08)}` } }}>
                                            <TableCell>Mes</TableCell>
                                            <TableCell align="right">{year}</TableCell>
                                            <TableCell align="right">{year - 1}</TableCell>
                                            <TableCell align="right">Diferencia</TableCell>
                                            <TableCell align="right">Var.</TableCell>
                                            <TableCell align="right">Reservas</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {monthIndices.map((mi, i) => {
                                            const cur = currentRevByMonth[i]
                                            const prev = prevRevByMonth[i]
                                            const diff = cur - prev
                                            const pct = calcGrowth(cur, prev)
                                            const curRes = getMonthData(periods, mi, 'reservations_count')
                                            const prevRes = getMonthData(prevPeriods, mi, 'reservations_count')
                                            const isHighest = cur === Math.max(...currentRevByMonth.filter(v => v > 0))
                                            return (
                                                <TableRow key={mi} hover sx={{
                                                    '& td': { borderBottom: `1px solid ${alpha('#000', 0.04)}`, py: 1.2 },
                                                    ...(isHighest && currentRevByMonth.length > 1 ? { bgcolor: alpha(success, 0.04) } : {}),
                                                }}>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight={600} fontSize="0.8rem">{MONTH_LABELS[mi]}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={700} fontSize="0.8rem">{fmtSoles(cur)}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" color="text.secondary" fontSize="0.8rem">{fmtSoles(prev)}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={600} fontSize="0.8rem" color={diff >= 0 ? success : error}>
                                                            {diff >= 0 ? '+' : ''}{fmtSoles(diff)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Chip
                                                            size="small"
                                                            label={fmtPct(pct)}
                                                            sx={{
                                                                fontWeight: 700, minWidth: 60, height: 22, fontSize: '0.7rem',
                                                                bgcolor: pct >= 0 ? alpha(success, 0.1) : alpha(error, 0.1),
                                                                color: pct >= 0 ? success : error,
                                                                border: 'none',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" component="span" fontWeight={600} fontSize="0.8rem">{curRes}</Typography>
                                                        <Typography variant="body2" component="span" color="text.secondary" fontSize="0.8rem"> / {prevRes}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {/* Fila Total */}
                                        <TableRow sx={{
                                            '& td': { borderTop: `2px solid ${alpha('#000', 0.1)}`, fontWeight: 700, py: 1.5 },
                                            bgcolor: alpha(primary, 0.03),
                                        }}>
                                            <TableCell><Typography variant="body2" fontWeight={800}>Total</Typography></TableCell>
                                            <TableCell align="right"><Typography variant="body2" fontWeight={800}>{fmtSoles(safeNumber(summary.total_revenue))}</Typography></TableCell>
                                            <TableCell align="right"><Typography variant="body2" fontWeight={600} color="text.secondary">{fmtSoles(safeNumber(prevSummary.total_revenue))}</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={800} color={safeNumber(summary.total_revenue) >= safeNumber(prevSummary.total_revenue) ? success : error}>
                                                    {safeNumber(summary.total_revenue) - safeNumber(prevSummary.total_revenue) >= 0 ? '+' : ''}
                                                    {fmtSoles(safeNumber(summary.total_revenue) - safeNumber(prevSummary.total_revenue))}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    size="small"
                                                    label={fmtPct(revGrowth)}
                                                    sx={{
                                                        fontWeight: 800, minWidth: 60, height: 24, fontSize: '0.75rem',
                                                        bgcolor: revGrowth >= 0 ? alpha(success, 0.15) : alpha(error, 0.15),
                                                        color: revGrowth >= 0 ? success : error,
                                                        border: 'none',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight={800}>
                                                    {safeNumber(summary.total_reservations)} / {safeNumber(prevSummary.total_reservations)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </>
            )}

            {/* === GRÁFICAS: VISTA MENSUAL === */}
            {!isAnnualView && (
                <>
                    <Grid container spacing={2}>
                        {/* Radial: rendimiento vs año anterior */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ ...glassCard('#000', '#000'), height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                                    Rendimiento vs {monthName} {year - 1}
                                </Typography>
                                <Chart options={radialChartOptions} series={[radialValue]} type="radialBar" height={240} />
                                <Typography variant="caption" color="text.secondary" textAlign="center" mt={-1}>
                                    {radialValue >= 100
                                        ? `Superaste el ingreso de ${monthName} ${year - 1}`
                                        : `Falta ${fmtSoles(prevMonthRev - curMonthRev)} para alcanzar ${year - 1}`
                                    }
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Barras horizontales: comparación directa */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ ...glassCard('#000', '#000'), height: '100%' }}>
                                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                                    {monthName}: {year} vs {year - 1}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    Comparación directa de ingresos
                                </Typography>
                                <Chart options={hBarOptions} series={hBarSeries} type="bar" height={140} />

                                {/* Métricas detalladas del mes */}
                                <Grid container spacing={2} mt={1}>
                                    {[
                                        { label: 'Reservas', cur: curMonthRes, prev: prevMonthRes },
                                        { label: 'Noches', cur: curMonthNights, prev: prevMonthNights },
                                        { label: 'Prom/Reserva', cur: curMonthRes > 0 ? curMonthRev / curMonthRes : 0, prev: prevMonthRes > 0 ? prevMonthRev / prevMonthRes : 0, isCurrency: true },
                                    ].map((m, i) => {
                                        const g = calcGrowth(m.cur, m.prev)
                                        return (
                                            <Grid item xs={4} key={i}>
                                                <Box sx={{
                                                    p: 1.5, borderRadius: 2,
                                                    bgcolor: alpha('#000', 0.02),
                                                    textAlign: 'center',
                                                }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} fontSize="0.65rem" textTransform="uppercase">
                                                        {m.label}
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
                                                        {(m as any).isCurrency ? fmtSoles(Math.round(m.cur)) : m.cur}
                                                    </Typography>
                                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.3}>
                                                        <Typography variant="caption" fontWeight={600} color={g >= 0 ? success : error} fontSize="0.65rem">
                                                            {fmtPct(g)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
                                                            (ant: {(m as any).isCurrency ? fmtSoles(Math.round(m.prev)) : m.prev})
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Contexto: el mes dentro del año */}
                    <Box sx={glassCard('#000', '#000')}>
                        <Typography variant="subtitle2" fontWeight={700} mb={1}>
                            {monthName} en contexto — Ingresos de {year}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                            Evolución anual con {monthName} destacado
                        </Typography>
                        <Chart
                            options={{
                                chart: { type: 'bar', height: 250, toolbar: { show: false }, fontFamily: 'inherit' },
                                plotOptions: { bar: { borderRadius: 5, columnWidth: '50%', distributed: true } },
                                xaxis: {
                                    categories: MONTH_LABELS.slice(0, isCurrentYear ? today.getMonth() + 1 : 12),
                                    labels: { style: { fontSize: '11px', fontWeight: 600 } },
                                    axisBorder: { show: false },
                                    axisTicks: { show: false },
                                },
                                yaxis: {
                                    labels: {
                                        formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
                                        style: { fontSize: '11px' },
                                    },
                                },
                                colors: Array.from({ length: isCurrentYear ? today.getMonth() + 1 : 12 }, (_, i) =>
                                    i === selectedMonth - 1 ? primary : alpha('#9e9e9e', 0.35)
                                ),
                                dataLabels: { enabled: false },
                                tooltip: { theme: 'dark', y: { formatter: (v: number) => fmtSoles(v) } },
                                grid: { borderColor: alpha('#000', 0.04), strokeDashArray: 4 },
                                legend: { show: false },
                            } as ApexOptions}
                            series={[{
                                name: 'Ingresos',
                                data: Array.from({ length: isCurrentYear ? today.getMonth() + 1 : 12 }, (_, i) => {
                                    const fyPeriods = safeArray(fullYearData?.data?.revenue_by_period)
                                    return getMonthData(fyPeriods, i, 'revenue')
                                }),
                            }]}
                            type="bar"
                            height={250}
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}
