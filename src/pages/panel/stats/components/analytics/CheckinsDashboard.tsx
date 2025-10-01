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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import {
    CalendarToday as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    Event as EventIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import dayjs from 'dayjs'

// Services y tipos
import { useGetNewUpcomingCheckinsQuery } from '@/services/analytics/newUpcomingCheckinsService'
import { GlobalFilters } from '@/interfaces/analytics.interface'
import { formatNumber, formatDecimal, safeArray, safeString } from '@/utils/formatters'

interface CheckinsDashboardProps {
    filters: GlobalFilters
}

export default function CheckinsDashboard({ filters }: CheckinsDashboardProps) {
    const [localDaysAhead, setLocalDaysAhead] = useState(filters.daysAhead)
    const [localLimit, setLocalLimit] = useState(filters.limit)
    
    const { data: checkinsData, isLoading, error } = useGetNewUpcomingCheckinsQuery({
        days_ahead: localDaysAhead,
        limit: localLimit,
        include_anonymous: filters.includeAnonymous
    })

    // Debug logging
    console.log('CheckinsDashboard - checkinsData:', checkinsData)
    console.log('CheckinsDashboard - error:', error)

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        )
    }

    if (error) {
        console.error('CheckinsDashboard API Error:', error)
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error al cargar el análisis de check-ins próximos. Por favor intenta nuevamente.
                <br />
                <small>Error: {JSON.stringify(error)}</small>
            </Alert>
        )
    }

    if (!checkinsData?.success || !checkinsData?.data) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                No se pudieron cargar los datos de check-ins próximos.
                <br />
                <small>Data: {JSON.stringify(checkinsData)}</small>
            </Alert>
        )
    }

    const upcomingCheckins = checkinsData.data.top_upcoming_checkins || []
    
    const summary = {
        total_upcoming_dates: upcomingCheckins.length,
        avg_searches_per_date: upcomingCheckins.length > 0 
            ? upcomingCheckins.reduce((sum, item) => sum + item.total_searches, 0) / upcomingCheckins.length 
            : 0,
        most_popular_checkin: upcomingCheckins.length > 0 ? upcomingCheckins[0].checkin_date : '',
        peak_demand_day: upcomingCheckins.length > 0 ? upcomingCheckins[0].weekday : ''
    }

    return (
        <Box>
            {/* Controles de configuración */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <Typography variant="h6">Configuración de Análisis:</Typography>
                    
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Días Adelante</InputLabel>
                        <Select
                            value={localDaysAhead}
                            label="Días Adelante"
                            onChange={(e) => setLocalDaysAhead(Number(e.target.value))}
                        >
                            <MenuItem value={30}>30 días</MenuItem>
                            <MenuItem value={60}>60 días</MenuItem>
                            <MenuItem value={90}>90 días</MenuItem>
                            <MenuItem value={120}>120 días</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Límite de Fechas</InputLabel>
                        <Select
                            value={localLimit}
                            label="Límite de Fechas"
                            onChange={(e) => setLocalLimit(Number(e.target.value))}
                        >
                            <MenuItem value={10}>10 fechas</MenuItem>
                            <MenuItem value={20}>20 fechas</MenuItem>
                            <MenuItem value={30}>30 fechas</MenuItem>
                            <MenuItem value={50}>50 fechas</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            {/* Métricas principales */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="primary">
                                        {formatNumber(summary.total_upcoming_dates)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Fechas con Demanda
                                    </Typography>
                                </Box>
                                <CalendarIcon color="primary" sx={{ fontSize: 40 }} />
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
                                        {formatDecimal(summary.avg_searches_per_date)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Búsquedas/Fecha
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="info" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h5" color="success.main">
                                        {summary.most_popular_checkin ? dayjs(summary.most_popular_checkin).format('DD/MM') : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Check-in Más Popular
                                    </Typography>
                                </Box>
                                <EventIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" color="warning.main">
                                        {summary.peak_demand_day ? dayjs(summary.peak_demand_day).format('dddd') : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Día Pico de Demanda
                                    </Typography>
                                </Box>
                                <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Top fechas trending */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" mb={3}>
                    📅 Fechas Trending - Check-ins Más Buscados
                </Typography>
                
                {safeArray(upcomingCheckins).length ? (
                    <Grid container spacing={2}>
                        {safeArray(upcomingCheckins).slice(0, 8).map((checkin: any, index: number) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={safeString(checkin?.checkin_date, `checkin-${index}`)}>
                                <Card 
                                    variant="outlined"
                                    sx={{ 
                                        height: '100%',
                                        border: index < 3 ? 2 : 1,
                                        borderColor: index === 0 ? 'error.main' : 
                                                   index === 1 ? 'warning.main' :
                                                   index === 2 ? 'info.main' : 'divider'
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Stack spacing={1}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h6" color="primary">
                                                    {checkin?.checkin_date ? dayjs(checkin.checkin_date).format('DD/MM/YYYY') : 'N/A'}
                                                </Typography>
                                                <Chip 
                                                    label={`#${index + 1}`}
                                                    size="small"
                                                    color={index === 0 ? "error" : index <= 2 ? "warning" : "default"}
                                                />
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary">
                                                {checkin?.checkin_date ? dayjs(checkin.checkin_date).format('dddd') : 'N/A'}
                                            </Typography>

                                            <Stack spacing={0.5}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Total Búsquedas:</Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {formatNumber(checkin?.total_searches)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Clientes:</Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {formatNumber(checkin?.client_searches)}
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Anónimos:</Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {formatNumber(checkin?.anonymous_searches)}
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Estadía Promedio:</Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {formatDecimal(checkin?.avg_stay_duration)} días
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info">
                        No hay datos de check-ins próximos disponibles.
                    </Alert>
                )}
            </Paper>

            {/* Lista detallada */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                    📋 Lista Detallada de Fechas con Mayor Demanda
                </Typography>
                
                {safeArray(upcomingCheckins).length ? (
                    <List>
                        {safeArray(upcomingCheckins).map((checkin: any, index: number) => (
                            <ListItem 
                                key={safeString(checkin?.checkin_date, `checkin-detail-${index}`)} 
                                sx={{ 
                                    px: 2, 
                                    borderLeft: index < 3 ? 4 : 0,
                                    borderColor: index === 0 ? 'error.main' : 
                                               index === 1 ? 'warning.main' :
                                               index === 2 ? 'info.main' : 'transparent',
                                    bgcolor: index < 3 ? 'grey.50' : 'transparent',
                                    mb: 1,
                                    borderRadius: 1
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body1" fontWeight="bold">
                                                {checkin?.checkin_date ? dayjs(checkin.checkin_date).format('DD/MM/YYYY - dddd') : 'N/A'}
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Chip 
                                                    label={`${formatNumber(checkin?.total_searches)} búsquedas`}
                                                    size="small"
                                                    color="primary"
                                                />
                                                <Chip 
                                                    label={`${formatNumber(checkin?.client_searches)} clientes`}
                                                    size="small"
                                                    color="info"
                                                    variant="outlined"
                                                />
                                            </Stack>
                                        </Stack>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            Búsquedas Anónimas: <strong>{formatNumber(checkin?.anonymous_searches)}</strong> 
                                            • Estadía Promedio: {formatDecimal(checkin?.avg_stay_duration)} días
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Alert severity="info">
                        No hay datos detallados de check-ins disponibles.
                    </Alert>
                )}
            </Paper>
        </Box>
    )
}