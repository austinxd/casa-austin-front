import { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    Notifications as NotificationsIcon,
    Refresh as RefreshIcon,
    Star as StarIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGetUpcomingCheckinsQuery } from '@/services/upcoming-checkins/upcomingCheckinsService'
import { UpcomingCheckinsParams } from '@/interfaces/analytics.interface'

interface HighDemandDate {
    date: string
    searches: number
    potential_clients: number
    anonymous_interest: number
}

interface RepeatedSearchClient {
    client_id: number
    client_name: string
    search_count: number
    dates_searched: string[]
}

export default function ConversionOpportunitiesSubTab() {
    const [filters] = useState<UpcomingCheckinsParams>({
        days_ahead: 60,
        limit: 20,
        include_anonymous: true
    })

    const { data: upcomingData, isLoading, error, refetch } = useGetUpcomingCheckinsQuery(filters)

    // Calcular fechas con alta demanda
    const highDemandDates: HighDemandDate[] = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) return []
        
        return upcomingData.data.top_upcoming_checkins
            .filter((date: any) => date.total_searches >= 5)
            .map((date: any) => ({
                date: date.checkin_date,
                searches: date.total_searches,
                potential_clients: date.searching_clients?.length || 0,
                anonymous_interest: date.searching_ips?.length || 0
            }))
            .sort((a, b) => b.searches - a.searches)
    }, [upcomingData])

    // Calcular clientes que buscan repetidamente
    const repeatedSearchClients: RepeatedSearchClient[] = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) return []
        
        const clientSearchCount: { [key: string]: { count: number; name: string; dates: string[] } } = {}
        
        upcomingData.data.top_upcoming_checkins.forEach((date: any) => {
            date.searching_clients?.forEach((client: any) => {
                if (!clientSearchCount[client.client_id]) {
                    clientSearchCount[client.client_id] = {
                        count: 0,
                        name: client.client_name,
                        dates: []
                    }
                }
                clientSearchCount[client.client_id].count += 1
                clientSearchCount[client.client_id].dates.push(date.checkin_date)
            })
        })
        
        return Object.entries(clientSearchCount)
            .filter(([_, data]) => data.count >= 2)
            .map(([clientId, data]) => ({
                client_id: parseInt(clientId),
                client_name: data.name,
                search_count: data.count,
                dates_searched: data.dates
            }))
            .sort((a, b) => b.search_count - a.search_count)
    }, [upcomingData])

    // Detectar alertas de demanda (fechas que se vuelven populares)
    const demandAlerts = useMemo(() => {
        if (!upcomingData?.data?.top_upcoming_checkins) return []
        
        return upcomingData.data.top_upcoming_checkins
            .filter((date: any) => {
                const daysUntil = date.days_until_checkin
                const searches = date.total_searches
                return daysUntil <= 30 && searches >= 3
            })
            .sort((a: any, b: any) => a.days_until_checkin - b.days_until_checkin)
    }, [upcomingData])

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
                Error al cargar las oportunidades de conversión. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon />
                        Oportunidades de Conversión
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => refetch()}
                        startIcon={<RefreshIcon />}
                    >
                        Refrescar
                    </Button>
                </Stack>
            </Paper>

            {/* Cards de resumen de oportunidades */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="warning.main">
                                        {highDemandDates.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Fechas Alta Demanda
                                    </Typography>
                                </Box>
                                <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {repeatedSearchClients.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Clientes Potenciales
                                    </Typography>
                                </Box>
                                <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="error.main">
                                        {demandAlerts.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Alertas Urgentes
                                    </Typography>
                                </Box>
                                <NotificationsIcon color="error" sx={{ fontSize: 40 }} />
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
                                        {highDemandDates.reduce((sum, date) => sum + date.potential_clients, 0)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Leads
                                    </Typography>
                                </Box>
                                <StarIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Fechas con alta demanda */}
                <Grid item xs={12} lg={6}>
                    <Paper>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningIcon color="warning" />
                                Fechas de Alta Demanda
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Check-ins con muchas búsquedas pero potencialmente pocas reservas
                            </Typography>
                        </Box>
                        
                        {highDemandDates.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="center">Búsquedas</TableCell>
                                            <TableCell align="center">Clientes</TableCell>
                                            <TableCell align="center">Anónimos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {highDemandDates.slice(0, 10).map((date: any) => (
                                            <TableRow key={date.date} hover>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {dayjs(date.date).format('DD/MM/YYYY')}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {dayjs(date.date).format('dddd')}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={date.searches}
                                                        color={date.searches >= 10 ? "error" : "warning"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" color="success.main">
                                                        {date.potential_clients}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" color="info.main">
                                                        {date.anonymous_interest}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay fechas con alta demanda detectadas
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Clientes potenciales */}
                <Grid item xs={12} lg={6}>
                    <Paper>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="primary" />
                                Clientes Potenciales
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Usuarios que buscan frecuentemente pero no han reservado
                            </Typography>
                        </Box>
                        
                        {repeatedSearchClients.length > 0 ? (
                            <Box sx={{ p: 2 }}>
                                <List dense>
                                    {repeatedSearchClients.slice(0, 10).map((client: any) => (
                                        <ListItem key={client.client_id}>
                                            <ListItemIcon>
                                                <PersonIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {client.client_name}
                                                        </Typography>
                                                        <Chip 
                                                            label={`${client.search_count} búsquedas`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Box mt={0.5}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Fechas buscadas:
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                            {client.dates_searched.slice(0, 3).map((date: any, idx: number) => (
                                                                <Chip 
                                                                    key={idx}
                                                                    label={dayjs(date).format('DD/MM')}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                            {client.dates_searched.length > 3 && (
                                                                <Chip 
                                                                    label={`+${client.dates_searched.length - 3}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay clientes con búsquedas repetidas detectados
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Alertas de demanda */}
                <Grid item xs={12} lg={6}>
                    <Paper>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <NotificationsIcon color="error" />
                                Alertas de Demanda Urgente
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Fechas próximas con demanda creciente
                            </Typography>
                        </Box>
                        
                        {demandAlerts.length > 0 ? (
                            <Box sx={{ p: 2 }}>
                                <List dense>
                                    {demandAlerts.slice(0, 8).map((alert: any) => (
                                        <ListItem key={alert.checkin_date}>
                                            <ListItemIcon>
                                                <CalendarIcon 
                                                    color={alert.days_until_checkin <= 7 ? "error" : "warning"} 
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {dayjs(alert.checkin_date).format('DD/MM/YYYY')}
                                                        </Typography>
                                                        <Chip 
                                                            label={`${alert.days_until_checkin}d`}
                                                            color={alert.days_until_checkin <= 7 ? "error" : "warning"}
                                                            size="small"
                                                        />
                                                        <Chip 
                                                            label={`${alert.total_searches} búsquedas`}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Typography variant="caption" color="text.secondary">
                                                        {alert.weekday} • {alert.searching_clients?.length || 0} clientes • {alert.searching_ips?.length || 0} IPs anónimas
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay alertas de demanda urgente
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Recomendaciones de pricing */}
                <Grid item xs={12} lg={6}>
                    <Paper>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MoneyIcon color="success" />
                                Recomendaciones de Pricing
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sugerencias basadas en demanda vs disponibilidad
                            </Typography>
                        </Box>
                        
                        <Box sx={{ p: 2 }}>
                            <List dense>
                                {/* Recomendación para fechas de alta demanda */}
                                {highDemandDates.slice(0, 5).map((date: any) => (
                                    <ListItem key={date.date}>
                                        <ListItemIcon>
                                            <TrendingUpIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" fontWeight="medium">
                                                    {dayjs(date.date).format('DD/MM/YYYY')} - Aumentar precios
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                    Alta demanda ({date.searches} búsquedas) - Considera incremento del 15-25%
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                                
                                {highDemandDates.length === 0 && (
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" color="text.secondary">
                                                    No hay recomendaciones de pricing disponibles
                                                </Typography>
                                            }
                                            secondary="Las recomendaciones aparecerán cuando haya fechas con alta demanda"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Información del análisis */}
            {upcomingData && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Análisis de oportunidades generado:</strong> {dayjs(upcomingData.generated_at).format('DD/MM/YYYY HH:mm')} | {' '}
                        <strong>Configuración:</strong> {filters.days_ahead} días hacia adelante, {filters.include_anonymous ? 'incluyendo' : 'excluyendo'} búsquedas anónimas
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}