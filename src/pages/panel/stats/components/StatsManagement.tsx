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
    Chip,
    Stack,
} from '@mui/material'
import {
    BarChart as BarChartIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Search as SearchIcon,
    Home as HomeIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function StatsManagement() {
    const [filters, setFilters] = useState<StatsQueryParams>({
        period: 'month',
        days_back: 30,
        include_anonymous: true
    })
    
    const [dateRange, setDateRange] = useState({
        date_from: '',
        date_to: ''
    })
    
    const [useCustomDates, setUseCustomDates] = useState(false)

    // Construir parámetros de consulta
    const queryParams: StatsQueryParams = useCustomDates 
        ? { ...filters, ...dateRange, days_back: undefined }
        : filters

    const { data: statsData, isLoading, error, refetch } = useGetStatsQuery(queryParams)

    const handleFilterChange = (field: keyof StatsQueryParams, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    const handleDateRangeChange = (field: string, value: string) => {
        setDateRange(prev => ({ ...prev, [field]: value }))
    }

    const applyFilters = () => {
        refetch()
    }

    // Configuraciones de gráficos
    const searchesChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: statsData?.stats.search_analytics.searches_by_period.map(item => 
                dayjs(item.period).format('DD/MM')
            ) || [],
            title: { text: 'Período' }
        },
        yaxis: {
            title: { text: 'Número de Búsquedas' }
        },
        title: {
            text: 'Búsquedas por Período',
            align: 'center'
        },
        colors: ['#0E6191', '#ff6b6b', '#4ecdc4'],
        stroke: { width: 3 },
        dataLabels: { enabled: true }
    }

    const searchesSeries = [
        {
            name: 'Total Búsquedas',
            data: statsData?.stats.search_analytics.searches_by_period.map(item => item.total_searches) || []
        },
        {
            name: 'Búsquedas Clientes',
            data: statsData?.stats.search_analytics.searches_by_period.map(item => item.client_searches) || []
        },
        {
            name: 'Búsquedas Anónimas',
            data: statsData?.stats.search_analytics.searches_by_period.map(item => item.anonymous_searches) || []
        }
    ]

    // Gráfico de propiedades más buscadas
    const propertiesChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: statsData?.stats.search_analytics.most_searched_properties.map(item => 
            item.property__name
        ) || [],
        title: {
            text: 'Propiedades Más Buscadas',
            align: 'center'
        },
        colors: ['#0E6191', '#ff6b6b', '#4ecdc4', '#45b7d1'],
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + '%'
            }
        },
        legend: {
            position: 'bottom'
        }
    }

    const propertiesSeries = statsData?.stats.search_analytics.most_searched_properties.map(item => 
        item.search_count
    ) || []

    // Gráfico de nuevos clientes
    const newClientsChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300
        },
        xaxis: {
            categories: statsData?.stats.client_analytics.new_clients_by_period.map(item => 
                dayjs(item.period).format('DD/MM')
            ) || []
        },
        title: {
            text: 'Nuevos Clientes por Período',
            align: 'center'
        },
        colors: ['#28a745'],
        dataLabels: { enabled: true }
    }

    const newClientsSeries = [{
        name: 'Nuevos Clientes',
        data: statsData?.stats.client_analytics.new_clients_by_period.map(item => item.new_clients) || []
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
                Error al cargar las estadísticas. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon />
                    Filtros de Estadísticas
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
                    
                    {!useCustomDates && (
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Días Atrás"
                                type="number"
                                value={filters.days_back}
                                onChange={(e) => {
                                    const value = e.target.value
                                    const numValue = parseInt(value)
                                    handleFilterChange('days_back', value === '' || isNaN(numValue) ? undefined : numValue)
                                }}
                            />
                        </Grid>
                    )}
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Incluir Anónimos</InputLabel>
                            <Select
                                value={filters.include_anonymous?.toString()}
                                label="Incluir Anónimos"
                                onChange={(e) => handleFilterChange('include_anonymous', e.target.value === 'true')}
                            >
                                <MenuItem value="true">Sí</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <Button
                            variant={useCustomDates ? "contained" : "outlined"}
                            onClick={() => setUseCustomDates(!useCustomDates)}
                            size="small"
                            startIcon={<CalendarIcon />}
                        >
                            Fechas Específicas
                        </Button>
                    </Grid>
                    
                    {useCustomDates && (
                        <>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Fecha Desde"
                                    type="date"
                                    value={dateRange.date_from}
                                    onChange={(e) => handleDateRangeChange('date_from', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Fecha Hasta"
                                    type="date"
                                    value={dateRange.date_to}
                                    onChange={(e) => handleDateRangeChange('date_to', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <Button
                            variant="contained"
                            onClick={applyFilters}
                            startIcon={<SearchIcon />}
                            fullWidth
                        >
                            Aplicar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Resumen de Estadísticas */}
            {statsData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="primary">
                                            {statsData.stats.summary.total_searches.toLocaleString()}
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
                                            {statsData.stats.summary.new_clients.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Nuevos Clientes
                                        </Typography>
                                    </Box>
                                    <PeopleIcon color="success" sx={{ fontSize: 40 }} />
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
                                            {statsData.stats.summary.unique_searchers.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Usuarios Únicos
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
                                        <Typography variant="h6" color="info.main" noWrap>
                                            {statsData.stats.summary.most_searched_property}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Propiedad Top
                                        </Typography>
                                    </Box>
                                    <HomeIcon color="info" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Gráficos */}
            <Grid container spacing={3}>
                {/* Gráfico de búsquedas por período */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={searchesChartOptions}
                            series={searchesSeries}
                            type="line"
                            height={350}
                        />
                    </Paper>
                </Grid>
                
                {/* Gráfico de propiedades más buscadas */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={propertiesChartOptions}
                            series={propertiesSeries}
                            type="donut"
                            height={350}
                        />
                    </Paper>
                </Grid>
                
                {/* Gráfico de nuevos clientes */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Chart
                            options={newClientsChartOptions}
                            series={newClientsSeries}
                            type="bar"
                            height={300}
                        />
                    </Paper>
                </Grid>

                {/* Top clientes por puntos */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2}>
                            Top Clientes por Puntos
                        </Typography>
                        <Stack spacing={1} maxHeight={300} sx={{ overflowY: 'auto' }}>
                            {statsData?.stats.client_analytics.top_clients_by_points.slice(0, 10).map((client, index) => (
                                <Box 
                                    key={index}
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent'
                                    }}
                                >
                                    <Typography variant="body2">
                                        {client.first_name} {client.last_name}
                                    </Typography>
                                    <Chip 
                                        label={`${client.points_balance} pts`}
                                        color="primary"
                                        size="small"
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Información del período */}
            {statsData && (
                <Paper sx={{ p: 2, mt: 3 }}>
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