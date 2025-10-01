import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
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
    Slider,
    Switch,
    FormControlLabel,
} from '@mui/material'
import {
    CalendarToday as CalendarIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    Public as PublicIcon,
    TrendingUp as TrendingUpIcon,
    Refresh as RefreshIcon,
    EventAvailable as EventIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGetUpcomingCheckinsQuery } from '@/services/upcoming-checkins/upcomingCheckinsService'
import { UpcomingCheckinsParams } from '@/interfaces/analytics.interface'

export default function UpcomingCheckinsSubTab() {
    const [filters, setFilters] = useState<UpcomingCheckinsParams>({
        days_ahead: 60,
        limit: 20,
        include_anonymous: true
    })

    const { data: upcomingData, isLoading, error, refetch } = useGetUpcomingCheckinsQuery(filters)
    
    // Debug: log para ver estructura real de datos
    console.log('UpcomingCheckins - upcomingData:', upcomingData)
    console.log('UpcomingCheckins - error:', error)

    const handleFilterChange = (field: keyof UpcomingCheckinsParams, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    // Función para obtener color según popularidad
    const getPopularityColor = (searches: number) => {
        if (searches >= 10) return 'error'
        if (searches >= 5) return 'warning'
        if (searches >= 2) return 'primary'
        return 'default'
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
                Error al cargar los check-ins próximos. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon />
                    Configuración de Análisis
                </Typography>
                
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Typography gutterBottom>
                            Días hacia adelante: {filters.days_ahead}
                        </Typography>
                        <Slider
                            value={filters.days_ahead}
                            onChange={(_, value) => handleFilterChange('days_ahead', value)}
                            min={1}
                            max={180}
                            step={1}
                            marks={[
                                { value: 7, label: '1 sem' },
                                { value: 30, label: '1 mes' },
                                { value: 60, label: '2 meses' },
                                { value: 90, label: '3 meses' },
                                { value: 180, label: '6 meses' }
                            ]}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Límite de resultados"
                            type="number"
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value) || 20)}
                            inputProps={{ min: 1, max: 100, step: 5 }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filters.include_anonymous}
                                    onChange={(e) => handleFilterChange('include_anonymous', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Incluir búsquedas anónimas"
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <Button
                            variant="contained"
                            onClick={() => refetch()}
                            startIcon={<RefreshIcon />}
                            fullWidth
                        >
                            Actualizar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Cards de resumen */}
            {upcomingData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="primary">
                                            {upcomingData.data?.top_upcoming_checkins?.reduce((sum: number, item: any) => sum + item.total_searches, 0) || 0}
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
                                            {upcomingData.data?.top_upcoming_checkins?.length || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fechas Únicas
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
                                        <Typography variant="h4" color="warning.main">
                                            {upcomingData.data?.top_upcoming_checkins?.reduce((count: number, item: any) => count + (item.searching_clients?.length || 0), 0) || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Clientes Únicos
                                        </Typography>
                                    </Box>
                                    <PersonIcon color="warning" sx={{ fontSize: 40 }} />
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
                                            {upcomingData.data?.top_upcoming_checkins?.reduce((count: number, item: any) => count + (item.searching_ips?.length || 0), 0) || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            IPs Anónimas
                                        </Typography>
                                    </Box>
                                    <PublicIcon color="info" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tabla de fechas trending */}
            <Paper>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon color="primary" />
                        Top Fechas de Check-in Más Buscadas
                    </Typography>
                    {upcomingData && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Período de análisis: {dayjs(upcomingData.data?.period_info?.analysis_from).format('DD/MM/YYYY')} 
                            - {dayjs(upcomingData.data?.period_info?.analysis_to).format('DD/MM/YYYY')} 
                            ({upcomingData.data?.period_info?.days_ahead || 0} días)
                        </Typography>
                    )}
                </Box>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha Check-in</TableCell>
                                <TableCell align="center">Día Semana</TableCell>
                                <TableCell align="center">Días Restantes</TableCell>
                                <TableCell align="center">Total Búsquedas</TableCell>
                                <TableCell align="center">Clientes</TableCell>
                                <TableCell align="center">Anónimos</TableCell>
                                <TableCell align="center">Estadía Promedio</TableCell>
                                <TableCell align="center">Usuarios Únicos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {upcomingData?.data?.top_upcoming_checkins?.map((checkin: any) => (
                                <TableRow key={checkin.checkin_date} hover>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {dayjs(checkin.checkin_date).format('DD/MM/YYYY')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(checkin.checkin_date).format('dddd')}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={checkin.weekday} 
                                            size="small" 
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={`${checkin.days_until_checkin}d`}
                                            color={checkin.days_until_checkin <= 7 ? "error" : checkin.days_until_checkin <= 30 ? "warning" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={checkin.total_searches}
                                            color={getPopularityColor(checkin.total_searches)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" color="success.main">
                                            {checkin.client_searches}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" color="warning.main">
                                            {checkin.anonymous_searches}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">
                                            {checkin.avg_stay_duration.toFixed(1)} días
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Chip 
                                                label={`${checkin.searching_clients?.length || 0}c`}
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Chip 
                                                label={`${checkin.searching_ips?.length || 0}ip`}
                                                color="info"
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Información del análisis */}
            {upcomingData && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Análisis generado:</strong> {dayjs(upcomingData.generated_at).format('DD/MM/YYYY HH:mm')} | {' '}
                        <strong>Configuración:</strong> {filters.days_ahead} días, máximo {filters.limit} resultados
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}