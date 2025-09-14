import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Grid,
    Paper,
    Stack,
    Divider,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Avatar,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    Badge,
} from '@mui/material'
import {
    AccessTime as TimeIcon,
    PlayArrow as CheckInIcon,
    Stop as CheckOutIcon,
    Search as SearchIcon,
    Timeline as TimelineViewIcon,
    TableRows as TableViewIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Home as PropertyIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllTimeTrackingQuery, useCreateTimeTrackingMutation } from '@/services/time-tracking/timeTrackingService'

export default function TimeTracking() {
    const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')
    const [staffFilter, setStaffFilter] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { data, isLoading, refetch } = useGetAllTimeTrackingQuery({
        page: 1,
        page_size: 100,
        staff_member: staffFilter,
        start_date: startDate,
        end_date: endDate,
    })

    const [createTimeTracking] = useCreateTimeTrackingMutation()

    const handleQuickCheckIn = async () => {
        try {
            const formData = new FormData()
            formData.append('staff_member', 'staff-uuid-placeholder') // TODO: get from authenticated user
            formData.append('building_property', 'property-uuid-placeholder') // TODO: get from selected property
            formData.append('action_type', 'check_in')
            formData.append('latitude', '-12.0464') // TODO: get from geolocation
            formData.append('longitude', '-77.0428') // TODO: get from geolocation
            formData.append('notes', 'Check-in rápido')
            
            await createTimeTracking(formData).unwrap()
            refetch()
        } catch (error) {
            console.error('Error with check-in:', error)
        }
    }

    const handleQuickCheckOut = async () => {
        try {
            const formData = new FormData()
            formData.append('staff_member', 'staff-uuid-placeholder') // TODO: get from authenticated user
            formData.append('building_property', 'property-uuid-placeholder') // TODO: get from selected property
            formData.append('action_type', 'check_out')
            formData.append('latitude', '-12.0464') // TODO: get from geolocation
            formData.append('longitude', '-77.0428') // TODO: get from geolocation
            formData.append('notes', 'Check-out rápido')
            
            await createTimeTracking(formData).unwrap()
            refetch()
        } catch (error) {
            console.error('Error with check-out:', error)
        }
    }

    const getActionTypeText = (type: string) => {
        switch (type) {
            case 'check_in': return 'Entrada'
            case 'check_out': return 'Salida'
            case 'break_start': return 'Inicio Descanso'
            case 'break_end': return 'Fin Descanso'
            default: return type
        }
    }

    const getActionTypeColor = (type: string) => {
        switch (type) {
            case 'check_in': return '#4caf50'
            case 'check_out': return '#f44336'
            case 'break_start': return '#ff9800'
            case 'break_end': return '#2196f3'
            default: return '#757575'
        }
    }

    const getActionTypeIcon = (type: string) => {
        switch (type) {
            case 'check_in': return '🟢'
            case 'check_out': return '🔴'
            case 'break_start': return '⏸️'
            case 'break_end': return '▶️'
            default: return '⚪'
        }
    }

    // Estadísticas rápidas
    const todaysEntries = data?.results?.filter(entry => 
        new Date(entry.timestamp).toDateString() === new Date().toDateString()
    ) || []
    
    const checkIns = todaysEntries.filter(entry => entry.action_type === 'check_in').length
    const checkOuts = todaysEntries.filter(entry => entry.action_type === 'check_out').length
    const uniqueStaff = new Set(todaysEntries.map(entry => entry.staff_member_name)).size

    const TimelineEntry = ({ entry }: { entry: any }) => (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot 
                    sx={{ 
                        bgcolor: getActionTypeColor(entry.action_type),
                        border: '3px solid white',
                        boxShadow: 2,
                    }}
                >
                    {entry.action_type === 'check_in' ? <CheckInIcon sx={{ fontSize: 16, color: 'white' }} /> :
                     entry.action_type === 'check_out' ? <CheckOutIcon sx={{ fontSize: 16, color: 'white' }} /> :
                     <TimeIcon sx={{ fontSize: 16, color: 'white' }} />}
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Card elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1, fontSize: '1.1rem' }}>
                                {getActionTypeIcon(entry.action_type)}
                            </Typography>
                            <Chip
                                label={getActionTypeText(entry.action_type)}
                                size="small"
                                sx={{ 
                                    bgcolor: `${getActionTypeColor(entry.action_type)}20`,
                                    color: getActionTypeColor(entry.action_type),
                                    fontWeight: 'bold',
                                }}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            {new Date(entry.timestamp).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight="medium">
                                {entry.staff_member_name}
                            </Typography>
                        </Box>
                        
                        {entry.property_name && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PropertyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {entry.property_name}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {entry.location_verified ? 'Ubicación verificada' : 'Ubicación no verificada'}
                            </Typography>
                            <Chip
                                size="small"
                                label={entry.location_verified ? '✓' : '✗'}
                                color={entry.location_verified ? 'success' : 'warning'}
                                sx={{ ml: 1, minWidth: 28, fontSize: '0.7rem' }}
                            />
                        </Box>

                        {entry.notes && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    💬 {entry.notes}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Card>
            </TimelineContent>
        </TimelineItem>
    )

    const columns: GridColDef[] = [
        {
            field: 'staff_member_name',
            headerName: 'EMPLEADO',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                        {params.value?.[0] || 'U'}
                    </Avatar>
                    <Typography variant="body2">
                        {params.value}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'property_name',
            headerName: 'PROPIEDAD',
            width: 130,
            sortable: false,
        },
        {
            field: 'action_type',
            headerName: 'ACCIÓN',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        {getActionTypeIcon(params.value)}
                    </Typography>
                    <Chip
                        label={getActionTypeText(params.value)}
                        size="small"
                        sx={{ 
                            bgcolor: `${getActionTypeColor(params.value)}20`,
                            color: getActionTypeColor(params.value),
                        }}
                    />
                </Box>
            ),
        },
        {
            field: 'timestamp',
            headerName: 'FECHA Y HORA',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Typography variant="body2">
                    {new Date(params.value).toLocaleString('es-ES')}
                </Typography>
            ),
        },
        {
            field: 'location_verified',
            headerName: 'UBICACIÓN',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Verificada' : 'No Verificada'}
                    size="small"
                    color={params.value ? 'success' : 'warning'}
                    variant="outlined"
                />
            ),
        },
        {
            field: 'notes',
            headerName: 'NOTAS',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Typography variant="body2" noWrap>
                    {params.value || '-'}
                </Typography>
            ),
        },
    ]

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando registros de tiempo...
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Seguimiento de Tiempo
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data?.count || 0} registros de tiempo
                        </Typography>
                    </Box>
                </Box>

                {/* Quick Action Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <Card 
                            elevation={2} 
                            sx={{ 
                                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                            onClick={handleQuickCheckIn}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CheckInIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Check-In Rápido
                                </Typography>
                                <Typography variant="body2">
                                    Registrar entrada
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Card 
                            elevation={2} 
                            sx={{ 
                                background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                            onClick={handleQuickCheckOut}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CheckOutIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h6" gutterBottom>
                                    Check-Out Rápido
                                </Typography>
                                <Typography variant="body2">
                                    Registrar salida
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={1}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary.main">
                                    📊 Resumen de Hoy
                                </Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Entradas:</Typography>
                                        <Badge badgeContent={checkIns} color="success">
                                            <CheckInIcon color="success" />
                                        </Badge>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Salidas:</Typography>
                                        <Badge badgeContent={checkOuts} color="error">
                                            <CheckOutIcon color="error" />
                                        </Badge>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Personal activo:</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                                            {uniqueStaff} personas
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filters and View Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Empleado</InputLabel>
                            <Select
                                value={staffFilter}
                                label="Empleado"
                                onChange={(e) => setStaffFilter(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {/* Aquí se cargarían los empleados dinámicamente */}
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            type="date"
                            label="Fecha Inicio"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            size="small"
                            type="date"
                            label="Fecha Fin"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>

                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newView) => newView && setViewMode(newView)}
                        size="small"
                    >
                        <ToggleButton value="timeline">
                            <TimelineViewIcon sx={{ mr: 1 }} />
                            Timeline
                        </ToggleButton>
                        <ToggleButton value="table">
                            <TableViewIcon sx={{ mr: 1 }} />
                            Tabla
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            {/* Content */}
            {viewMode === 'timeline' ? (
                <Paper elevation={1} sx={{ p: 3, maxHeight: 800, overflowY: 'auto' }}>
                    {data?.results && data.results.length > 0 ? (
                        <Timeline>
                            {data.results.map((entry) => (
                                <TimelineEntry key={entry.id} entry={entry} />
                            ))}
                        </Timeline>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <ScheduleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No hay registros de tiempo
                            </Typography>
                            <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                                Los registros de check-in y check-out aparecerán aquí
                            </Typography>
                        </Box>
                    )}
                </Paper>
            ) : (
                <Paper elevation={1} sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={data?.results || []}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 25 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        density="compact"
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f0f0f0',
                                py: 1,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f8f9fa',
                                fontWeight: 600,
                                borderBottom: '2px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    />
                </Paper>
            )}
        </Box>
    )
}