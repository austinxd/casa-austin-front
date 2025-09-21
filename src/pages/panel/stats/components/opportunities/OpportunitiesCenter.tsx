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
    Button,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    LocalFireDepartment as HotIcon,
    Person as PersonIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGetUpcomingCheckinsQuery } from '@/services/upcoming-checkins/upcomingCheckinsService'

export default function OpportunitiesCenter() {
    const [filters] = useState({
        days_ahead: 60,
        limit: 25,
        include_anonymous: true
    })

    const { data: upcomingData, isLoading, error, refetch } = useGetUpcomingCheckinsQuery(filters)

    // Calcular oportunidades de alta conversión
    const highConversionOpportunities = upcomingData?.top_upcoming_checkins?.filter(
        checkin => checkin.total_searches >= 5 && checkin.days_until_checkin <= 30
    ) || []

    // Calcular leads calientes (clientes que buscan repetidamente)
    const hotLeads = upcomingData?.top_upcoming_checkins?.reduce((acc: any[], checkin) => {
        checkin.searching_clients?.forEach(client => {
            const existingLead = acc.find(lead => lead.client_id === client.client_id)
            if (existingLead) {
                existingLead.search_count += 1
                existingLead.dates_searched.push(checkin.checkin_date)
            } else {
                acc.push({
                    client_id: client.client_id,
                    client_name: client.client_name,
                    search_count: 1,
                    dates_searched: [checkin.checkin_date],
                    last_search: checkin.checkin_date
                })
            }
        })
        return acc
    }, []).filter((lead: any) => lead.search_count >= 2).sort((a: any, b: any) => b.search_count - a.search_count) || []

    // Fechas trending (alta demanda reciente)
    const trendingDates = upcomingData?.top_upcoming_checkins?.filter(
        checkin => checkin.total_searches >= 3
    ).sort((a, b) => b.total_searches - a.total_searches).slice(0, 10) || []

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
                Error al cargar el centro de oportunidades. Por favor intenta nuevamente.
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
                            🎯 Centro de Oportunidades
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Lead management, predicción de demanda y optimización de conversiones
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={() => refetch()}
                        startIcon={<RefreshIcon />}
                    >
                        Refrescar Datos
                    </Button>
                </Stack>
            </Box>

            {/* Métricas de oportunidades */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" color="error.main">
                                        {highConversionOpportunities.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Oportunidades Calientes
                                    </Typography>
                                </Box>
                                <HotIcon color="error" sx={{ fontSize: 40 }} />
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
                                        {hotLeads.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Leads Calientes
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
                                    <Typography variant="h4" color="primary">
                                        {trendingDates.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Fechas Trending
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
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
                                        ${(trendingDates.reduce((sum, date) => sum + (date.total_searches * 75), 0)).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Potencial de Ingresos
                                    </Typography>
                                </Box>
                                <MoneyIcon color="success" sx={{ fontSize: 40 }} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Oportunidades de alta conversión */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HotIcon color="error" />
                            Oportunidades de Alta Conversión
                        </Typography>
                        
                        {highConversionOpportunities.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="center">Búsquedas</TableCell>
                                            <TableCell align="center">Días Restantes</TableCell>
                                            <TableCell align="center">Nivel</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {highConversionOpportunities.slice(0, 8).map((opportunity) => (
                                            <TableRow key={opportunity.checkin_date}>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {dayjs(opportunity.checkin_date).format('DD/MM/YYYY')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {dayjs(opportunity.checkin_date).format('dddd')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={opportunity.total_searches}
                                                        size="small"
                                                        color={opportunity.total_searches >= 10 ? "error" : 
                                                               opportunity.total_searches >= 7 ? "warning" : "primary"}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2">
                                                        {opportunity.days_until_checkin} días
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={opportunity.total_searches >= 10 ? "CRÍTICO" : 
                                                               opportunity.total_searches >= 7 ? "ALTO" : "MEDIO"}
                                                        size="small"
                                                        color={opportunity.total_searches >= 10 ? "error" : 
                                                               opportunity.total_searches >= 7 ? "warning" : "info"}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Alert severity="info">
                                No hay oportunidades de alta conversión en este momento.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Leads calientes */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="warning" />
                            Leads Calientes (Búsquedas Repetidas)
                        </Typography>
                        
                        {hotLeads.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell align="center">Búsquedas</TableCell>
                                            <TableCell align="center">Fechas</TableCell>
                                            <TableCell align="center">Acción</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {hotLeads.slice(0, 8).map((lead) => (
                                            <TableRow key={lead.client_id}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {lead.client_name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {lead.client_id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={lead.search_count}
                                                        size="small"
                                                        color={lead.search_count >= 4 ? "error" : 
                                                               lead.search_count >= 3 ? "warning" : "primary"}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="caption">
                                                        {lead.dates_searched.length} fechas
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button 
                                                        size="small" 
                                                        variant="outlined"
                                                        color="primary"
                                                    >
                                                        Contactar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Alert severity="info">
                                No hay leads calientes identificados en este momento.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Fechas trending */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon color="primary" />
                    Fechas Trending - Alta Demanda
                </Typography>
                
                {trendingDates.length > 0 ? (
                    <Grid container spacing={2}>
                        {trendingDates.map((date) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={date.checkin_date}>
                                <Card variant="outlined">
                                    <CardContent sx={{ p: 2 }}>
                                        <Stack spacing={1}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {dayjs(date.checkin_date).format('DD/MM/YYYY')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(date.checkin_date).format('dddd')}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Chip 
                                                    label={`${date.total_searches} búsquedas`}
                                                    size="small"
                                                    color={date.total_searches >= 10 ? "error" : 
                                                           date.total_searches >= 5 ? "warning" : "primary"}
                                                />
                                                <Typography variant="caption">
                                                    {date.days_until_checkin}d
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info">
                        No hay fechas con demanda trending en este momento.
                    </Alert>
                )}
            </Paper>
        </Box>
    )
}