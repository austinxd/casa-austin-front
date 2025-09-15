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
    useMediaQuery,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material'
import { 
    CleaningServices as CleaningIcon,
    Schedule as DurationIcon,
    FilterList as FilterIcon 
} from '@mui/icons-material'
import { useState } from 'react'
import { useGetAllTasksQuery } from '@/services/tasks/tasksService'

export default function TimeTracking() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [dateFilter, setDateFilter] = useState('')
    const [staffFilter, setStaffFilter] = useState('')
    const [propertyFilter, setPropertyFilter] = useState('')
    
    // Obtener tareas de limpieza completadas con tiempos y filtros
    const queryParams: any = {
        task_type: 'checkout_cleaning',
        status: 'completed',
        page: 1,
        page_size: 50
    }
    
    if (dateFilter) queryParams.date = dateFilter
    if (staffFilter) queryParams.staff_member = staffFilter
    if (propertyFilter) queryParams.property = propertyFilter
    
    const { data: cleaningTasks, isLoading: loadingCleaning, error } = useGetAllTasksQuery(queryParams)
    
    // Obtener lista única de empleados para el filtro
    const uniqueStaff = cleaningTasks?.results?.reduce((acc: any[], task) => {
        if (!acc.find(s => s.id === task.staff_member)) {
            acc.push({ id: task.staff_member, name: task.staff_member_name })
        }
        return acc
    }, []) || []
    
    // Obtener lista única de propiedades para el filtro
    const uniqueProperties = cleaningTasks?.results?.reduce((acc: any[], task) => {
        if (!acc.find(p => p.name === task.property_name)) {
            acc.push({ name: task.property_name })
        }
        return acc
    }, []) || []

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
                    Tiempos de Limpieza
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Análisis de duración y eficiencia en tareas de limpieza
                </Typography>
            </Paper>

            {/* Filtros */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Filtros</Typography>
                </Box>
                
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Fecha"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Empleado</InputLabel>
                            <Select
                                value={staffFilter}
                                label="Empleado"
                                onChange={(e) => setStaffFilter(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {uniqueStaff.map((staff) => (
                                    <MenuItem key={staff.id} value={staff.id}>
                                        {staff.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Propiedad</InputLabel>
                            <Select
                                value={propertyFilter}
                                label="Propiedad"
                                onChange={(e) => setPropertyFilter(e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {uniqueProperties.map((property) => (
                                    <MenuItem key={property.name} value={property.name}>
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                
                {(dateFilter || staffFilter || propertyFilter) && (
                    <Box sx={{ mt: 2 }}>
                        <Button
                            size="small"
                            onClick={() => {
                                setDateFilter('')
                                setStaffFilter('')
                                setPropertyFilter('')
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </Box>
                )}
            </Paper>
            
            {/* Tabla de Tiempos de Limpieza */}
            <Card elevation={2}>
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
                                        {!isMobile && <TableCell>Evidencia</TableCell>}
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
                                                        {task.property_name}
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
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {task.photos && task.photos.length > 0 ? (
                                                                <Chip
                                                                    label={`${task.photos.length} foto${task.photos.length !== 1 ? 's' : ''}`}
                                                                    color="primary"
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{ fontSize: '0.75rem' }}
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Sin evidencia
                                                                </Typography>
                                                            )}
                                                        </Box>
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