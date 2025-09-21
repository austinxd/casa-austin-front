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
    Button,
    Card,
    CardContent,
    Stack,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from '@mui/material'
import {
    Search as SearchIcon,
    TrendingUp as TrendingUpIcon,
    Group as GroupIcon,
    Public as PublicIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function SearchAnalytics() {
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

    // Configuración del gráfico de búsquedas por período
    const searchesChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: statsData?.stats?.search_analytics?.searches_by_period?.map(item => 
                dayjs(item.period).format('DD/MM')
            ) || [],
            title: { text: 'Período' }
        },
        yaxis: {
            title: { text: 'Número de Búsquedas' }
        },
        title: {
            text: 'Evolución de Búsquedas por Período',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745'],
        stroke: { width: 3 },
        dataLabels: { enabled: true },
        legend: { position: 'top' }
    }

    const searchesChartSeries = [
        {
            name: 'Búsquedas Totales',
            data: statsData?.stats?.search_analytics?.searches_by_period?.map(item => item.total_searches) || []
        },
        {
            name: 'Búsquedas de Clientes',
            data: statsData?.stats?.search_analytics?.searches_by_period?.map(item => item.client_searches) || []
        }
    ]

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
                Error al cargar el análisis de búsquedas. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    🔍 Configuración de Análisis
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
                        <FormControl fullWidth size="small">
                            <InputLabel>Incluir Anónimos</InputLabel>
                            <Select
                                value={filters.include_anonymous ? 'true' : 'false'}
                                label="Incluir Anónimos"
                                onChange={(e) => handleFilterChange('include_anonymous', e.target.value === 'true')}
                            >
                                <MenuItem value="true">Sí, incluir</MenuItem>
                                <MenuItem value="false">Solo registrados</MenuItem>
                            </Select>
                        </FormControl>
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

            {/* Métricas de búsquedas */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {statsData?.stats?.summary?.total_searches?.toLocaleString() || 0}
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
                                    <Typography variant="h4" color="info.main">
                                        {statsData?.stats?.summary?.unique_searchers?.toLocaleString() || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Usuarios Únicos
                                    </Typography>
                                </Box>
                                <GroupIcon color="info" sx={{ fontSize: 40 }} />
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
                                        {statsData?.stats?.search_analytics?.unique_anonymous_ips || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        IPs Anónimas
                                    </Typography>
                                </Box>
                                <PublicIcon color="warning" sx={{ fontSize: 40 }} />
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
                                        {((statsData?.stats?.summary?.unique_searchers || 0) / (statsData?.stats?.summary?.total_searches || 1) * 100).toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ratio Conversión
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráfico de evolución de búsquedas */}
            <Paper sx={{ p: 3, mb: 4 }}>
                {statsData?.stats?.search_analytics?.searches_by_period?.length ? (
                    <Chart
                        options={searchesChartOptions}
                        series={searchesChartSeries}
                        type="line"
                        height={400}
                    />
                ) : (
                    <Alert severity="info">
                        No hay datos suficientes para mostrar el gráfico de evolución de búsquedas.
                    </Alert>
                )}
            </Paper>

            {/* Tabla de propiedades más buscadas */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                    🏠 Propiedades Más Buscadas
                </Typography>
                
                {statsData?.stats?.search_analytics?.most_searched_properties?.length ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ranking</TableCell>
                                    <TableCell>Propiedad</TableCell>
                                    <TableCell align="center">Búsquedas</TableCell>
                                    <TableCell align="center">Popularidad</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {statsData.stats.search_analytics.most_searched_properties.map((property, index) => (
                                    <TableRow key={property.property__name}>
                                        <TableCell>
                                            <Chip 
                                                label={`#${index + 1}`}
                                                size="small"
                                                color={index === 0 ? "error" : index <= 2 ? "warning" : "default"}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="medium">
                                                {property.property__name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="h6" color="primary">
                                                {property.search_count}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip 
                                                label={index === 0 ? "🥇 MÁS POPULAR" : 
                                                       index === 1 ? "🥈 SEGUNDA" : 
                                                       index === 2 ? "🥉 TERCERA" : "POPULAR"}
                                                size="small"
                                                color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">
                        No hay datos de propiedades más buscadas disponibles.
                    </Alert>
                )}
            </Paper>
        </Box>
    )
}