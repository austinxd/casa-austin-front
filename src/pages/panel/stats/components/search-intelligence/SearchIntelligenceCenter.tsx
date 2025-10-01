import { useState } from 'react'
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Stack,
    Chip,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material'
import {
    Search as SearchIcon,
    Psychology as IntelligenceIcon,
    Group as GroupIcon,
    Public as PublicIcon,
    TrendingUp as TrendingIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams } from '@/interfaces/stats.interface'

export default function SearchIntelligenceCenter() {
    const [filters, setFilters] = useState<StatsQueryParams>({
        period: 'week',
        date_from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        date_to: dayjs().format('YYYY-MM-DD'),
        include_anonymous: true
    })

    const { data: statsData, isLoading, error, refetch } = useGetStatsQuery(filters)

    // Configuración del gráfico de patrones de búsqueda por día de semana
    const weekdayPatternsOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300
        },
        xaxis: {
            categories: statsData?.stats?.search_patterns?.by_day_of_week?.map((item: any) => 
                item.day_name
            ) || []
        },
        title: {
            text: 'Patrones de Búsqueda por Día de la Semana',
            align: 'center'
        },
        colors: ['#0E6191'],
        dataLabels: { enabled: true },
        plotOptions: {
            bar: {
                columnWidth: '60%',
                borderRadius: 4
            }
        }
    }

    const weekdayPatternsSeries = [{
        name: 'Búsquedas',
        data: statsData?.stats?.search_patterns?.by_day_of_week?.map((item: any) => item.searches_count) || []
    }]

    // Configuración del gráfico de distribución de huéspedes
    const guestDistributionOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 350
        },
        labels: statsData?.stats?.guest_distribution?.map((item: any) => 
            `${item.guest_count} ${item.guest_count === 1 ? 'huésped' : 'huéspedes'}`
        ) || [],
        title: {
            text: 'Distribución por Número de Huéspedes',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745', '#ffc107', '#dc3545', '#6f42c1'],
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + '%'
            }
        },
        legend: { position: 'bottom' }
    }

    const guestDistributionSeries = statsData?.stats?.guest_distribution?.map((item: any) => 
        item.percentage
    ) || []

    const handleFilterChange = (field: keyof StatsQueryParams, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

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
                Error al cargar el centro de inteligencia. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom>
                            🧠 Search Intelligence Center
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Análisis de comportamiento de búsquedas y patrones de usuarios
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={() => refetch()}
                        startIcon={<RefreshIcon />}
                    >
                        Refrescar
                    </Button>
                </Stack>
            </Box>

            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    🔍 Filtros de Análisis
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
                </Grid>
            </Paper>

            {/* Métricas de inteligencia */}
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
                                <TrendingIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficos de análisis */}
            <Grid container spacing={3} mb={4}>
                {/* Patrones por día de semana */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        {statsData?.stats?.search_patterns?.by_day_of_week?.length ? (
                            <Chart
                                options={weekdayPatternsOptions}
                                series={weekdayPatternsSeries}
                                type="bar"
                                height={300}
                            />
                        ) : (
                            <Alert severity="info">
                                No hay datos de patrones por día de semana disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Distribución de huéspedes */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        {statsData?.stats?.guest_distribution?.length ? (
                            <Chart
                                options={guestDistributionOptions}
                                series={guestDistributionSeries}
                                type="donut"
                                height={300}
                            />
                        ) : (
                            <Alert severity="info">
                                No hay datos de distribución de huéspedes disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Propiedades más buscadas */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IntelligenceIcon color="primary" />
                            Propiedades Más Buscadas
                        </Typography>
                        
                        {statsData?.stats?.search_analytics?.most_searched_properties?.length ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Propiedad</TableCell>
                                            <TableCell align="center">Búsquedas</TableCell>
                                            <TableCell align="center">Popularidad</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {statsData.stats.search_analytics.most_searched_properties.slice(0, 8).map((property: any, index: number) => (
                                            <TableRow key={property.property__name}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {property.property__name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={property.searches_count}
                                                        size="small"
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={index === 0 ? "🥇 TOP" : index === 1 ? "🥈 2º" : index === 2 ? "🥉 3º" : `${index + 1}º`}
                                                        size="small"
                                                        variant="outlined"
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
                </Grid>

                {/* Top clientes buscadores */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GroupIcon color="info" />
                            Top Clientes Buscadores
                        </Typography>
                        
                        {statsData?.stats?.search_analytics?.top_searching_clients?.length ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell align="center">Búsquedas</TableCell>
                                            <TableCell align="center">Nivel</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {statsData.stats.search_analytics.top_searching_clients.slice(0, 8).map((client: any) => (
                                            <TableRow key={`${client.client__first_name}-${client.client__last_name}`}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {client.client__first_name} {client.client__last_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={client.searches_count}
                                                        size="small"
                                                        color={client.searches_count >= 10 ? "error" : 
                                                               client.searches_count >= 5 ? "warning" : "primary"}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={client.searches_count >= 10 ? "VIP" : 
                                                               client.searches_count >= 5 ? "ACTIVO" : "NORMAL"}
                                                        size="small"
                                                        color={client.searches_count >= 10 ? "error" : 
                                                               client.searches_count >= 5 ? "warning" : "default"}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Alert severity="info">
                                No hay datos de top clientes disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Información del análisis */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    🧠 Análisis de inteligencia de búsquedas | Período: {dayjs(filters.date_from).format('DD/MM/YYYY')} - {dayjs(filters.date_to).format('DD/MM/YYYY')} 
                    | Incluye anónimos: {filters.include_anonymous ? 'Sí' : 'No'} | Actualizado: {dayjs().format('DD/MM/YYYY HH:mm')}
                </Typography>
            </Paper>
        </Box>
    )
}