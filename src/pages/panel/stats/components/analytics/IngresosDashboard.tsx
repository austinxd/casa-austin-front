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

const cardSx = {
    background: '#FFFFFF',
    borderRadius: 2,
    boxShadow: '3px 7px 30px 0px rgba(0,0,0,0.12)',
    p: 3,
}

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
    projected: '#FFD9CC', // naranja claro para proyecciones
}

export default function IngresosDashboard({ year }: IngresosDashboardProps) {
    const [selectedMonth, setSelectedMonth] = useState(0)

    const today = new Date()
    const isCurrentYear = year === today.getFullYear()
    const maxMonth = isCurrentYear ? today.getMonth() + 1 : 12

    // --- Rangos ---
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

    // Año anterior COMPLETO (para proyecciones de meses futuros)
    const prevFullYearRange = useMemo(() => ({
        from: `${year - 1}-01-01`,
        to: `${year - 1}-12-31`,
    }), [year])

    // Año completo actual (para gráfico contexto en vista mensual)
    const fullYearRange = useMemo(() => ({
        from: `${year}-01-01`,
        to: isCurrentYear
            ? `${year}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            : `${year}-12-31`,
    }), [year, isCurrentYear])

    // --- Queries ---
    const { data: currentData, isLoading: loadingCurrent, error: errorCurrent } = useGetIngresosQuery({
        date_from: dateRange.from, date_to: dateRange.to, period: 'month', currency: 'PEN',
    })
    const { data: prevData, isLoading: loadingPrev } = useGetIngresosQuery({
        date_from: prevDateRange.from, date_to: prevDateRange.to, period: 'month', currency: 'PEN',
    })
    // Año anterior completo (12 meses) — para proyecciones
    const { data: prevFullData } = useGetIngresosQuery(
        { date_from: prevFullYearRange.from, date_to: prevFullYearRange.to, period: 'month', currency: 'PEN' },
        { skip: !isCurrentYear || selectedMonth !== 0 },
    )
    // Año actual completo (para contexto en vista mensual)
    const { data: fullYearData } = useGetIngresosQuery(
        { date_from: fullYearRange.from, date_to: fullYearRange.to, period: 'month', currency: 'PEN' },
        { skip: selectedMonth === 0 },
    )

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
    const prevFullPeriods = safeArray(prevFullData?.data?.revenue_by_period)

    const calc = (cur: number, prev: number) => prev > 0 ? ((cur - prev) / prev) * 100 : cur > 0 ? 100 : 0

    const getVal = (arr: any[], monthIdx: number, field: string) => {
        const p = arr.find((item: any) => item?.period && new Date(item.period + 'T00:00:00').getMonth() === monthIdx)
        return safeNumber(p?.[field], 0)
    }

    const isAnnual = selectedMonth === 0

    // --- KPIs (solo datos reales) ---
    const totalRev = safeNumber(summary.total_revenue)
    const prevTotalRev = safeNumber(prevSummary.total_revenue)
    const totalRes = safeNumber(summary.total_reservations)
    const prevTotalRes = safeNumber(prevSummary.total_reservations)
    const totalNights = safeNumber(summary.total_nights)
    const prevTotalNights = safeNumber(prevSummary.total_nights)
    const revPerNight = safeNumber(summary.revenue_per_night)
    const prevRevPerNight = safeNumber(prevSummary.revenue_per_night)

    const monthName = selectedMonth > 0 ? MONTH_FULL[selectedMonth - 1] : ''
    const periodLabel = isAnnual
        ? (isCurrentYear ? `Ene – ${today.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} ${year}` : `Año ${year}`)
        : (() => {
            const isCur = isCurrentYear && selectedMonth === today.getMonth() + 1
            return isCur ? `${monthName} ${year} (en curso)` : `${monthName} ${year}`
        })()

    // ===== DATOS PARA VISTA ANUAL =====
    // Para año actual: mostrar 12 meses, los reales + proyecciones
    const showProjections = isAnnual && isCurrentYear && prevFullPeriods.length > 0

    // Datos reales (meses transcurridos)
    const realMonths = Array.from({ length: maxMonth }, (_, i) => i)
    const realRevArr = realMonths.map(i => getVal(periods, i, 'revenue'))

    // Datos del año anterior completo (12 meses)
    const prevFullRevArr = Array.from({ length: 12 }, (_, i) => getVal(prevFullPeriods, i, 'revenue'))

    // Para meses pasados del año anterior (misma ventana que datos reales)
    const prevSamePeriodArr = realMonths.map(i => getVal(prevPeriods, i, 'revenue'))

    // Calcular factor de ritmo: cómo va el año actual vs el anterior en el mismo período
    const realTotal = realRevArr.reduce((a, b) => a + b, 0)
    const prevSameTotal = prevSamePeriodArr.reduce((a, b) => a + b, 0)
    const paceRatio = prevSameTotal > 0 ? realTotal / prevSameTotal : 1

    // Proyecciones para meses futuros: dato año anterior * factor de ritmo
    const futureMonths = Array.from({ length: 12 - maxMonth }, (_, i) => maxMonth + i)
    const projectedRevArr = futureMonths.map(i => Math.round(prevFullRevArr[i] * paceRatio))

    // Proyección total del año
    const projectedYearTotal = realTotal + projectedRevArr.reduce((a, b) => a + b, 0)
    const prevYearFullTotal = prevFullRevArr.reduce((a, b) => a + b, 0)

    // Para el gráfico: 3 series en vista anual con proyecciones
    const allMonthLabels = MONTH_LABELS

    // Serie "Real" — datos hasta maxMonth, null después
    const serieReal = Array.from({ length: 12 }, (_, i) =>
        i < maxMonth ? realRevArr[i] : null
    )
    // Serie "Proyección" — null hasta maxMonth, proyección después
    const serieProjection = Array.from({ length: 12 }, (_, i) =>
        i >= maxMonth ? projectedRevArr[i - maxMonth] : null
    )
    // Serie "Año anterior" — 12 meses completos
    const seriePrevYear = prevFullRevArr

    // --- Gráfico barras anual con proyecciones ---
    const annualBarOptions: ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false }, stacked: false },
        plotOptions: {
            bar: {
                borderRadius: 9,
                borderRadiusApplication: 'end' as any,
                columnWidth: '70%',
            },
        },
        xaxis: {
            categories: allMonthLabels,
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
        colors: [COLORS.accent, COLORS.projected, '#D4D4D4'],
        fill: {
            opacity: [1, 0.6, 0.4],
        },
        dataLabels: { enabled: false },
        tooltip: {
            y: { formatter: (v: number) => v ? fmtSoles(v) : '—' },
        },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { position: 'top', fontSize: '13px', fontWeight: 500 },
    }
    const annualBarSeries = showProjections ? [
        { name: `${year} (Real)`, data: serieReal as any },
        { name: `${year} (Proyección)`, data: serieProjection as any },
        { name: `${year - 1}`, data: seriePrevYear },
    ] : [
        { name: `${year}`, data: realRevArr },
        { name: `${year - 1}`, data: prevSamePeriodArr },
    ]
    const annualBarLabels = showProjections ? allMonthLabels : realMonths.map(i => MONTH_LABELS[i])

    // Override categories para no-proyección
    const annualBarFinalOptions = {
        ...annualBarOptions,
        xaxis: { ...annualBarOptions.xaxis, categories: annualBarLabels },
        ...(showProjections ? {} : {
            colors: [COLORS.accent, '#D4D4D4'],
            fill: { opacity: [1, 0.4] },
        }),
    }

    // --- Acumulado con proyección ---
    let cumReal: number[] = []
    let cumPrev: number[] = []
    let cumProjected: (number | null)[] = []

    if (isAnnual) {
        if (showProjections) {
            // Acumulado real
            let acc = 0
            for (let i = 0; i < 12; i++) {
                if (i < maxMonth) {
                    acc += realRevArr[i]
                    cumReal.push(acc)
                    cumProjected.push(null)
                } else {
                    cumReal.push(acc) // se queda plano
                    cumProjected.push(acc + projectedRevArr.slice(0, i - maxMonth + 1).reduce((a, b) => a + b, 0))
                }
            }
            // Acumulado año anterior completo
            let accP = 0
            for (let i = 0; i < 12; i++) {
                accP += prevFullRevArr[i]
                cumPrev.push(accP)
            }
        } else {
            let aCur = 0, aPrev = 0
            realMonths.forEach(i => {
                aCur += realRevArr[i]
                aPrev += prevSamePeriodArr[i]
                cumReal.push(aCur)
                cumPrev.push(aPrev)
            })
        }
    }

    const areaOptions: ApexOptions = {
        chart: { type: 'area', toolbar: { show: false } },
        xaxis: {
            categories: showProjections ? allMonthLabels : realMonths.map(i => MONTH_LABELS[i]),
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
        colors: showProjections ? [COLORS.primary, COLORS.accent, '#B0BEC5'] : [COLORS.primary, '#B0BEC5'],
        stroke: showProjections
            ? { width: [3, 2, 2], curve: 'smooth', dashArray: [0, 6, 6] }
            : { width: [3, 2], curve: 'smooth', dashArray: [0, 6] },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.15, opacityTo: 0.01 } },
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: (v: number) => v ? fmtSoles(v) : '—' } },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { position: 'top', fontSize: '13px', fontWeight: 500 },
    }
    const areaSeries = showProjections ? [
        { name: `${year} (Real)`, data: cumReal },
        { name: `${year} (Proyección)`, data: cumProjected as any },
        { name: `${year - 1}`, data: cumPrev },
    ] : [
        { name: `${year}`, data: cumReal },
        { name: `${year - 1}`, data: cumPrev },
    ]

    // --- Barras simple para vista mensual ---
    const monthIndices = isAnnual ? realMonths : [selectedMonth - 1]
    const curRevArr = monthIndices.map(i => getVal(periods, i, 'revenue'))
    const prevRevArr = monthIndices.map(i => getVal(prevPeriods, i, 'revenue'))

    const simpleBarOptions: ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 9, borderRadiusApplication: 'end' as any, columnWidth: '45%' } },
        xaxis: {
            categories: monthIndices.map(i => MONTH_LABELS[i]),
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
        tooltip: { y: { formatter: (v: number) => fmtSoles(v) } },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { position: 'top', fontSize: '13px', fontWeight: 500 },
    }

    // --- Contexto mensual ---
    const contextMonths = Array.from({ length: maxMonth }, (_, i) => i)
    const fyPeriods = safeArray(fullYearData?.data?.revenue_by_period)
    const contextData = contextMonths.map(i => getVal(fyPeriods, i, 'revenue'))
    const contextColors = contextMonths.map(i => i === selectedMonth - 1 ? COLORS.accent : '#D4D4D4')
    const contextOptions: ApexOptions = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 9, borderRadiusApplication: 'end' as any, columnWidth: '55%', distributed: true } },
        xaxis: {
            categories: contextMonths.map(i => MONTH_LABELS[i]),
            labels: { style: { colors: COLORS.axisLabel, fontSize: '11px', fontWeight: 600 } },
            axisBorder: { show: false }, axisTicks: { show: false },
        },
        yaxis: { labels: { formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`, style: { colors: [COLORS.axisLabel], fontSize: '11px' } } },
        colors: contextColors,
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: (v: number) => fmtSoles(v) } },
        grid: { borderColor: COLORS.gridLine, strokeDashArray: 12 },
        legend: { show: false },
    }

    // Métricas vista mensual
    const mRes = isAnnual ? 0 : getVal(periods, selectedMonth - 1, 'reservations_count')
    const mResPrev = isAnnual ? 0 : getVal(prevPeriods, selectedMonth - 1, 'reservations_count')
    const mNights = isAnnual ? 0 : getVal(periods, selectedMonth - 1, 'nights')
    const mNightsPrev = isAnnual ? 0 : getVal(prevPeriods, selectedMonth - 1, 'nights')
    const mAvgPerRes = mRes > 0 ? curRevArr[0] / mRes : 0
    const mAvgPerResPrev = mResPrev > 0 ? prevRevArr[0] / mResPrev : 0

    // --- Tabla datos (anual) ---
    // Combina meses reales + proyectados
    const tableRows = isAnnual ? Array.from({ length: showProjections ? 12 : maxMonth }, (_, i) => {
        const isReal = i < maxMonth
        const cur = isReal ? realRevArr[i] : projectedRevArr[i - maxMonth]
        const prev = showProjections ? prevFullRevArr[i] : prevSamePeriodArr[i]
        const diff = cur - prev
        const pct = calc(cur, prev)
        const curRes = isReal ? getVal(periods, i, 'reservations_count') : '—'
        const prevRes = showProjections ? getVal(prevFullPeriods, i, 'reservations_count') : getVal(prevPeriods, i, 'reservations_count')
        return { mi: i, isReal, cur, prev, diff, pct, curRes, prevRes }
    }) : []

    return (
        <Box display="flex" flexDirection="column" gap={3}>

            {/* ========== SELECTOR ========== */}
            <Box sx={cardSx}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                    <Box>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary }}>
                            {periodLabel}
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: 13, color: COLORS.axisLabel, mt: 0.5 }}>
                            Comparando con mismo período de {year - 1}
                            {showProjections && <> — <Box component="span" sx={{ color: COLORS.accent, fontWeight: 600 }}>con proyecciones</Box></>}
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
                                    fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
                {[
                    { label: 'Ingreso Total', value: totalRev, prev: prevTotalRev, fmt: fmtSoles, borderColor: COLORS.teal },
                    { label: 'Reservas', value: totalRes, prev: prevTotalRes, fmt: (v: number) => `${v}`, borderColor: COLORS.green },
                    { label: 'Noches Vendidas', value: totalNights, prev: prevTotalNights, fmt: (v: number) => v.toLocaleString(), borderColor: COLORS.orange },
                    { label: 'S/ por Noche', value: revPerNight, prev: prevRevPerNight, fmt: fmtSoles, borderColor: COLORS.pink },
                ].map((kpi, i) => {
                    const g = calc(kpi.value, kpi.prev)
                    return (
                        <Box key={i} sx={{ ...cardSx, borderBottom: `3.5px solid ${kpi.borderColor}`, p: 2.5 }}>
                            <Typography sx={{ fontSize: 13, color: COLORS.axisLabel }}>{kpi.label}</Typography>
                            <Typography sx={{ fontSize: 28, fontWeight: 800, color: COLORS.textPrimary, mt: 0.5 }}>{kpi.fmt(kpi.value)}</Typography>
                            <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                    {g >= 0 ? <TrendingUpIcon sx={{ fontSize: 16, color: COLORS.green }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#e53935' }} />}
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: g >= 0 ? COLORS.green : '#e53935' }}>{fmtPct(g)}</Typography>
                                </Stack>
                                <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>{year - 1}: {kpi.fmt(kpi.prev)}</Typography>
                            </Stack>
                        </Box>
                    )
                })}
            </Box>

            {/* Proyección anual (solo si hay datos) */}
            {showProjections && (
                <Box sx={{ ...cardSx, borderBottom: `3.5px solid ${COLORS.accent}`, p: 2.5 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2}>
                        <Box>
                            <Typography sx={{ fontSize: 13, color: COLORS.axisLabel }}>Proyección de cierre {year}</Typography>
                            <Typography sx={{ fontSize: 28, fontWeight: 800, color: COLORS.textPrimary, mt: 0.5 }}>{fmtSoles(projectedYearTotal)}</Typography>
                            <Typography sx={{ fontSize: 13, color: COLORS.axisLabel, mt: 0.5 }}>
                                Basado en el ritmo actual ({Math.round(paceRatio * 100)}% del ritmo de {year - 1})
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={3}>
                            <Box textAlign="center">
                                <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>Total {year - 1}</Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>{fmtSoles(prevYearFullTotal)}</Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>vs {year - 1}</Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 700, color: calc(projectedYearTotal, prevYearFullTotal) >= 0 ? COLORS.green : '#e53935' }}>
                                    {fmtPct(calc(projectedYearTotal, prevYearFullTotal))}
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>Ritmo</Typography>
                                <Typography sx={{ fontSize: 18, fontWeight: 700, color: paceRatio >= 1 ? COLORS.green : '#e53935' }}>
                                    {Math.round(paceRatio * 100)}%
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            )}

            {/* ========== VISTA ANUAL ========== */}
            {isAnnual && (
                <>
                    <Box sx={cardSx}>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary, mb: 0.5 }}>
                            {showProjections
                                ? `Ingresos ${year}: Real + Proyección vs ${year - 1}`
                                : `Ingresos mensuales — ${year} vs ${year - 1}`
                            }
                        </Typography>
                        {showProjections && (
                            <Typography sx={{ fontSize: 13, color: COLORS.axisLabel, mb: 1 }}>
                                Las barras claras son proyecciones basadas en {year - 1} ajustadas al ritmo actual
                            </Typography>
                        )}
                        <Chart options={annualBarFinalOptions} series={annualBarSeries} type="bar" height={350} />
                    </Box>

                    {cumReal.length > 1 && (
                        <Box sx={cardSx}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary }}>
                                    {showProjections ? `Acumulado ${year} (real + proyección) vs ${year - 1}` : `Ingresos acumulados — ${year} vs ${year - 1}`}
                                </Typography>
                                {!showProjections && (() => {
                                    const diff = cumReal[cumReal.length - 1] - cumPrev[cumPrev.length - 1]
                                    return (
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: diff >= 0 ? COLORS.green : '#e53935' }}>
                                            {diff >= 0 ? '+' : ''}{fmtSoles(diff)} vs {year - 1}
                                        </Typography>
                                    )
                                })()}
                            </Stack>
                            <Chart options={areaOptions} series={areaSeries} type="area" height={300} />
                        </Box>
                    )}

                    {/* Tabla */}
                    {tableRows.length > 0 && (
                        <Box sx={{ ...cardSx, p: 0, overflow: 'hidden' }}>
                            <Box px={3} pt={3} pb={1}>
                                <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary }}>
                                    Detalle mensual {showProjections && '(real + proyección)'}
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
                                            }}>{h}</Box>
                                        ))}
                                    </Box>
                                </Box>
                                <Box component="tbody">
                                    {tableRows.map(row => (
                                        <Box component="tr" key={row.mi} sx={{
                                            borderBottom: `1px solid ${COLORS.gridLine}`,
                                            '&:hover': { bgcolor: '#FAFAFA' },
                                            ...(row.isReal ? {} : { bgcolor: '#FFF8F5' }),
                                        }}>
                                            <Box component="td" sx={{ py: 1.5, px: 2, fontWeight: 600, color: COLORS.textPrimary }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <span>{MONTH_LABELS[row.mi]}</span>
                                                    {!row.isReal && (
                                                        <Box component="span" sx={{
                                                            fontSize: 10, fontWeight: 700,
                                                            bgcolor: COLORS.projected, color: COLORS.accent,
                                                            px: 0.8, py: 0.2, borderRadius: 0.5,
                                                        }}>PROY.</Box>
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Box component="td" sx={{
                                                py: 1.5, px: 2, textAlign: 'right',
                                                fontWeight: 700, color: COLORS.textPrimary,
                                                ...(row.isReal ? {} : { fontStyle: 'italic', color: COLORS.axisLabel }),
                                            }}>
                                                {fmtSoles(row.cur)}
                                            </Box>
                                            <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', color: COLORS.axisLabel }}>
                                                {fmtSoles(row.prev)}
                                            </Box>
                                            <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', fontWeight: 600, color: row.diff >= 0 ? COLORS.green : '#e53935' }}>
                                                {row.diff >= 0 ? '+' : ''}{fmtSoles(row.diff)}
                                            </Box>
                                            <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right' }}>
                                                <Box component="span" sx={{
                                                    display: 'inline-block', px: 1, py: 0.3, borderRadius: 1,
                                                    fontSize: 12, fontWeight: 600,
                                                    bgcolor: row.pct >= 0 ? '#E8F5E9' : '#FFEBEE',
                                                    color: row.pct >= 0 ? COLORS.green : '#e53935',
                                                }}>{fmtPct(row.pct)}</Box>
                                            </Box>
                                            <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', color: COLORS.textPrimary }}>
                                                {typeof row.curRes === 'number'
                                                    ? <><Box component="span" sx={{ fontWeight: 600 }}>{row.curRes}</Box><Box component="span" sx={{ color: COLORS.axisLabel }}> / {row.prevRes}</Box></>
                                                    : <Box component="span" sx={{ color: COLORS.axisLabel }}>— / {row.prevRes}</Box>
                                                }
                                            </Box>
                                        </Box>
                                    ))}
                                    {/* Total */}
                                    <Box component="tr" sx={{ bgcolor: '#F5F5F5', borderTop: `2px solid ${COLORS.gridLine}` }}>
                                        <Box component="td" sx={{ py: 2, px: 2, fontWeight: 800 }}>
                                            Total {showProjections && <Box component="span" sx={{ fontWeight: 400, fontSize: 12, color: COLORS.axisLabel }}>(real + proy.)</Box>}
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 800 }}>
                                            {showProjections ? fmtSoles(projectedYearTotal) : fmtSoles(totalRev)}
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 600, color: COLORS.axisLabel }}>
                                            {showProjections ? fmtSoles(prevYearFullTotal) : fmtSoles(prevTotalRev)}
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 800, color: (showProjections ? projectedYearTotal >= prevYearFullTotal : totalRev >= prevTotalRev) ? COLORS.green : '#e53935' }}>
                                            {(() => {
                                                const d = showProjections ? projectedYearTotal - prevYearFullTotal : totalRev - prevTotalRev
                                                return `${d >= 0 ? '+' : ''}${fmtSoles(d)}`
                                            })()}
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right' }}>
                                            <Box component="span" sx={{
                                                display: 'inline-block', px: 1, py: 0.3, borderRadius: 1,
                                                fontSize: 12, fontWeight: 700,
                                                bgcolor: calc(showProjections ? projectedYearTotal : totalRev, showProjections ? prevYearFullTotal : prevTotalRev) >= 0 ? '#E8F5E9' : '#FFEBEE',
                                                color: calc(showProjections ? projectedYearTotal : totalRev, showProjections ? prevYearFullTotal : prevTotalRev) >= 0 ? COLORS.green : '#e53935',
                                            }}>
                                                {fmtPct(calc(showProjections ? projectedYearTotal : totalRev, showProjections ? prevYearFullTotal : prevTotalRev))}
                                            </Box>
                                        </Box>
                                        <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', fontWeight: 800 }}>
                                            {totalRes} <Box component="span" sx={{ color: COLORS.axisLabel, fontWeight: 400 }}>/ {showProjections ? safeNumber(prevFullData?.data?.revenue_summary?.total_reservations) : prevTotalRes}</Box>
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
                    <Box sx={cardSx}>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary, mb: 0.5 }}>
                            {monthName} — {year} vs {year - 1}
                        </Typography>
                        <Chart options={simpleBarOptions} series={[
                            { name: `${year}`, data: curRevArr },
                            { name: `${year - 1}`, data: prevRevArr },
                        ]} type="bar" height={220} />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        {[
                            { label: 'Reservas', cur: mRes, prev: mResPrev, fmt: (v: number) => `${v}`, borderColor: COLORS.green },
                            { label: 'Noches', cur: mNights, prev: mNightsPrev, fmt: (v: number) => `${v}`, borderColor: COLORS.orange },
                            { label: 'Promedio / Reserva', cur: mAvgPerRes, prev: mAvgPerResPrev, fmt: fmtSoles, borderColor: COLORS.teal },
                        ].map((m, i) => {
                            const g = calc(m.cur, m.prev)
                            return (
                                <Box key={i} sx={{ ...cardSx, borderBottom: `3.5px solid ${m.borderColor}`, p: 2.5 }}>
                                    <Typography sx={{ fontSize: 13, color: COLORS.axisLabel }}>{m.label}</Typography>
                                    <Typography sx={{ fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, mt: 0.5 }}>{m.fmt(Math.round(m.cur))}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: g >= 0 ? COLORS.green : '#e53935' }}>{fmtPct(g)}</Typography>
                                        <Typography sx={{ fontSize: 12, color: COLORS.axisLabel }}>(ant: {m.fmt(Math.round(m.prev))})</Typography>
                                    </Stack>
                                </Box>
                            )
                        })}
                    </Box>

                    <Box sx={cardSx}>
                        <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 400, color: COLORS.textSecondary, mb: 0.5 }}>
                            {monthName} en contexto — Todos los meses de {year}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: COLORS.axisLabel, mb: 1 }}>
                            El mes seleccionado se muestra en naranja
                        </Typography>
                        <Chart options={contextOptions} series={[{ name: 'Ingresos', data: contextData }]} type="bar" height={250} />
                    </Box>
                </>
            )}
        </Box>
    )
}
