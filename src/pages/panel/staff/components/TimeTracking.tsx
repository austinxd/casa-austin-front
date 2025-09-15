import { 
    Box, 
    Typography, 
    Paper, 
    Card, 
    CardContent, 
    Grid, 
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '@mui/material'
import { 
    AccessTime as TimeIcon,
    Work as WorkIcon,
    FreeBreakfast as BreakIcon,
    ExitToApp as ExitIcon,
    CleaningServices as CleaningIcon,
    Schedule as DurationIcon 
} from '@mui/icons-material'
import { useState } from 'react'
import { useGetAllTimeTrackingQuery, useCreateTimeTrackingMutation } from '@/services/time-tracking/timeTrackingService'
import { useGetAllTasksQuery } from '@/services/tasks/tasksService'

export default function TimeTracking() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [page, setPage] = useState(1)
    
    // Obtener datos de time tracking
    const { data, isLoading, error, refetch } = useGetAllTimeTrackingQuery({
        page,
        page_size: 20
    })
    
    // Obtener tareas de limpieza completadas con tiempos
    const { data: cleaningTasks, isLoading: loadingCleaning, refetch: refetchCleaning } = useGetAllTasksQuery({
        task_type: 'checkout_cleaning',
        status: 'completed',
        page: 1,
        page_size: 50
    })
    
    // Mutación para crear registro de tiempo
    const [createTimeTracking, { isLoading: isCreating }] = useCreateTimeTrackingMutation()

    const handleTimeAction = async (actionType: 'check_in' | 'check_out' | 'break_start' | 'break_end') => {
        try {
            const formData = new FormData()
            formData.append('action_type', actionType)
            formData.append('timestamp', new Date().toISOString())
            
            await createTimeTracking(formData).unwrap()
            refetch()
            refetchCleaning() // Refrescar también las tareas de limpieza
        } catch (error) {
            console.error('Error al registrar tiempo:', error)
        }
    }

    const getActionIcon = (actionType: string) => {
        switch (actionType) {
            case 'check_in': return <WorkIcon sx={{ fontSize: 16, mr: 0.5 }} />
            case 'check_out': return <ExitIcon sx={{ fontSize: 16, mr: 0.5 }} />
            case 'break_start': return <BreakIcon sx={{ fontSize: 16, mr: 0.5 }} />
            case 'break_end': return <WorkIcon sx={{ fontSize: 16, mr: 0.5 }} />
            default: return <TimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
        }
    }

    const getActionColor = (actionType: string) => {
        switch (actionType) {
            case 'check_in': return 'success'
            case 'check_out': return 'error'
            case 'break_start': return 'warning'
            case 'break_end': return 'info'
            default: return 'default'
        }
    }

    const getActionText = (actionType: string) => {
        switch (actionType) {
            case 'check_in': return 'Check-In'
            case 'check_out': return 'Check-Out'
            case 'break_start': return 'Inicio Descanso'
            case 'break_end': return 'Fin Descanso'
            default: return actionType
        }
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Error al cargar los datos de tiempo. Por favor, intenta nuevamente.
                </Alert>
            </Box>
        )
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Seguimiento de Tiempo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sistema de registro de entradas, salidas y descansos
                </Typography>
            </Paper>

            {/* Botones de acción */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={() => handleTimeAction('check_in')}
                        disabled={isCreating}
                        sx={{
                            py: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}
                        startIcon={<WorkIcon />}
                    >
                        Check-In
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={() => handleTimeAction('check_out')}
                        disabled={isCreating}
                        sx={{
                            py: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}
                        startIcon={<ExitIcon />}
                    >
                        Check-Out
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        onClick={() => handleTimeAction('break_start')}
                        disabled={isCreating}
                        sx={{
                            py: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}
                        startIcon={<BreakIcon />}
                    >
                        Descanso
                    </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="info"
                        onClick={() => handleTimeAction('break_end')}
                        disabled={isCreating}
                        sx={{
                            py: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}
                        startIcon={<WorkIcon />}
                    >
                        Fin Descanso
                    </Button>
                </Grid>
            </Grid>

            {/* Tabla de registros */}
            <Card elevation={2}>
                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                    <Typography variant="h6" gutterBottom>
                        Historial de Registros
                    </Typography>
                    
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table size={isMobile ? "small" : "medium"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha y Hora</TableCell>
                                        <TableCell>Acción</TableCell>
                                        <TableCell>Empleado</TableCell>
                                        <TableCell>Propiedad</TableCell>
                                        {!isMobile && <TableCell>Notas</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.results?.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {new Date(record.timestamp).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(record.timestamp).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getActionIcon(record.action_type)}
                                                    label={getActionText(record.action_type)}
                                                    color={getActionColor(record.action_type) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {record.staff_member_name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {record.property_name}
                                                </Typography>
                                            </TableCell>
                                            {!isMobile && (
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {record.notes || '-'}
                                                    </Typography>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )) || (
                                        <TableRow>
                                            <TableCell colSpan={isMobile ? 4 : 5} align="center">
                                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                                    No hay registros de tiempo disponibles
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    
                    {/* Paginación */}
                    {data && data.total_paginas > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                sx={{ mr: 1 }}
                            >
                                Anterior
                            </Button>
                            <Typography sx={{ mx: 2, alignSelf: 'center' }}>
                                Página {page} de {data.total_paginas}
                            </Typography>
                            <Button
                                disabled={page === data.total_paginas}
                                onClick={() => setPage(page + 1)}
                            >
                                Siguiente
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
            
            {/* Sección de Tiempos de Limpieza */}
            <Card elevation={2} sx={{ mt: 3 }}>
                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CleaningIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">
                            Tiempos de Limpieza Completadas
                        </Typography>
                    </Box>
                    
                    {loadingCleaning ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table size={isMobile ? "small" : "medium"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Empleado</TableCell>
                                        <TableCell>Propiedad</TableCell>
                                        <TableCell>Duración</TableCell>
                                        {!isMobile && <TableCell>Tiempo Estimado</TableCell>}
                                        {!isMobile && <TableCell>Tiempo Inicio</TableCell>}
                                        {!isMobile && <TableCell>Tiempo Fin</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cleaningTasks?.results?.map((task) => {
                                        const startTime = task.actual_start_time ? new Date(task.actual_start_time) : null
                                        const endTime = task.actual_end_time ? new Date(task.actual_end_time) : null
                                        
                                        return (
                                            <TableRow key={task.id}>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(task.scheduled_date).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {task.staff_member_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {task.building_property}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <DurationIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                                                        <Chip
                                                            label={task.actual_duration_display || 'No calculado'}
                                                            color="success"
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </TableCell>
                                                {!isMobile && (
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {task.estimated_duration || '-'}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                {!isMobile && (
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {startTime ? startTime.toLocaleTimeString('es-ES', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                {!isMobile && (
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {endTime ? endTime.toLocaleTimeString('es-ES', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )
                                    }) || (
                                        <TableRow>
                                            <TableCell colSpan={isMobile ? 4 : 7} align="center">
                                                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                                    No hay limpiezas completadas disponibles
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}