import { useState, useMemo } from 'react'
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Stack,
    IconButton,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    SelectChangeEvent,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    Tooltip,
    Fade,
} from '@mui/material'
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    NightsStay as NightsIcon,
    PersonAdd as PersonAddIcon,
    Star as StarIcon,
    CalendarToday as CalendarTodayIcon,
    CalendarMonth as CalendarMonthIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useGetClientProfileQuery } from '@/services/analytics/clientProfileService'
import { monthNames, yearOptions } from '@/core/utils/time-options'

export default function ClientProfileTab() {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [mode, setMode] = useState<'monthly' | 'annual'>('monthly')

    // Current period query
    const currentParams = useMemo(
        () => (mode === 'monthly' ? { mode, month, year } : { mode, year }),
        [mode, month, year],
    )
    const { data: response, isLoading, isFetching } = useGetClientProfileQuery(currentParams)
    const profileData = response?.data

    // Previous period query for comparison
    const prevParams = useMemo(() => {
        if (mode === 'monthly') {
            const prevMonth = month === 1 ? 12 : month - 1
            const prevYear = month === 1 ? year - 1 : year
            return { mode, month: prevMonth, year: prevYear }
        }
        return { mode, year: year - 1 }
    }, [mode, month, year])
    const { data: prevResponse } = useGetClientProfileQuery(prevParams)
    const prevData = prevResponse?.data

    const handlePrevMonth = () => {
        if (month === 1) {
            setMonth(12)
            setYear(year - 1)
        } else {
            setMonth(month - 1)
        }
    }

    const handleNextMonth = () => {
        if (month === 12) {
            setMonth(1)
            setYear(year + 1)
        } else {
            setMonth(month + 1)
        }
    }

    const handleYearChange = (e: SelectChangeEvent<number>) => {
        setYear(Number(e.target.value))
    }

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'monthly' | 'annual' | null) => {
        if (newMode) setMode(newMode)
    }

    const formatCurrency = (val: number) =>
        `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

    // Calculate percentage change between current and previous
    const calcChange = (current: number, previous: number | undefined): number | null => {
        if (previous === undefined || previous === 0) return null
        return Math.round(((current - previous) / previous) * 100)
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        )
    }

    if (!profileData || !response?.success) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography color="text.secondary">No hay datos disponibles para este período</Typography>
            </Box>
        )
    }

    const {
        summary,
        gender_distribution,
        age_distribution,
        document_type_distribution,
        origin_distribution,
        top_clients,
        ideal_profile,
        monthly_trend,
    } = profileData

    const prevSummary = prevData?.summary

    // --- KPI definitions with comparison ---
    const kpis = [
        {
            label: 'Clientes',
            value: summary.total_clients,
            formatted: String(summary.total_clients),
            icon: <PeopleIcon />,
            color: '#4361EE',
            change: calcChange(summary.total_clients, prevSummary?.total_clients),
        },
        {
            label: 'Gasto x̄',
            value: summary.avg_spend,
            formatted: formatCurrency(summary.avg_spend),
            icon: <MoneyIcon />,
            color: '#06D6A0',
            change: calcChange(summary.avg_spend, prevSummary?.avg_spend),
        },
        {
            label: 'Noches x̄',
            value: summary.avg_nights,
            formatted: String(summary.avg_nights),
            icon: <NightsIcon />,
            color: '#F72585',
            change: calcChange(summary.avg_nights, prevSummary?.avg_nights),
        },
        {
            label: 'Nuevos',
            value: summary.new_clients_percentage,
            formatted: `${summary.new_clients_percentage}%`,
            icon: <PersonAddIcon />,
            color: '#FF9F1C',
            change: calcChange(summary.new_clients_percentage, prevSummary?.new_clients_percentage),
        },
    ]

    // --- Chart configs ---
    const donutChartBase: ApexOptions = {
        chart: { type: 'donut' },
        legend: { position: 'bottom', fontSize: '12px' },
        dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(0)}%` },
        tooltip: {
            y: { formatter: (val: number) => `${val} clientes` },
        },
        responsive: [
            { breakpoint: 480, options: { chart: { width: 280 }, legend: { position: 'bottom' } } },
        ],
    }

    const genderOptions: ApexOptions = {
        ...donutChartBase,
        labels: gender_distribution.map((g) => `${g.label} (x̄ ${formatCurrency(g.avg_spend)})`),
        colors: ['#4361EE', '#F72585', '#7209B6'],
    }
    const genderSeries = gender_distribution.map((g) => g.count)

    const docOptions: ApexOptions = {
        ...donutChartBase,
        labels: document_type_distribution.map((d) => `${d.label} (x̄ ${formatCurrency(d.avg_spend)})`),
        colors: ['#06D6A0', '#118AB2', '#FFD166', '#EF476F'],
    }
    const docSeries = document_type_distribution.map((d) => d.count)

    const originOptions: ApexOptions = {
        ...donutChartBase,
        labels: origin_distribution.map((o) => `${o.label} (x̄ ${formatCurrency(o.avg_spend)})`),
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    }
    const originSeries = origin_distribution.map((o) => o.count)

    const ageBarOptions: ApexOptions = {
        chart: { type: 'bar' },
        plotOptions: { bar: { horizontal: true, barHeight: '60%' } },
        xaxis: { categories: age_distribution.map((a) => a.range) },
        colors: ['#4361EE'],
        dataLabels: {
            enabled: true,
            formatter: (_val: number, opts: { dataPointIndex: number }) => {
                const item = age_distribution[opts.dataPointIndex]
                return item ? `${item.count} (x̄ ${formatCurrency(item.avg_spend)})` : ''
            },
            style: { fontSize: '11px' },
        },
        tooltip: {
            y: {
                formatter: (_val: number, opts: { dataPointIndex: number }) => {
                    const item = age_distribution[opts.dataPointIndex]
                    return item
                        ? `${item.count} clientes — Gasto prom: ${formatCurrency(item.avg_spend)}`
                        : ''
                },
            },
        },
    }
    const ageBarSeries = [{ name: 'Clientes', data: age_distribution.map((a) => a.count) }]

    // --- Monthly trend chart (annual mode) ---
    const trendChartOptions: ApexOptions = monthly_trend
        ? {
              chart: {
                  type: 'area',
                  toolbar: { show: false },
                  zoom: { enabled: false },
              },
              stroke: { curve: 'smooth', width: [3, 2] },
              fill: {
                  type: ['gradient', 'solid'],
                  gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.4,
                      opacityTo: 0.05,
                      stops: [0, 90, 100],
                  },
                  opacity: [1, 1],
              },
              xaxis: {
                  categories: monthly_trend.map((t) => t.month_name.substring(0, 3)),
              },
              yaxis: [
                  {
                      title: { text: 'Ingresos (S/)' },
                      labels: {
                          formatter: (val: number) => formatCurrency(val),
                      },
                  },
                  {
                      opposite: true,
                      title: { text: '# Clientes' },
                      labels: {
                          formatter: (val: number) => String(Math.round(val)),
                      },
                  },
              ],
              colors: ['#4361EE', '#F72585'],
              tooltip: {
                  shared: true,
                  y: {
                      formatter: (val: number, opts: { seriesIndex: number }) =>
                          opts.seriesIndex === 0 ? formatCurrency(val) : `${val} clientes`,
                  },
              },
              legend: { position: 'top' },
              dataLabels: { enabled: false },
          }
        : {}
    const trendChartSeries = monthly_trend
        ? [
              { name: 'Ingresos', type: 'area', data: monthly_trend.map((t) => t.revenue) },
              { name: 'Clientes', type: 'line', data: monthly_trend.map((t) => t.total_clients) },
          ]
        : []

    const genderLabel = (sex: string | null) => {
        if (sex === 'm') return 'M'
        if (sex === 'f') return 'F'
        if (sex === 'e') return 'E'
        return '-'
    }

    const prevPeriodLabel =
        mode === 'monthly' ? 'vs mes anterior' : 'vs año anterior'

    return (
        <Box>
            {/* Navigation bar */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    size="small"
                >
                    <ToggleButton value="monthly">
                        <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        Mensual
                    </ToggleButton>
                    <ToggleButton value="annual">
                        <CalendarMonthIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        Anual
                    </ToggleButton>
                </ToggleButtonGroup>

                {mode === 'monthly' && (
                    <>
                        <IconButton onClick={handlePrevMonth} size="small">
                            <ChevronLeftIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ minWidth: 140, textAlign: 'center' }}
                        >
                            {monthNames[month - 1]}
                        </Typography>
                        <IconButton onClick={handleNextMonth} size="small">
                            <ChevronRightIcon />
                        </IconButton>
                    </>
                )}

                <Select
                    size="small"
                    value={year}
                    onChange={handleYearChange}
                    sx={{ ml: 1, minWidth: 90 }}
                >
                    {yearOptions.map((y) => (
                        <MenuItem key={y.value} value={Number(y.value)}>
                            {y.label}
                        </MenuItem>
                    ))}
                </Select>

                {isFetching && !isLoading && (
                    <Fade in>
                        <CircularProgress size={20} sx={{ ml: 1 }} />
                    </Fade>
                )}
            </Stack>

            {/* KPI Cards */}
            <Grid container spacing={2} mb={3}>
                {kpis.map((kpi) => (
                    <Grid item xs={6} md={3} key={kpi.label}>
                        <Card
                            elevation={0}
                            sx={{
                                borderLeft: `4px solid ${kpi.color}`,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderLeftColor: kpi.color,
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: 3 },
                            }}
                        >
                            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <Typography variant="h5" fontWeight={700}>
                                                {kpi.formatted}
                                            </Typography>
                                            {kpi.change !== null && (
                                                <Tooltip title={prevPeriodLabel} arrow>
                                                    <Chip
                                                        size="small"
                                                        icon={
                                                            kpi.change >= 0 ? (
                                                                <TrendingUpIcon
                                                                    sx={{ fontSize: 14 }}
                                                                />
                                                            ) : (
                                                                <TrendingDownIcon
                                                                    sx={{ fontSize: 14 }}
                                                                />
                                                            )
                                                        }
                                                        label={`${kpi.change > 0 ? '+' : ''}${kpi.change}%`}
                                                        color={kpi.change >= 0 ? 'success' : 'error'}
                                                        variant="outlined"
                                                        sx={{
                                                            height: 22,
                                                            '& .MuiChip-label': {
                                                                px: 0.5,
                                                                fontSize: '0.7rem',
                                                            },
                                                            '& .MuiChip-icon': { ml: 0.3 },
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {kpi.label}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Monthly Trend Chart (annual mode only) */}
            {mode === 'annual' && monthly_trend && monthly_trend.length > 0 && (
                <Paper
                    elevation={0}
                    sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}
                >
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Tendencia Mensual {year}
                    </Typography>
                    <Chart
                        options={trendChartOptions}
                        series={trendChartSeries}
                        type="area"
                        height={320}
                    />
                </Paper>
            )}

            {/* Card Perfil Ideal */}
            {ideal_profile && ideal_profile.description !== 'Sin datos suficientes' && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        background: 'linear-gradient(135deg, #4361EE15, #F7258515)',
                        border: '1px solid',
                        borderColor: 'primary.light',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                        <StarIcon sx={{ color: '#FFD700' }} />
                        <Typography variant="subtitle1" fontWeight={700}>
                            Perfil Ideal del Cliente
                        </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        {ideal_profile.description}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        {ideal_profile.top_gender && (
                            <Typography variant="caption" color="text.secondary">
                                Género: x̄ {formatCurrency(ideal_profile.top_gender.avg_spend)}
                            </Typography>
                        )}
                        {ideal_profile.top_age_range && (
                            <Typography variant="caption" color="text.secondary">
                                Edad: x̄ {formatCurrency(ideal_profile.top_age_range.avg_spend)}
                            </Typography>
                        )}
                        {ideal_profile.top_origin && (
                            <Typography variant="caption" color="text.secondary">
                                Origen: x̄ {formatCurrency(ideal_profile.top_origin.avg_spend)}
                            </Typography>
                        )}
                        {ideal_profile.top_guest_count && (
                            <Typography variant="caption" color="text.secondary">
                                Huéspedes: x̄{' '}
                                {formatCurrency(ideal_profile.top_guest_count.avg_spend)}
                            </Typography>
                        )}
                    </Stack>
                </Paper>
            )}

            {/* Distribution Charts */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{ p: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Distribución por Género
                        </Typography>
                        {genderSeries.length > 0 ? (
                            <Chart
                                options={genderOptions}
                                series={genderSeries}
                                type="donut"
                                height={280}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Sin datos
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{ p: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Distribución por Edad
                        </Typography>
                        {ageBarSeries[0].data.length > 0 ? (
                            <Chart
                                options={ageBarOptions}
                                series={ageBarSeries}
                                type="bar"
                                height={280}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Sin datos
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{ p: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Distribución por Tipo de Documento
                        </Typography>
                        {docSeries.length > 0 ? (
                            <Chart
                                options={docOptions}
                                series={docSeries}
                                type="donut"
                                height={280}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Sin datos
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{ p: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Distribución por Origen de Reserva
                        </Typography>
                        {originSeries.length > 0 ? (
                            <Chart
                                options={originOptions}
                                series={originSeries}
                                type="donut"
                                height={280}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Sin datos
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Top Clients Table */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Top 10 Clientes por Gasto
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Edad</TableCell>
                                <TableCell>Sexo</TableCell>
                                <TableCell align="right">Gasto Total</TableCell>
                                <TableCell align="right">Reservas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {top_clients.map((c) => (
                                <TableRow
                                    key={c.client_id}
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{c.rank}</TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>{c.age ?? '-'}</TableCell>
                                    <TableCell>{genderLabel(c.sex)}</TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(c.total_spent)}
                                    </TableCell>
                                    <TableCell align="right">{c.reservation_count}</TableCell>
                                </TableRow>
                            ))}
                            {top_clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Sin datos
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}
