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
import { formatNumber, formatPercent, formatDecimal, safeArray, safeString, safeNumber } from '@/utils/formatters'

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
            categories: safeArray(searchData?.data?.searches_by_weekday).map((item: any) => safeString(item?.weekday, 'N/A')),
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
        data: safeArray(searchData?.data?.searches_by_weekday).map((item: any) => safeNumber(item?.searches_count, 0))
    }]

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        )
    }

    if (error) {
        console.error('SearchDashboard API Error:', error)
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error al cargar el análisis de búsquedas. Por favor intenta nuevamente.
                <br />
                <small>Error: {JSON.stringify(error)}</small>
            </Alert>
        )
    }

    if (!searchData?.success || !searchData?.data) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                No se pudieron cargar los datos de búsquedas.
                <br />
                <small>Data: {JSON.stringify(searchData)}</small>
            </Alert>
        )
    }

    const summary = searchData.data.search_summary || {
        total_searches: 0,
        unique_clients_searching: 0,
        conversion_rate: 0,
        avg_searches_per_day: 0,
        anonymous_searches: 0
    }

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
                                        {formatNumber(summary.total_searches)}
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
                                        {formatNumber(summary.unique_clients_searching)}
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
                                        {formatPercent(summary.conversion_rate)}
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
                                        {formatDecimal(summary.avg_searches_per_day)}
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
                        
                        {safeArray(searchData?.data?.top_searched_properties).length ? (
                            <List>
                                {safeArray(searchData.data.top_searched_properties).slice(0, 5).map((property: any, index: number) => (
                                    <ListItem key={safeString(property?.property_name, `property-${index}`)} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        #{index + 1} {safeString(property?.property_name, 'N/A')}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${formatNumber(property?.search_count)} búsquedas`}
                                                        size="small"
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                </Stack>
                                            }
                                            secondary={`${formatPercent(property?.percentage)} del total`}
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
                        
                        {safeArray(searchData?.data?.top_searching_clients).length ? (
                            <List>
                                {safeArray(searchData.data.top_searching_clients).slice(0, 5).map((client: any, index: number) => (
                                    <ListItem key={safeString(client?.client_email, `client-${index}`)} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        #{index + 1} {safeString(client?.client_name, 'N/A')}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${formatNumber(client?.search_count)} búsquedas`}
                                                        size="small"
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                </Stack>
                                            }
                                            secondary={`Última búsqueda: ${safeString(client?.last_search_date, 'N/A')}`}
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
                
                {safeArray(searchData?.data?.anonymous_ips_analysis?.top_searching_ips).length ? (
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
                                {safeArray(searchData.data.anonymous_ips_analysis.top_searching_ips).map((ip: any, index: number) => (
                                    <TableRow key={safeString(ip?.ip_last_4, `ip-${index}`)}>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                ****{safeString(ip?.ip_last_4, 'N/A')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="h6" color="primary">
                                                {formatNumber(ip?.search_count)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {formatNumber(ip?.unique_dates)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {safeString(ip?.most_searched_property, 'N/A')}
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

            {/* Nuevas secciones de análisis */}
            
            {/* Búsquedas por hora del día */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" mb={2}>
                    ⏰ Búsquedas por Hora del Día
                </Typography>
                
                {safeArray(searchData?.data?.searches_by_hour).length ? (
                    <Chart
                        options={{
                            chart: {
                                type: 'line',
                                height: 350,
                                toolbar: { show: true }
                            },
                            xaxis: {
                                categories: safeArray(searchData.data.searches_by_hour).map((item: any) => safeString(item?.hour_label, 'N/A')),
                                title: { text: 'Hora del Día' }
                            },
                            yaxis: {
                                title: { text: 'Número de Búsquedas' }
                            },
                            title: {
                                text: 'Actividad de Búsquedas por Hora',
                                align: 'center'
                            },
                            colors: ['#FF6B35'],
                            dataLabels: { enabled: false },
                            stroke: { curve: 'smooth' }
                        }}
                        series={[{
                            name: 'Búsquedas',
                            data: safeArray(searchData.data.searches_by_hour).map((item: any) => safeNumber(item?.searches_count, 0))
                        }]}
                        type="line"
                        height={350}
                    />
                ) : (
                    <Alert severity="info">
                        No hay datos de búsquedas por hora disponibles.
                    </Alert>
                )}
            </Paper>

            {/* Actividad diaria de búsquedas */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" mb={2}>
                    📊 Actividad Diaria de Búsquedas
                </Typography>
                
                {safeArray(searchData?.data?.daily_search_activity).length ? (
                    <Chart
                        options={{
                            chart: {
                                type: 'area',
                                height: 350,
                                toolbar: { show: true }
                            },
                            xaxis: {
                                categories: safeArray(searchData.data.daily_search_activity).map((item: any) => safeString(item?.date, 'N/A')),
                                title: { text: 'Fecha' }
                            },
                            yaxis: {
                                title: { text: 'Número de Búsquedas' }
                            },
                            title: {
                                text: 'Evolución Diaria de Búsquedas',
                                align: 'center'
                            },
                            colors: ['#4CAF50'],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shadeIntensity: 1,
                                    opacityFrom: 0.7,
                                    opacityTo: 0.3
                                }
                            }
                        }}
                        series={[{
                            name: 'Búsquedas Diarias',
                            data: safeArray(searchData.data.daily_search_activity).map((item: any) => safeNumber(item?.searches_count, 0))
                        }]}
                        type="area"
                        height={350}
                    />
                ) : (
                    <Alert severity="info">
                        No hay datos de actividad diaria disponibles.
                    </Alert>
                )}
            </Paper>

            {/* Fechas de check-in populares y análisis de estadía */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            🗓️ Fechas de Check-in Más Populares
                        </Typography>
                        
                        {safeArray(searchData?.data?.popular_checkin_dates).length ? (
                            <List>
                                {safeArray(searchData.data.popular_checkin_dates).slice(0, 5).map((date: any, index: number) => (
                                    <ListItem key={safeString(date?.checkin_date, `date-${index}`)} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {safeString(date?.checkin_date, 'N/A')}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${formatNumber(date?.searches_count)} búsquedas`}
                                                        size="small"
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                </Stack>
                                            }
                                            secondary={`${formatNumber(date?.unique_searchers)} buscadores únicos • ${formatNumber(date?.avg_stay_duration)} días promedio`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">
                                No hay datos de fechas populares disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            📅 Análisis de Duración de Estadía
                        </Typography>
                        
                        {safeArray(searchData?.data?.stay_duration_analysis).length ? (
                            <List>
                                {safeArray(searchData.data.stay_duration_analysis).slice(0, 5).map((duration: any, index: number) => (
                                    <ListItem key={safeString(duration?.duration_label, `duration-${index}`)} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {safeString(duration?.duration_label, 'N/A')}
                                                    </Typography>
                                                    <Chip 
                                                        label={formatPercent(safeNumber(duration?.percentage, 0))}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                </Stack>
                                            }
                                            secondary={`${formatNumber(duration?.searches_count)} búsquedas • ${formatNumber(duration?.avg_guests)} huéspedes promedio`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">
                                No hay datos de duración de estadía disponibles.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Análisis por número de huéspedes */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" mb={2}>
                    👥 Análisis por Número de Huéspedes
                </Typography>
                
                {safeArray(searchData?.data?.guest_count_analysis).length ? (
                    <Chart
                        options={{
                            chart: {
                                type: 'donut',
                                height: 350
                            },
                            labels: safeArray(searchData.data.guest_count_analysis).map((item: any) => safeString(item?.guest_range, 'N/A')),
                            title: {
                                text: 'Distribución de Búsquedas por Número de Huéspedes',
                                align: 'center'
                            },
                            colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2'],
                            dataLabels: {
                                enabled: true,
                                formatter: function(val: number) {
                                    return val.toFixed(1) + '%'
                                }
                            },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        labels: {
                                            show: true,
                                            total: {
                                                show: true,
                                                label: 'Total Búsquedas'
                                            }
                                        }
                                    }
                                }
                            }
                        }}
                        series={safeArray(searchData.data.guest_count_analysis).map((item: any) => safeNumber(item?.searches_count, 0))}
                        type="donut"
                        height={350}
                    />
                ) : (
                    <Alert severity="info">
                        No hay datos de análisis por huéspedes disponibles.
                    </Alert>
                )}
            </Paper>

            {/* Búsquedas por cliente específico */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                    🔍 Detalle de Búsquedas por Cliente
                </Typography>
                
                {safeArray(searchData?.data?.searches_per_client).length ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell align="center">Búsquedas</TableCell>
                                    <TableCell align="center">Huéspedes Promedio</TableCell>
                                    <TableCell>Última Búsqueda</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {safeArray(searchData.data.searches_per_client).slice(0, 10).map((client: any, index: number) => (
                                    <TableRow key={safeString(client?.client_id, `client-${index}`)}>
                                        <TableCell>
                                            <Stack>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {safeString(client?.client_name, 'N/A')}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {safeString(client?.client_email, 'N/A')}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="h6" color="primary">
                                                {formatNumber(client?.searches_count)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {formatNumber(client?.avg_guests_searched)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {safeString(client?.last_search_date, 'N/A')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info">
                        No hay datos de búsquedas por cliente disponibles.
                    </Alert>
                )}
            </Paper>
        </Box>
    )
}