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
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Today as TodayIcon,
    Person as PersonIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllSchedulesQuery, useGetCalendarViewQuery } from '@/services/schedules/schedulesService'
import { Schedule as ScheduleInterface } from '@/interfaces/staff.interface'

export default function ScheduleManagement() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [staffFilter, setStaffFilter] = useState('')
    const [propertyFilter, setPropertyFilter] = useState('')
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

    const { data: scheduleData, isLoading } = useGetAllSchedulesQuery({
        page: currentPage,
        page_size: pageSize,
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

    const columns: GridColDef[] = [
        {
            field: 'staff_member_name',
            headerName: 'EMPLEADO',
            width: 150,
            sortable: false,
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
                <Chip
                    label={getTaskTypeText(params.value)}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            ),
        },
        {
            field: 'scheduled_date',
            headerName: 'FECHA',
            width: 110,
            sortable: false,
            renderCell: (params) => new Date(params.value).toLocaleDateString(),
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
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        sx={{ color: 'primary.main' }}
                        title="Editar horario"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ]

    const renderCalendarView = () => {
        if (calendarLoading) {
            return <Typography>Cargando calendario...</Typography>
        }

        return (
            <Grid container spacing={1}>
                {calendarData?.map((dayData, index) => (
                    <Grid item xs={12/7} key={index}>
                        <Card 
                            sx={{ 
                                minHeight: 120,
                                backgroundColor: dayData.schedules.length > 0 ? '#f0f8ff' : '#ffffff',
                                border: dayData.schedules.length > 0 ? '1px solid #2196f3' : '1px solid #e0e0e0'
                            }}
                        >
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                    {new Date(dayData.date).getDate()}
                                </Typography>
                                {dayData.schedules.map((schedule, idx) => (
                                    <Box key={idx} sx={{ mt: 0.5 }}>
                                        <Chip
                                            size="small"
                                            label={`${schedule.start_time} - ${schedule.staff_member_name}`}
                                            sx={{ fontSize: '0.6rem', height: '18px' }}
                                        />
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )
    }

    if (isLoading && viewMode === 'list') {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Cargando horarios...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Gestión de Horarios {viewMode === 'list' && `(${scheduleData?.length || 0} horarios)`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant={viewMode === 'list' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => setViewMode('list')}
                    >
                        Lista
                    </Button>
                    <Button
                        variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<TodayIcon />}
                        onClick={() => setViewMode('calendar')}
                    >
                        Calendario
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new schedule')}
                    >
                        Nuevo Horario
                    </Button>
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <PersonIcon sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6">8</Typography>
                            <Typography variant="caption">Empleados Programados</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <TodayIcon sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                            <Typography variant="h6">24</Typography>
                            <Typography variant="caption">Horarios Esta Semana</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{ fontSize: 30, color: 'warning.main', mb: 1 }}>🏠</Box>
                            <Typography variant="h6">4</Typography>
                            <Typography variant="caption">Propiedades Activas</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{ fontSize: 30, color: 'info.main', mb: 1 }}>⏰</Box>
                            <Typography variant="h6">156h</Typography>
                            <Typography variant="caption">Horas Programadas</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
            </Box>

            {/* Content */}
            {viewMode === 'calendar' ? (
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
                        {new Date(currentYear, currentMonth - 1).toLocaleString('es', { month: 'long', year: 'numeric' })}
                    </Typography>
                    {renderCalendarView()}
                </Box>
            ) : (
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={scheduleData || []}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: pageSize },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f0f0f0',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f8f9fa',
                                fontWeight: 600,
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    )
}