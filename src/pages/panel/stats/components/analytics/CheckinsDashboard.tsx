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
    LinearProgress,
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
                Error al cargar el análisis de check-ins próximos. Por favor intenta nuevamente.
            </Alert>
        )
    }

    if (!checkinsData?.success) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                No se pudieron cargar los datos de check-ins próximos.
            </Alert>
        )
    }

    const summary = checkinsData.data.summary_metrics
    const upcomingCheckins = checkinsData.data.top_upcoming_checkins

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
                                        {summary.total_upcoming_dates}
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
                                        {summary.avg_searches_per_date.toFixed(1)}
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
                                        {dayjs(summary.most_popular_checkin).format('DD/MM')}
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
                                        {dayjs(summary.peak_demand_day).format('dddd')}
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
                
                {upcomingCheckins?.length ? (
                    <Grid container spacing={2}>
                        {upcomingCheckins.slice(0, 8).map((checkin, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={checkin.checkin_date}>
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
                                                    {dayjs(checkin.checkin_date).format('DD/MM/YYYY')}
                                                </Typography>
                                                <Chip 
                                                    label={`#${index + 1}`}
                                                    size="small"
                                                    color={index === 0 ? "error" : index <= 2 ? "warning" : "default"}
                                                />
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary">
                                                {dayjs(checkin.checkin_date).format('dddd')}
                                            </Typography>

                                            <Stack spacing={0.5}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Búsquedas:</Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {checkin.searches_count}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2">Usuarios únicos:</Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {checkin.unique_searchers}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Popularidad:
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={checkin.popularity_score} 
                                                        sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                                                        color={index === 0 ? "error" : index <= 2 ? "warning" : "primary"}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {checkin.popularity_score.toFixed(1)}% score
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Propiedad más buscada:
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {checkin.most_searched_property}
                                                </Typography>
                                            </Box>
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
                
                {upcomingCheckins?.length ? (
                    <List>
                        {upcomingCheckins.map((checkin, index) => (
                            <ListItem 
                                key={checkin.checkin_date} 
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
                                                {dayjs(checkin.checkin_date).format('DD/MM/YYYY - dddd')}
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Chip 
                                                    label={`${checkin.searches_count} búsquedas`}
                                                    size="small"
                                                    color="primary"
                                                />
                                                <Chip 
                                                    label={`${checkin.unique_searchers} usuarios`}
                                                    size="small"
                                                    color="info"
                                                    variant="outlined"
                                                />
                                            </Stack>
                                        </Stack>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            Propiedad más buscada: <strong>{checkin.most_searched_property}</strong> 
                                            • Score de popularidad: {checkin.popularity_score.toFixed(1)}%
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