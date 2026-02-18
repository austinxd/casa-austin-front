import { useEffect, useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper, Button, Chip, CircularProgress, Alert } from '@mui/material'
import { AutoAwesome as AiIcon, AttachMoney as MoneyIcon, Assessment as StatsIcon } from '@mui/icons-material'
import SearchProfits from './components/filter/SearchProfits'
import CardResponsiveProfit from './components/card/CardResponsiveProfit'
import { useLocation } from 'react-router-dom'
import {
    useGetAllRentalsForEarningsQuery,
    useGetEarningsPerMonthQuery,
} from '@/services/rentals/rentalService'
import { BarChartsProfits, PaginationAustin, SelectInputs, TableAustin } from '@/components/common'
import { yearOptions } from '@/core/utils/time-options'
import ColumTableProfits from './components/table/ColumTableProfits'
import formatRowsProfits from '@/services/profits/formatRowsProfits'
import ProfitsSkeleton from './components/skeleton/ProfitsSkeleton'
import { useLazyGetIngresosAnalysisQuery } from '@/services/analytics/ingresosService'
import IngresosDashboard from '@/pages/panel/stats/components/analytics/IngresosDashboard'
import { GlobalFilters } from '@/interfaces/analytics.interface'

type MonthNameToNumber = {
    [monthName: string]: number
}

// Markdown básico → HTML
const renderMarkdown = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/\n/g, '<br />')
}

export default function CrudProfits() {
    const params = useLocation()
    const currentYear = new Date().getFullYear()
    const currentMonthNumber = new Date().getMonth() + 1
    const [activeTab, setActiveTab] = useState(0)
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [month, setMonth] = useState<number>(currentMonthNumber)
    const [monthSelect, setMonthSelect] = useState('')
    const [meses, setMeses] = useState<string[]>(['1'])
    const [ganancias, setGanancias] = useState<string[]>(['2'])
    const [year, setYear] = useState<number>(currentYear)
    const [typeRent, setTypeRent] = useState('')

    const [earningsMonth, setEarningsMonth] = useState('')

    const { data, isLoading, refetch } = useGetAllRentalsForEarningsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        month: month,
        year: year,
        type: typeRent,
        exclude: 'man',
        from_check_in: true,
    })
    const {
        data: dataForChart,
        isLoading: isLoadingChart,
        refetch: refetchChart,
    } = useGetEarningsPerMonthQuery({
        year: year,
    })

    // Lazy query para análisis IA
    const [triggerAnalysis, { data: analysisData, isLoading: isAnalysisLoading, error: analysisError }] = useLazyGetIngresosAnalysisQuery()

    useEffect(() => {
        const currentDate = new Date()
        const currentMonth = currentDate.toLocaleString('es', { month: 'long' })
        const getEarningsForSelectedMonth = (selectedMonth: string) => {
            if (dataForChart) {
                if (selectedMonth === '') {
                    setEarningsMonth(dataForChart[currentMonth.toLocaleLowerCase()])
                } else {
                    setEarningsMonth(dataForChart[selectedMonth.toLocaleLowerCase()])
                }
            }
        }
        getEarningsForSelectedMonth(monthSelect)
    }, [monthSelect, dataForChart])

    useEffect(() => {
        refetch()
        refetchChart()
    }, [params.pathname])

    useEffect(() => {
        const separateChartData = (data: any) => {
            const months = Object.keys(data).map(
                (monthName) => monthName.charAt(0).toUpperCase() + monthName.slice(1)
            )
            const values = Object.values(data).map(String)

            return { months, values }
        }
        if (dataForChart) {
            const { months, values } = separateChartData(dataForChart)
            setGanancias(values)
            setMeses(months)
        }
    }, [dataForChart])

    const monthNameToNumber: MonthNameToNumber = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Setiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12,
    }
    useEffect(() => {
        if (monthSelect !== '') {
            const selectedMonthNumber = monthNameToNumber[monthSelect]
            setMonth(selectedMonthNumber)
        }
    }, [monthSelect])
    const handleYearChange = (newYear: any) => {
        setYear(newYear.target.value)
    }
    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleString('es', { month: 'long' })

    return (
        <>
            {isLoading || isLoadingChart ? (
                <ProfitsSkeleton />
            ) : (
                <div>
                    <Box
                        mb={{ md: 3, sm: 1, xs: 1 }}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Typography variant="h1">Ingresos</Typography>
                        <Box maxWidth={100}>
                            <SelectInputs
                                messageError=""
                                variant="outlined"
                                options={yearOptions}
                                label={'Año'}
                                onChange={handleYearChange}
                                defaultValue={currentYear.toString()}
                            />
                        </Box>
                    </Box>

                    {/* Sub-tabs: Ingresos / Stats / Análisis IA */}
                    <Paper sx={{ mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            sx={{ px: 2 }}
                        >
                            <Tab label="Ingresos" icon={<MoneyIcon />} iconPosition="start" />
                            <Tab label="Stats" icon={<StatsIcon />} iconPosition="start" />
                            <Tab label="Análisis IA" icon={<AiIcon />} iconPosition="start" />
                        </Tabs>
                    </Paper>

                    {/* ===== TAB 0: Ingresos (contenido original) ===== */}
                    {activeTab === 0 && (
                        <>
                            <BarChartsProfits
                                categories={meses}
                                setMonthSelect={setMonthSelect}
                                data={ganancias}
                                isLoading={isLoadingChart}
                                month={
                                    monthSelect
                                        ? monthSelect.charAt(0).toUpperCase() + monthSelect.slice(1)
                                        : currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)
                                }
                                earningsMonth={earningsMonth}
                                title={`El mes de ${monthSelect ? monthSelect.charAt(0).toUpperCase() + monthSelect.slice(1) : currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ganaste S/. ${earningsMonth}`}
                            />

                            <SearchProfits
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                setTypeRent={setTypeRent}
                                typeRent={typeRent}
                                setCurrentPage={setCurrentPage}
                                setSearch={setSearch}
                            />
                            <Box
                                sx={{
                                    pb: 1.5,
                                    background: 'white',
                                    borderEndEndRadius: '8px',
                                    borderEndStartRadius: '8px',
                                    borderBottom: '1px solid #E6E5E7',
                                    borderLeft: '1px solid #E6E5E7',
                                    borderRight: '1px solid #E6E5E7',
                                    '@media (max-width: 1000px)': {
                                        borderBottom: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                    },
                                }}
                            >
                                <TableAustin
                                    columns={ColumTableProfits}
                                    rows={data?.results ? formatRowsProfits({ data }) : []}
                                    isLoading={isLoading}
                                />
                                <Box
                                    sx={{
                                        display: 'none',
                                        mt: 1,
                                        '@media (max-width: 1000px)': {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                        },
                                    }}
                                >
                                    {formatRowsProfits({ data })?.map((item) => (
                                        <CardResponsiveProfit
                                            key={item.id}
                                            check_in_date={item.check_in_date}
                                            document_type={item.type_document}
                                            number_doc={item.number_doc}
                                            price_sol={item.price_sol}
                                            tel_number={item.tel_number}
                                            first_name={item.first_name}
                                            origin={item.origin}
                                            type_home={item.type_home}
                                        />
                                    ))}
                                </Box>
                                {data && (
                                    <Box px={1}>
                                        <PaginationAustin
                                            pageSize={pageSize}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            totalPages={data?.total_paginas}
                                            dataCount={data.count}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}

                    {/* ===== TAB 1: Stats ===== */}
                    {activeTab === 1 && (
                        <IngresosDashboard
                            filters={{
                                dateRange: {
                                    date_from: `${year}-01-01`,
                                    date_to: `${year}-12-31`,
                                },
                                preset: 'year',
                                includeClients: true,
                                includeAnonymous: false,
                                period: 'month',
                                currency: 'PEN',
                                limit: 20,
                                daysAhead: 30,
                            } as GlobalFilters}
                        />
                    )}

                    {/* ===== TAB 2: Análisis IA ===== */}
                    {activeTab === 2 && (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {/* Header */}
                            <Paper sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="h6">Análisis de Ingresos con IA</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Tendencias, proyecciones, estacionalidad y recomendaciones basadas en los últimos 24 meses
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={isAnalysisLoading ? <CircularProgress size={18} color="inherit" /> : <AiIcon />}
                                        onClick={() => triggerAnalysis()}
                                        disabled={isAnalysisLoading}
                                    >
                                        {isAnalysisLoading ? 'Generando...' : analysisData ? 'Regenerar análisis' : 'Generar análisis'}
                                    </Button>
                                </Box>
                                {analysisData && !isAnalysisLoading && (
                                    <Box display="flex" gap={1.5} mt={1.5}>
                                        <Chip
                                            label={`${analysisData.months_analyzed} meses analizados`}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                        {analysisData.tokens_used && (
                                            <Chip
                                                label={`${analysisData.tokens_used.toLocaleString()} tokens`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        )}
                                        {analysisData.model && (
                                            <Chip
                                                label={analysisData.model}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        )}
                                    </Box>
                                )}
                            </Paper>

                            {/* Cargando */}
                            {isAnalysisLoading && (
                                <Paper sx={{ p: 3 }}>
                                    <Box display="flex" flexDirection="column" alignItems="center" py={6}>
                                        <CircularProgress size={48} />
                                        <Typography variant="body1" color="text.secondary" mt={2}>
                                            Analizando datos de ingresos...
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" mt={0.5}>
                                            Esto puede tomar unos segundos
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}

                            {/* Error */}
                            {analysisError && (
                                <Alert severity="error">
                                    Error al generar el análisis. Por favor intenta nuevamente.
                                </Alert>
                            )}

                            {/* Estado vacío */}
                            {!analysisData && !isAnalysisLoading && !analysisError && (
                                <Paper sx={{ p: 3 }}>
                                    <Box display="flex" flexDirection="column" alignItems="center" py={6}>
                                        <AiIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            Presiona "Generar análisis" para obtener un análisis completo con IA
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" mt={0.5}>
                                            Se analizarán los últimos 24 meses de datos de ingresos
                                        </Typography>
                                    </Box>
                                </Paper>
                            )}

                            {/* Resultado */}
                            {analysisData?.analysis && !isAnalysisLoading && (
                                <Paper sx={{ p: 3 }}>
                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 3, backgroundColor: 'grey.50' }}
                                    >
                                        <Typography
                                            variant="body2"
                                            component="div"
                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                                            dangerouslySetInnerHTML={{ __html: renderMarkdown(analysisData.analysis) }}
                                        />
                                    </Paper>
                                </Paper>
                            )}
                        </Box>
                    )}
                </div>
            )}
        </>
    )
}
