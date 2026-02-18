import { Box, Typography, Stack, Alert, CircularProgress, Chip } from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
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

const fmtSoles = (v: number) => `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

// Estilo base de card — consistente con el admin panel
const cardSx = {
    background: '#FFFFFF',
    borderRadius: 2,
    boxShadow: '3px 7px 30px 0px rgba(0,0,0,0.12)',
    p: 3,
}

// Colores consistentes con el panel
const COLORS = {
    primary: '#0E6191',
    accent: '#FF5733',
    green: '#4CAF50',
    orange: '#FF9800',
    teal: '#9EE5ED',
    pink: '#FFBBBD',
    gridLine: '#E6E5E7',
    axisLabel: '#ACAAB1',
    textPrimary: '#000F08',
    textSecondary: '#444151',
}

export default function IngresosDashboard({ year }: IngresosDashboardProps) {
    const [selectedMonth, setSelectedMonth] = useState(0) // 0 = Todo el año

    const today = new Date()
    const isCurrentYear = year === today.getFullYear()
    const maxMonth = isCurrentYear ? today.getMonth() + 1 : 12

    // Rango del período seleccionado
    const dateRange = useMemo(() => {
        if (selectedMonth === 0) {
            return {
                from: `${year}-01-01`,
                to: isCurrentYear
                    ? `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                    : `${year}-12-31`,
            }
        }
        const mm = String(selectedMonth).padStart(2, '0')
        const lastDay = new Date(year, selectedMonth, 0).getDate()
        const isCurMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
        return {
            from: `${year}-${mm}-01`,
            to: isCurMonth
                ? `${year}-${mm}-${String(today.getDate()).padStart(2, '0')}`
                : `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
        }
    }, [year, selectedMonth, isCurrentYear])

    // Mismo período del año anterior
    const prevDateRange = useMemo(() => {
        if (selectedMonth === 0) {
            return {
                from: `${year - 1}-01-01`,
                to: isCurrentYear
                    ? `${year - 1}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(Math.min(today.getDate(), 28)).padStart(2, '0')}`
                    : `${year - 1}-12-31`,
            }
        }
        const mm = String(selectedMonth).padStart(2, '0')
        const lastDay = new Date(year - 1, selectedMonth, 0).getDate()
        const isCurMonth = isCurrentYear && selectedMonth === today.getMonth() + 1
        return {
            from: `${year - 1}-${mm}-01`,
            to: isCurMonth
                ? `${year - 1}-${mm}-${String(Math.min(today.getDate(), lastDay)).padStart(2, '0')}`
                : `${year - 1}-${mm}-${String(lastDay).padStart(2, '0')}`,
        }
    }, [year, selectedMonth, isCurrentYear])

    // Año completo (para gráfico de contexto en vista mensual)
    const fullYearRange = useMemo(() => ({
        from: `${year}-01-01`,
        to: isCurrentYear
            ? `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            : `${year}-12-31`,
    }), [year, isCurrentYear])

    // Queries
    const { data: currentData, isLoading: loadingCurrent, error: errorCurrent } = useGetIngresosQuery({
        date_from: dateRange.from, date_to: dateRange.to, period: 'month', currency: 'PEN',
    })
    const { data: prevData, isLoading: loadingPrev } = useGetIngresosQuery({
        date_from: prevDateRange.from, date_to: prevDateRange.to, period: 'month', currency: 'PEN',
    })
    const { data: fullYearData } = useGetIngresosQuery(
        { date_from: fullYearRange.from, date_to: fullYearRange.to, period: 'month', currency: 'PEN' },
        { skip: selectedMonth === 0 },
    )

    // Loading
    if (loadingCurrent || loadingPrev) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress size={40} />
            </Box>
        )
    }
    if (errorCurrent || !currentData?.success || !currentData?.data) {
        return <Alert severity="error">Error al cargar las estadísticas.</Alert>
    }

    const summary: any = currentData.data.revenue_summary || {}
    const prevSummary: any = prevData?.data?.revenue_summary || {}
    const periods = safeArray(currentData.data.revenue_by_period)
    const prevPeriods = safeArray(prevData?.data?.revenue_by_period)

    const growth = (cur: number, prev: number) => prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? 100 : 0

    // Extractor de datos por mes
    const getVal = (arr: any[], monthIdx: number, field: string) => {
        const p = arr.find((item: any) => item?.period && new Date(item.period + 'T00:00:00').getMonth() === monthIdx)
        return safeNumber(p?.[field], 0)
    }

    const isAnnual = selectedMonth === 0
    const monthIndices = isAnnual
        ? Array.from({ length: maxMonth }, (_, i) => i)
        : [selectedMonth - 1]

    const curRevArr = monthIndices.map(i => getVal(periods, i, 'revenue'))
    const prevRevArr = monthIndices.map(i => getVal(prevPeriods, i, 'revenue'))
    const labels = monthIndices.map(i => MONTH_LABELS[i])

    // KPI values
    const totalRev = safeNumber(summary.total_revenue)
    const prevTotalRev = safeNumber(prevSummary.total_revenue)
    const totalRes = safeNumber(summary.total_reservations)
    const prevTotalRes = safeNumber(prevSummary.total_reservations)
    const totalNights = safeNumber(summary.total_nights)
    const prevTotalNights = safeNumber(prevSummary.total_nights)
    const revPerNight = safeNumber(summary.revenue_per_night)
    const prevRevPerNight = safeNumber(prevSummary.revenue_per_night)

    // Período label
    const monthName = selectedMonth > 0 ? MONTH_FULL[selectedMonth - 1] : ''
    const periodLabel = isAnnual
        ? (isCurrentYear ? `Ene – ${today.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} ${year}` : `Año ${year}`)
        : (() => {
            const isCur = isCurrentYear && selectedMonth === today.getMonth() + 1
            return isCur ? `${monthName} ${year} (en curso)` : `${monthName} ${year}`
        })()

    // ===== CHARTS =====

    // Barras año vs año anterior (anual: por mes, mensual: un solo par)
    const barOptions: ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: {
            bar: {
                borderRadius: 9,
                borderRadiusApplication: 'end' as any,
                columnWidth: isAnnual ? '65%' : '45%',
            },
        },
        xaxis: {
            categories: labels,
            labels: { style: { colors: COLORS.axisLabel, fontSize: '12px' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
                style: { colors: [COLORS.axisLabel], fontSize: '11px' },
            },
        },
        colors: [COLORS.accent, '#D4D4D4'],
        dataLabels: { enabled: false },
        tooltip: { enabled: true, y: { formatter: (v: number) => fmtSoles(v) } },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { position: 'top', fontSize: '13px', fontWeight: 500 },
    }
    const barSeries = [
        { name: `${year}`, data: curRevArr },
        { name: `${year - 1}`, data: prevRevArr },
    ]

    // Acumulado (solo anual)
    let cumCur: number[] = []
    let cumPrev: number[] = []
    if (isAnnual && monthIndices.length > 1) {
        let aCur = 0, aPrev = 0
        monthIndices.forEach(i => {
            aCur += getVal(periods, i, 'revenue')
            aPrev += getVal(prevPeriods, i, 'revenue')
            cumCur.push(aCur)
            cumPrev.push(aPrev)
        })
    }

    const areaOptions: ApexOptions = {
        chart: { type: 'area', toolbar: { show: false } },
        xaxis: {
            categories: labels,
            labels: { style: { colors: COLORS.axisLabel, fontSize: '11px' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
                style: { colors: [COLORS.axisLabel], fontSize: '11px' },
            },
        },
        colors: [COLORS.primary, '#B0BEC5'],
        stroke: { width: [3, 2], curve: 'smooth', dashArray: [0, 6] },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.15, opacityTo: 0.01 } },
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: (v: number) => fmtSoles(v) } },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { position: 'top', fontSize: '13px', fontWeight: 500 },
    }

    // Gráfico de contexto (vista mensual): todos los meses, el seleccionado resaltado
    const contextMonths = Array.from({ length: maxMonth }, (_, i) => i)
    const fyPeriods = safeArray(fullYearData?.data?.revenue_by_period)
    const contextData = contextMonths.map(i => getVal(fyPeriods, i, 'revenue'))
    const contextColors = contextMonths.map(i => i === selectedMonth - 1 ? COLORS.accent : '#D4D4D4')

    const contextOptions: ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: {
            bar: { borderRadius: 9, borderRadiusApplication: 'end' as any, columnWidth: '55%', distributed: true },
        },
        xaxis: {
            categories: contextMonths.map(i => MONTH_LABELS[i]),
            labels: { style: { colors: COLORS.axisLabel, fontSize: '11px', fontWeight: 600 } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
                style: { colors: [COLORS.axisLabel], fontSize: '11px' },
            },
        },
        colors: contextColors,
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: (v: number) => fmtSoles(v) } },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { show: false },
    }

    // Vista mensual: métricas detalladas
    const mRes = isAnnual ? 0 : getVal(periods, selectedMonth - 1, 'reservations_count')
    const mResPrev = isAnnual ? 0 : getVal(prevPeriods, selectedMonth - 1, 'reservations_count')
    const mNights = isAnnual ? 0 : getVal(periods, selectedMonth - 1, 'nights')
    const mNightsPrev = isAnnual ? 0 : getVal(prevPeriods, selectedMonth - 1, 'nights')
    const mAvgPerRes = mRes > 0 ? curRevArr[0] / mRes : 0
    const mAvgPerResPrev = mResPrev > 0 ? prevRevArr[0] / mResPrev : 0

    return (
        <Box display="flex" flexDirection="column" gap={3}>

            {/* ========== SELECTOR DE MES ========== */}
            <Box sx={cardSx}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                    <Box>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary }}>
                            {periodLabel}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: 13, color: COLORS.axisLabel, mt: 0.5 }}>
                            Comparando con mismo período de {year - 1}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {['Todo', ...MONTH_LABELS.slice(0, maxMonth)].map((m, i) => (
                            <Chip
                                key={i}
                                label={m}
                                size="small"
                                onClick={() => setSelectedMonth(i)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    ...(selectedMonth === i
                                        ? { bgcolor: COLORS.primary, color: '#fff', '&:hover': { bgcolor: COLORS.primary } }
                                        : { bgcolor: '#F5F5F5', color: COLORS.textSecondary, '&:hover': { bgcolor: '#EBEBEB' } }
                                    ),
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Box>

            {/* ========== KPIs ========== */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2.5,
            }}>
                {[
                    { label: 'Ingreso Total', value: totalRev, prev: prevTotalRev, fmt: fmtSoles, borderColor: COLORS.teal },
                    { label: 'Reservas', value: totalRes, prev: prevTotalRes, fmt: (v: number) => `${v}`, borderColor: COLORS.green },
                    { label: 'Noches Vendidas', value: totalNights, prev: prevTotalNights, fmt: (v: number) => v.toLocaleString(), borderColor: COLORS.orange },
                    { label: 'S/ por Noche', value: revPerNight, prev: prevRevPerNight, fmt: fmtSoles, borderColor: COLORS.pink },
                ].map((kpi, i) => {
                    const g = growth(kpi.value, kpi.prev)
                    return (
                        <Box key={i} sx={{
                            ...cardSx,
                            borderBottom: `3.5px solid ${kpi.borderColor}`,
                            p: 2.5,
                        }}>
                            <Typography variant="body1" sx={{ fontSize: 13, color: COLORS.axisLabel, fontWeight: 400 }}>
                                {kpi.label}
                            </Typography>
                            <Typography variant="h4" sx={{ fontSize: 28, fontWeight: 800, color: COLORS.textPrimary, mt: 0.5 }}>
                                {kpi.fmt(kpi.value)}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                    {g >= 0
                                        ? <TrendingUpIcon sx={{ fontSize: 16, color: COLORS.green }} />
                                        : <TrendingDownIcon sx={{ fontSize: 16, color: '#e53935' }} />
                                    }
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: g >= 0 ? COLORS.green : '#e53935' }}>
                                        {fmtPct(g)}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>
                                    {year - 1}: {kpi.fmt(kpi.prev)}
                                </Typography>
                            </Stack>
                        </Box>
                    )
                })}
            </Box>

            {/* ========== VISTA ANUAL ========== */}
            {isAnnual && (
                <>
                    {/* Barras: mes a mes año vs año anterior */}
                    <Box sx={cardSx}>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary, mb: 0.5 }}>
                            Ingresos mensuales — {year} vs {year - 1}
                        </Typography>
                        <Chart options={barOptions} series={barSeries} type="bar" height={350} />
                    </Box>

                    {/* Acumulado */}
                    {cumCur.length > 1 && (
                        <Box sx={cardSx}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary }}>
                                    Ingresos acumulados — {year} vs {year - 1}
                                </Typography>
                                {(() => {
                                    const diff = cumCur[cumCur.length - 1] - cumPrev[cumPrev.length - 1]
                                    const positive = diff >= 0
                                    return (
                                        <Typography sx={{
                                            fontSize: 13, fontWeight: 600,
                                            color: positive ? COLORS.green : '#e53935',
                                        }}>
                                            {positive ? '+' : ''}{fmtSoles(diff)} vs {year - 1}
                                        </Typography>
                                    )
                                })()}
                            </Stack>
                            <Chart options={areaOptions} series={[
                                { name: `${year}`, data: cumCur },
                                { name: `${year - 1}`, data: cumPrev },
                            ]} type="area" height={300} />
                        </Box>
                    )}

                    {/* Tabla comparativa */}
                    {periods.length > 0 && (
                        <Box sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
                            <Box px={3} pt={3} pb={1}>
                                <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary }}>
                                    Detalle mensual
                                </Typography>
                            </Box>
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                                <Box component="thead">
                                    <Box component="tr" sx={{ borderBottom: `2px solid ${COLORS.gridLine}` }}>
                                        {['Mes', `${year}`, `${year - 1}`, 'Diferencia', 'Var.', 'Reservas'].map((h, i) => (
                                            <Box component="th" key={i} sx={{
                                                py: 1.5, px: 2,
                                                textAlign: i === 0 ? 'left' : 'right',
                                                fontSize: 12, fontWeight: 600,
                                                color: COLORS.axisLabel,
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                            }}>
                                                {h}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                <Box component="tbody">
                                    {monthIndices.map((mi, i) => {
                                        const cur = curRevArr[i]
                                        const prev = prevRevArr[i]
                                        const diff = cur - prev
                                        const pct = growth(cur, prev)
                                        const curRes = getVal(periods, mi, 'reservations_count')
                                        const prevRes = getVal(prevPeriods, mi, 'reservations_count')
                                        return (
                                            <Box component="tr" key={mi} sx={{
                                                borderBottom: `1px solid ${COLORS.gridLine}`,
                                                '&:hover': { bgcolor: '#FAFAFA' },
                                            }}>
                                                <Box component="td" sx={{ py: 1.5, px: 2, fontWeight: 600, color: COLORS.textPrimary }}>
                                                    {MONTH_LABELS[mi]}
                                                </Box>
                                                <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', fontWeight: 700, color: COLORS.textPrimary }}>
                                                    {fmtSoles(cur)}
                                                </Box>
                                                <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', color: COLORS.axisLabel }}>
                                                    {fmtSoles(prev)}
                                                </Box>
                                                <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', fontWeight: 600, color: diff >= 0 ? COLORS.green : '#e53935' }}>
                                                    {diff >= 0 ? '+' : ''}{fmtSoles(diff)}
                                                </Box>
                                                <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right' }}>
                                                    <Box component="span" sx={{
                                                        display: 'inline-block',
                                                        px: 1, py: 0.3, borderRadius: 1,
                                                        fontSize: 12, fontWeight: 600,
                                                        bgcolor: pct >= 0 ? '#E8F5E9' : '#FFEBEE',
                                                        color: pct >= 0 ? COLORS.green : '#e53935',
                                                    }}>
                                                        {fmtPct(pct)}
                                                    </Box>
                                                </Box>
                                                <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', color: COLORS.textPrimary }}>
                                                    <Box component="span" sx={{ fontWeight: 600 }}>{curRes}</Box>
                                                    <Box component="span" sx={{ color: COLORS.axisLabel }}> / {prevRes}</Box>
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                    {/* Fila total */}
                                    <Box component="tr" sx={{ bgcolor: '#F5F5F5', borderTop: `2px solid ${COLORS.gridLine}` }}>
                                        <Box component="td" sx={{ py: 2, px: 2, fontWeight: 800, color: COLORS.textPrimary }}>Total</Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 800, color: COLORS.textPrimary }}>{fmtSoles(totalRev)}</Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 600, color: COLORS.axisLabel }}>{fmtSoles(prevTotalRev)}</Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 800, color: totalRev >= prevTotalRev ? COLORS.green : '#e53935' }}>
                                            {totalRev - prevTotalRev >= 0 ? '+' : ''}{fmtSoles(totalRev - prevTotalRev)}
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right' }}>
                                            <Box component="span" sx={{
                                                display: 'inline-block',
                                                px: 1, py: 0.3, borderRadius: 1,
                                                fontSize: 12, fontWeight: 700,
                                                bgcolor: growth(totalRev, prevTotalRev) >= 0 ? '#E8F5E9' : '#FFEBEE',
                                                color: growth(totalRev, prevTotalRev) >= 0 ? COLORS.green : '#e53935',
                                            }}>
                                                {fmtPct(growth(totalRev, prevTotalRev))}
                                            </Box>
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 800, color: COLORS.textPrimary }}>
                                            {totalRes} <Box component="span" sx={{ color: COLORS.axisLabel, fontWeight: 400 }}>/ {prevTotalRes}</Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </>
            )}

            {/* ========== VISTA MENSUAL ========== */}
            {!isAnnual && (
                <>
                    {/* Comparación directa del mes */}
                    <Box sx={cardSx}>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary, mb: 0.5 }}>
                            {monthName} — {year} vs {year - 1}
                        </Typography>
                        <Chart options={barOptions} series={barSeries} type="bar" height={220} />
                    </Box>

                    {/* Métricas detalladas del mes */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
                        gap: 2,
                    }}>
                        {[
                            { label: 'Reservas', cur: mRes, prev: mResPrev, fmt: (v: number) => `${v}`, borderColor: COLORS.green },
                            { label: 'Noches', cur: mNights, prev: mNightsPrev, fmt: (v: number) => `${v}`, borderColor: COLORS.orange },
                            { label: 'Promedio / Reserva', cur: mAvgPerRes, prev: mAvgPerResPrev, fmt: fmtSoles, borderColor: COLORS.teal },
                        ].map((m, i) => {
                            const g = growth(m.cur, m.prev)
                            return (
                                <Box key={i} sx={{ ...cardSx, borderBottom: `3.5px solid ${m.borderColor}`, p: 2.5 }}>
                                    <Typography sx={{ fontSize: 13, color: COLORS.axisLabel }}>{m.label}</Typography>
                                    <Typography sx={{ fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, mt: 0.5 }}>
                                        {m.fmt(Math.round(m.cur))}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: g >= 0 ? COLORS.green : '#e53935' }}>
                                            {fmtPct(g)}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>
                                            (ant: {m.fmt(Math.round(m.prev))})
                                        </Typography>
                                    </Stack>
                                </Box>
                            )
                        })}
                    </Box>

                    {/* Contexto: el mes dentro del año */}
                    <Box sx={cardSx}>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary, mb: 0.5 }}>
                            {monthName} en contexto — Todos los meses de {year}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: COLORS.axisLabel, mb: 1 }}>
                            El mes seleccionado se muestra en naranja
                        </Typography>
                        <Chart
                            options={contextOptions}
                            series={[{ name: 'Ingresos', data: contextData }]}
                            type="bar"
                            height={250}
                        />
                    </Box>
                </>
            )}
        </Box>
    )
}
