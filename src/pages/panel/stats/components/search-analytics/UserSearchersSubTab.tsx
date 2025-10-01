import { useState } from 'react'
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'
import {
    Person as PersonIcon,
    Computer as ComputerIcon,
    ExpandMore as ExpandMoreIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    Group as GroupIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGetUpcomingCheckinsQuery } from '@/services/upcoming-checkins/upcomingCheckinsService'
import { UpcomingCheckinsParams } from '@/interfaces/analytics.interface'

export default function UserSearchersSubTab() {
    const [filters] = useState<UpcomingCheckinsParams>({
        days_ahead: 60,
        limit: 20,
        include_anonymous: true
    })

    const [selectedDate, setSelectedDate] = useState<string>('')

    const { data: upcomingData, isLoading, error, refetch } = useGetUpcomingCheckinsQuery(filters)

    // Obtener datos de la fecha seleccionada
    const selectedDateData = upcomingData?.data?.top_upcoming_checkins?.find(
        (checkin: any) => checkin.checkin_date === selectedDate
    )

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
                Error al cargar el análisis de usuarios. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header con refresh */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon />
                        Análisis de Usuarios Buscadores
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

            {/* Selector de fechas */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    Seleccionar Fecha para Análisis Detallado
                </Typography>
                <Grid container spacing={1}>
                    {upcomingData?.data?.top_upcoming_checkins?.slice(0, 10).map((checkin: any) => (
                        <Grid item key={checkin.checkin_date}>
                            <Button
                                variant={selectedDate === checkin.checkin_date ? "contained" : "outlined"}
                                onClick={() => setSelectedDate(checkin.checkin_date)}
                                size="small"
                            >
                                {dayjs(checkin.checkin_date).format('DD/MM')}
                                <Chip 
                                    label={checkin.total_searches}
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {selectedDateData ? (
                <>
                    {/* Información de la fecha seleccionada */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Análisis para {dayjs(selectedDateData.checkin_date).format('DD/MM/YYYY')} 
                            ({selectedDateData.weekday})
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" color="primary">
                                            {selectedDateData.total_searches}
                                        </Typography>
                                        <Typography variant="caption">Total Búsquedas</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" color="success.main">
                                            {selectedDateData.client_searches}
                                        </Typography>
                                        <Typography variant="caption">Clientes Registrados</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" color="warning.main">
                                            {selectedDateData.anonymous_searches}
                                        </Typography>
                                        <Typography variant="caption">Búsquedas Anónimas</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" color="info.main">
                                            {selectedDateData.avg_stay_duration.toFixed(1)}
                                        </Typography>
                                        <Typography variant="caption">Días Promedio</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Clientes registrados */}
                    <Paper sx={{ mb: 3 }}>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="success" />
                                Clientes Registrados Interesados ({selectedDateData.searching_clients?.length || 0})
                            </Typography>
                        </Box>
                        
                        {selectedDateData.searching_clients?.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell align="center">Check-out</TableCell>
                                            <TableCell align="center">Huéspedes</TableCell>
                                            <TableCell>Propiedad</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedDateData.searching_clients.map((client: any) => (
                                            <TableRow key={client.client_id} hover>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <PersonIcon color="success" fontSize="small" />
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {client.client_name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <EmailIcon color="action" fontSize="small" />
                                                        <Typography variant="body2" fontFamily="monospace">
                                                            {client.client_email}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={dayjs(client.checkout_date).format('DD/MM')}
                                                        color="primary"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={`${client.guests} ${client.guests === 1 ? 'persona' : 'personas'}`}
                                                        color="info"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <HomeIcon color="action" fontSize="small" />
                                                        <Typography variant="body2">
                                                            {client.property}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay clientes registrados buscando esta fecha
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* Usuarios anónimos */}
                    <Paper>
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ComputerIcon color="warning" />
                                Usuarios Anónimos por IP ({selectedDateData.searching_ips?.length || 0})
                            </Typography>
                        </Box>
                        
                        {selectedDateData.searching_ips && selectedDateData.searching_ips.length > 0 ? (
                            <Box sx={{ p: 2 }}>
                                {selectedDateData.searching_ips.map((ip: any) => (
                                    <Accordion key={ip.ip_address}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Stack direction="row" alignItems="center" spacing={2} width="100%">
                                                <ComputerIcon color="warning" />
                                                <Typography variant="body1" fontFamily="monospace">
                                                    {ip.ip_address}
                                                </Typography>
                                                <Chip 
                                                    label={`${ip.searches_count} búsquedas`}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Stack>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Fechas de Check-out Buscadas:
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {ip.checkout_dates.map((date: any, idx: number) => (
                                                            <Chip 
                                                                key={idx}
                                                                label={dayjs(date).format('DD/MM')}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Stack>
                                                </Grid>
                                                
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Número de Huéspedes:
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {ip.guests_counts.map((guests: any, idx: number) => (
                                                            <Chip 
                                                                key={idx}
                                                                label={`${guests} ${guests === 1 ? 'persona' : 'personas'}`}
                                                                size="small"
                                                                color="info"
                                                            />
                                                        ))}
                                                    </Stack>
                                                </Grid>
                                                
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Propiedades de Interés:
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {ip.properties.map((property: any, idx: number) => (
                                                            <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                                                                <HomeIcon color="action" fontSize="small" />
                                                                <Typography variant="body2">
                                                                    {property}
                                                                </Typography>
                                                            </Stack>
                                                        ))}
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay búsquedas anónimas para esta fecha
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </>
            ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" mb={1}>
                        Selecciona una fecha para ver el análisis detallado
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Elige una de las fechas más populares arriba para ver qué clientes y usuarios anónimos están interesados
                    </Typography>
                </Paper>
            )}

            {/* Información del análisis */}
            {upcomingData && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Análisis generado:</strong> {dayjs(upcomingData.generated_at).format('DD/MM/YYYY HH:mm')} | {' '}
                        <strong>Período:</strong> {dayjs(upcomingData.data?.period_info?.analysis_from).format('DD/MM/YYYY')} 
                        - {dayjs(upcomingData.data?.period_info?.analysis_to).format('DD/MM/YYYY')}
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}