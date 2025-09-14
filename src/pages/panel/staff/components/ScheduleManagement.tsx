import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Avatar,
    Tooltip,
    Divider,
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Today as TodayIcon,
    Person as PersonIcon,
    CalendarMonth as CalendarIcon,
    TableRows as TableViewIcon,
    Schedule as ScheduleIcon,
    Home as PropertyIcon,
    Work as WorkIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllSchedulesQuery, useGetCalendarViewQuery } from '@/services/schedules/schedulesService'
import { Schedule as ScheduleInterface } from '@/interfaces/staff.interface'

export default function ScheduleManagement() {
    const [staffFilter, setStaffFilter] = useState('')
    const [propertyFilter, setPropertyFilter] = useState('')
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

    const { data: scheduleData, isLoading } = useGetAllSchedulesQuery({
        page: 1,
        page_size: 100,
        staff_member: staffFilter,
        building_property: propertyFilter,
        month: currentMonth,
        year: currentYear,
    })

    const { data: calendarData, isLoading: calendarLoading } = useGetCalendarViewQuery({
        month: currentMonth,
        year: currentYear,
        staff_member: staffFilter,
    })

    const handleEdit = (schedule: ScheduleInterface) => {
        console.log('Edit schedule:', schedule)
        // Modal de edición se implementará
    }

    const getTaskTypeText = (type: string) => {
        switch (type) {
            case 'checkout_cleaning': return 'Limpieza Salida'
            case 'maintenance': return 'Mantenimiento'
            case 'inspection': return 'Inspección'
            case 'checkin_preparation': return 'Preparación Entrada'
            default: return type
        }
    }

    const getTaskTypeColor = (type: string) => {
        switch (type) {
            case 'checkout_cleaning': return '#4caf50'
            case 'maintenance': return '#ff9800'
            case 'inspection': return '#2196f3'
            case 'checkin_preparation': return '#9c27b0'
            default: return '#757575'
        }
    }

    const getTaskTypeIcon = (type: string) => {
        switch (type) {
            case 'checkout_cleaning': return '🧹'
            case 'maintenance': return '🔧'
            case 'inspection': return '🔍'
            case 'checkin_preparation': return '✨'
            default: return '📋'
        }
    }

    // Generar días del mes para el calendario
    const getDaysInMonth = (year: number, month: number) => {
        const date = new Date(year, month - 1, 1)
        const days = []
        
        // Obtener el primer día de la semana del mes
        const firstDay = date.getDay()
        
        // Agregar días vacíos para completar la primera semana
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }
        
        // Agregar todos los días del mes
        const daysInMonth = new Date(year, month, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month - 1, day))
        }
        
        return days
    }

    const getSchedulesForDate = (date: Date | null) => {
        if (!date || !scheduleData?.results) return []
        const dateStr = date.toISOString().split('T')[0]
        return scheduleData.results.filter(schedule => 
            schedule.scheduled_date === dateStr
        )
    }

    const CalendarDay = ({ date }: { date: Date | null }) => {
        const schedules = getSchedulesForDate(date)
        const isToday = date && date.toDateString() === new Date().toDateString()
        
        if (!date) {
            return <Box sx={{ height: 120, p: 1 }} />
        }

        return (
            <Card 
                elevation={schedules.length > 0 ? 2 : 1}
                sx={{ 
                    height: 120, 
                    m: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: isToday ? 'primary.50' : schedules.length > 0 ? 'success.50' : 'background.paper',
                    border: isToday ? '2px solid' : '1px solid',
                    borderColor: isToday ? 'primary.main' : schedules.length > 0 ? 'success.light' : 'divider',
                    '&:hover': {
                        elevation: 3,
                        transform: 'translateY(-1px)',
                    }
                }}
            >
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography 
                            variant="body2" 
                            fontWeight={isToday ? 'bold' : 'medium'}
                            color={isToday ? 'primary.main' : 'text.primary'}
                        >
                            {date.getDate()}
                        </Typography>
                        {schedules.length > 0 && (
                            <Chip 
                                label={schedules.length} 
                                size="small" 
                                color="success"
                                sx={{ minWidth: 20, height: 18, fontSize: '0.7rem' }}
                            />
                        )}
                    </Box>
                    
                    <Stack spacing={0.5} sx={{ maxHeight: 80, overflowY: 'auto' }}>
                        {schedules.slice(0, 3).map((schedule, idx) => (
                            <Box 
                                key={idx} 
                                sx={{ 
                                    p: 0.5, 
                                    bgcolor: `${getTaskTypeColor(schedule.task_type)}20`,
                                    borderRadius: 0.5,
                                    border: `1px solid ${getTaskTypeColor(schedule.task_type)}40`,
                                }}
                            >
                                <Typography variant="caption" noWrap sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    color: getTaskTypeColor(schedule.task_type),
                                    fontWeight: 'medium',
                                }}>
                                    <Typography component="span" sx={{ mr: 0.5, fontSize: '0.7rem' }}>
                                        {getTaskTypeIcon(schedule.task_type)}
                                    </Typography>
                                    {schedule.start_time}
                                </Typography>
                                <Typography variant="caption" noWrap color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                    {schedule.staff_member_name}
                                </Typography>
                            </Box>
                        ))}
                        {schedules.length > 3 && (
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.6rem' }}>
                                +{schedules.length - 3} más
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        )
    }

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
            field: 'task_type',
            headerName: 'TIPO DE TAREA',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        {getTaskTypeIcon(params.value)}
                    </Typography>
                    <Chip
                        label={getTaskTypeText(params.value)}
                        size="small"
                        sx={{
                            bgcolor: `${getTaskTypeColor(params.value)}20`,
                            color: getTaskTypeColor(params.value),
                        }}
                        variant="outlined"
                    />
                </Box>
            ),
        },
        {
            field: 'scheduled_date',
            headerName: 'FECHA',
            width: 110,
            sortable: false,
            renderCell: (params) => new Date(params.value).toLocaleDateString('es-ES'),
        },
        {
            field: 'start_time',
            headerName: 'HORA INICIO',
            width: 110,
            sortable: false,
        },
        {
            field: 'end_time',
            headerName: 'HORA FIN',
            width: 110,
            sortable: false,
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
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Editar horario">
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        sx={{ color: 'primary.main' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ]

    if (isLoading && viewMode === 'list') {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando horarios...
                </Typography>
            </Box>
        )
    }

    const monthDays = getDaysInMonth(currentYear, currentMonth)
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

    // Estadísticas rápidas
    const totalSchedules = scheduleData?.count || 0
    const uniqueStaff = new Set(scheduleData?.results?.map(s => s.staff_member_name) || []).size
    const uniqueProperties = new Set(scheduleData?.results?.map(s => s.property_name) || []).size

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Gestión de Horarios
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {viewMode === 'calendar' ? 
                                new Date(currentYear, currentMonth - 1).toLocaleString('es', { month: 'long', year: 'numeric' }) :
                                `${totalSchedules} horarios programados`
                            }
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new schedule')}
                        size="large"
                    >
                        Nuevo Horario
                    </Button>
                </Box>

                {/* Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'primary.50' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PersonIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h6" color="primary.main">{uniqueStaff}</Typography>
                                <Typography variant="caption">Empleados Programados</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'success.50' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <ScheduleIcon sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                                <Typography variant="h6" color="success.main">{totalSchedules}</Typography>
                                <Typography variant="caption">Horarios Este Mes</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'warning.50' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PropertyIcon sx={{ fontSize: 30, color: 'warning.main', mb: 1 }} />
                                <Typography variant="h6" color="warning.main">{uniqueProperties}</Typography>
                                <Typography variant="caption">Propiedades Activas</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'info.50' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <WorkIcon sx={{ fontSize: 30, color: 'info.main', mb: 1 }} />
                                <Typography variant="h6" color="info.main">
                                    {Math.round((totalSchedules * 4) / 7)}h
                                </Typography>
                                <Typography variant="caption">Horas Estimadas</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filters and View Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
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
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Propiedad</InputLabel>
                            <Select
                                value={propertyFilter}
                                label="Propiedad"
                                onChange={(e) => setPropertyFilter(e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {/* Aquí se cargarían las propiedades dinámicamente */}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Mes</InputLabel>
                            <Select
                                value={currentMonth}
                                label="Mes"
                                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('es', { month: 'long' })}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Año</InputLabel>
                            <Select
                                value={currentYear}
                                label="Año"
                                onChange={(e) => setCurrentYear(Number(e.target.value))}
                            >
                                {Array.from({ length: 5 }, (_, i) => (
                                    <MenuItem key={i} value={currentYear - 2 + i}>
                                        {currentYear - 2 + i}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newView) => newView && setViewMode(newView)}
                        size="small"
                    >
                        <ToggleButton value="calendar">
                            <CalendarIcon sx={{ mr: 1 }} />
                            Calendario
                        </ToggleButton>
                        <ToggleButton value="list">
                            <TableViewIcon sx={{ mr: 1 }} />
                            Lista
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            {/* Content */}
            {viewMode === 'calendar' ? (
                <Paper elevation={1} sx={{ p: 3 }}>
                    {/* Calendar Header */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={1}>
                            {weekDays.map((day) => (
                                <Grid item xs={12/7} key={day}>
                                    <Typography 
                                        variant="subtitle2" 
                                        textAlign="center" 
                                        fontWeight="bold"
                                        color="text.secondary"
                                        sx={{ p: 1 }}
                                    >
                                        {day}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Calendar Grid */}
                    <Grid container>
                        {monthDays.map((date, index) => (
                            <Grid item xs={12/7} key={index}>
                                <CalendarDay date={date} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            ) : (
                <Paper elevation={1} sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={scheduleData?.results || []}
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

            {/* Empty State */}
            {(!scheduleData?.results || scheduleData.results.length === 0) && !isLoading && (
                <Paper
                    elevation={1}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                    }}
                >
                    <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay horarios programados
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        Programa el primer horario para comenzar la gestión de trabajo
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new schedule')}
                    >
                        Nuevo Horario
                    </Button>
                </Paper>
            )}
        </Box>
    )
}