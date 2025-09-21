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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import {
    Search as SearchIcon,
    TrendingUp as TrendingUpIcon,
    Group as GroupIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

// Services y tipos
import { useGetSearchTrackingQuery } from '@/services/analytics/searchTrackingService'
import { GlobalFilters } from '@/interfaces/analytics.interface'

interface SearchDashboardProps {
    filters: GlobalFilters
}

export default function SearchDashboard({ filters }: SearchDashboardProps) {
    const { data: searchData, isLoading, error } = useGetSearchTrackingQuery({
        date_from: filters.dateRange.date_from,
        date_to: filters.dateRange.date_to,
        include_clients: filters.includeClients,
        include_anonymous: filters.includeAnonymous
    })

    // Configuración del gráfico de búsquedas por día de semana
    const weekdayChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: true }
        },
        xaxis: {
            categories: searchData?.data?.searches_by_weekday?.map(item => item.weekday) || [],
            title: { text: 'Día de la Semana' }
        },
        yaxis: {
            title: { text: 'Número de Búsquedas' }
        },
        title: {
            text: 'Búsquedas por Día de la Semana',
            align: 'center'
        },
        colors: ['#0E6191'],
        dataLabels: { enabled: true },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '60%'
            }
        }
    }

    const weekdayChartSeries = [{
        name: 'Búsquedas',
        data: searchData?.data?.searches_by_weekday?.map(item => item.searches_count) || []
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
                Error al cargar el análisis de búsquedas. Por favor intenta nuevamente.
            </Alert>
        )
    }

    if (!searchData?.success) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                No se pudieron cargar los datos de búsquedas.
            </Alert>
        )
    }

    const summary = searchData.data.search_summary

    return (
        <Box>
            {/* Métricas principales */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {summary.total_searches.toLocaleString()}
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
                                        {summary.unique_clients_searching.toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Clientes Únicos
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
                                        {summary.conversion_rate.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tasa de Conversión
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
                                    <Typography variant="h4" color="success.main">
                                        {summary.avg_searches_per_day.toFixed(1)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Búsquedas/Día
                                    </Typography>
                                </Box>
                                <VisibilityIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráfico de búsquedas por día de semana */}
            <Paper sx={{ p: 3, mb: 4 }}>
                {searchData.data.searches_by_weekday?.length ? (
                    <Chart
                        options={weekdayChartOptions}
                        series={weekdayChartSeries}
                        type="bar"
                        height={350}
                    />
                ) : (
                    <Alert severity="info">
                        No hay datos de búsquedas por día de semana disponibles.
                    </Alert>
                )}
            </Paper>

            {/* Propiedades más buscadas y Top clientes */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            🏠 Propiedades Más Buscadas
                        </Typography>
                        
                        {searchData.data.top_searched_properties?.length ? (
                            <List>
                                {searchData.data.top_searched_properties.slice(0, 5).map((property, index) => (
                                    <ListItem key={property.property_name} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        #{index + 1} {property.property_name}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${property.search_count} búsquedas`}
                                                        size="small"
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                </Stack>
                                            }
                                            secondary={`${property.percentage.toFixed(1)}% del total`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">
                                No hay datos de propiedades más buscadas disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            👥 Top Clientes Buscadores
                        </Typography>
                        
                        {searchData.data.top_searching_clients?.length ? (
                            <List>
                                {searchData.data.top_searching_clients.slice(0, 5).map((client, index) => (
                                    <ListItem key={client.client_email} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        #{index + 1} {client.client_name}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${client.search_count} búsquedas`}
                                                        size="small"
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                </Stack>
                                            }
                                            secondary={`Última búsqueda: ${client.last_search_date}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">
                                No hay datos de clientes más activos disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabla de análisis de IPs anónimas */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                    🔍 Análisis de IPs Anónimas
                </Typography>
                
                {searchData.data.anonymous_ips_analysis?.length ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>IP (últimas 4 cifras)</TableCell>
                                    <TableCell align="center">Búsquedas</TableCell>
                                    <TableCell align="center">Días Únicos</TableCell>
                                    <TableCell>Propiedad Más Buscada</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchData.data.anonymous_ips_analysis.map((ip) => (
                                    <TableRow key={ip.ip_last_4}>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                ****{ip.ip_last_4}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="h6" color="primary">
                                                {ip.search_count}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {ip.unique_dates}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {ip.most_searched_property}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">
                        No hay datos de IPs anónimas disponibles.
                    </Alert>
                )}
            </Paper>
        </Box>
    )
}