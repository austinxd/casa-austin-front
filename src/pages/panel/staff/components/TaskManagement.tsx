import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Chip,
    IconButton,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Card,
    CardContent,
    Grid,
    Paper,
    Stack,
    Avatar,
    Divider,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Badge,
} from '@mui/material'
import {
    PlayArrow as StartIcon,
    Stop as CompleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Search as SearchIcon,
    ViewKanban as KanbanIcon,
    TableRows as TableViewIcon,
    Assignment as TaskIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Home as PropertyIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllTasksQuery, useStartWorkMutation, useCompleteWorkMutation } from '@/services/tasks/tasksService'

export default function TaskManagement() {
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [taskTypeFilter, setTaskTypeFilter] = useState('')

    const { data, isLoading, refetch } = useGetAllTasksQuery({
        page: 1,
        page_size: 100,
        search: search,
        status: statusFilter,
        task_type: taskTypeFilter,
    })

    const [startWork] = useStartWorkMutation()
    const [completeWork] = useCompleteWorkMutation()

    const handleStartWork = async (taskId: string) => {
        try {
            await startWork({ 
                id: taskId, 
                data: { 
                    status: 'in_progress',
                    actual_start_time: new Date().toISOString()
                } 
            }).unwrap()
            refetch()
        } catch (error) {
            console.error('Error starting work:', error)
        }
    }

    const handleCompleteWork = async (taskId: string) => {
        try {
            await completeWork({ 
                id: taskId, 
                data: {
                    status: 'completed',
                    actual_end_time: new Date().toISOString(),
                    completion_notes: 'Trabajo completado'
                }
            }).unwrap()
            refetch()
        } catch (error) {
            console.error('Error completing work:', error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#ff9800'
            case 'assigned': return '#2196f3'
            case 'in_progress': return '#9c27b0'
            case 'completed': return '#4caf50'
            case 'cancelled': return '#f44336'
            default: return '#757575'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente'
            case 'assigned': return 'Asignada'
            case 'in_progress': return 'En Progreso'
            case 'completed': return 'Completada'
            case 'cancelled': return 'Cancelada'
            default: return status
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'success'
            case 'medium': return 'warning'
            case 'high': return 'error'
            case 'urgent': return 'error'
            default: return 'default'
        }
    }

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'low': return 'Baja'
            case 'medium': return 'Media'
            case 'high': return 'Alta'
            case 'urgent': return 'Urgente'
            default: return priority
        }
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

    const getTaskTypeIcon = (type: string) => {
        switch (type) {
            case 'checkout_cleaning': return '🧹'
            case 'maintenance': return '🔧'
            case 'inspection': return '🔍'
            case 'checkin_preparation': return '✨'
            default: return '📋'
        }
    }

    const TaskCard = ({ task }: { task: any }) => (
        <Card 
            elevation={2}
            sx={{ 
                mb: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-1px)',
                },
                borderLeft: `4px solid ${getStatusColor(task.status)}`,
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1, fontSize: '1.2rem' }}>
                            {getTaskTypeIcon(task.task_type)}
                        </Typography>
                        <Chip
                            label={getPriorityText(task.priority)}
                            size="small"
                            color={getPriorityColor(task.priority)}
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                    </Box>
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom noWrap>
                    {task.title}
                </Typography>

                <Stack spacing={1} sx={{ mb: 2 }}>
                    {task.staff_member_name && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {task.staff_member_name}
                            </Typography>
                        </Box>
                    )}
                    {task.property_name && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PropertyIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                {task.property_name}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {new Date(task.scheduled_date).toLocaleDateString('es-ES')}
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {task.status === 'assigned' && (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<StartIcon />}
                            onClick={() => handleStartWork(task.id)}
                            color="success"
                            sx={{ flex: 1, fontSize: '0.75rem' }}
                        >
                            Iniciar
                        </Button>
                    )}
                    {task.status === 'in_progress' && (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CompleteIcon />}
                            onClick={() => handleCompleteWork(task.id)}
                            color="primary"
                            sx={{ flex: 1, fontSize: '0.75rem' }}
                        >
                            Completar
                        </Button>
                    )}
                    <IconButton
                        size="small"
                        onClick={() => console.log('Edit task:', task)}
                        sx={{ color: 'text.secondary' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )

    const KanbanColumn = ({ status, title, tasks, color }: { status: string, title: string, tasks: any[], color: string }) => (
        <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', minHeight: 600 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: color,
                        mr: 1.5,
                    }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                    {title}
                </Typography>
                <Badge badgeContent={tasks.length} color="primary" sx={{ ml: 'auto' }} />
            </Box>
            <Box sx={{ maxHeight: 520, overflowY: 'auto' }}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
                        <TaskIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                        <Typography variant="body2" color="text.disabled">
                            No hay tareas en {title.toLowerCase()}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    )

    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'TÍTULO',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        {getTaskTypeIcon(params.row.task_type)}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                        {params.value}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'staff_member_name',
            headerName: 'ASIGNADO A',
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
            headerName: 'TIPO',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={getTaskTypeText(params.value)}
                    size="small"
                    color="default"
                    variant="outlined"
                />
            ),
        },
        {
            field: 'priority',
            headerName: 'PRIORIDAD',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={getPriorityText(params.value)}
                    size="small"
                    color={getPriorityColor(params.value)}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'ESTADO',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={getStatusText(params.value)}
                    size="small"
                    sx={{ 
                        bgcolor: `${getStatusColor(params.value)}20`,
                        color: getStatusColor(params.value),
                        borderColor: getStatusColor(params.value),
                    }}
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
            field: 'actions',
            headerName: 'ACCIONES',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {params.row.status === 'assigned' && (
                        <Tooltip title="Iniciar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => handleStartWork(params.row.id)}
                                sx={{ color: 'success.main' }}
                            >
                                <StartIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.status === 'in_progress' && (
                        <Tooltip title="Completar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => handleCompleteWork(params.row.id)}
                                sx={{ color: 'primary.main' }}
                            >
                                <CompleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            onClick={() => console.log('Edit task:', params.row)}
                            sx={{ color: 'info.main' }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ]

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando tareas...
                </Typography>
            </Box>
        )
    }

    // Agrupar tareas por estado para Kanban
    const tasksByStatus = {
        pending: data?.results?.filter(task => task.status === 'pending') || [],
        assigned: data?.results?.filter(task => task.status === 'assigned') || [],
        in_progress: data?.results?.filter(task => task.status === 'in_progress') || [],
        completed: data?.results?.filter(task => task.status === 'completed') || [],
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Gestión de Tareas
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data?.count || 0} tareas en total
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new task')}
                        size="large"
                    >
                        Crear Tarea
                    </Button>
                </Box>

                {/* Filters and View Toggle */}
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        size="small"
                        placeholder="Buscar tareas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 250 }}
                    />
                    
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Estado"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="pending">Pendiente</MenuItem>
                            <MenuItem value="assigned">Asignada</MenuItem>
                            <MenuItem value="in_progress">En Progreso</MenuItem>
                            <MenuItem value="completed">Completada</MenuItem>
                            <MenuItem value="cancelled">Cancelada</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Tipo de Tarea</InputLabel>
                        <Select
                            value={taskTypeFilter}
                            label="Tipo de Tarea"
                            onChange={(e) => setTaskTypeFilter(e.target.value)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="checkout_cleaning">Limpieza Salida</MenuItem>
                            <MenuItem value="maintenance">Mantenimiento</MenuItem>
                            <MenuItem value="inspection">Inspección</MenuItem>
                            <MenuItem value="checkin_preparation">Preparación Entrada</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ ml: 'auto' }}>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, newView) => newView && setViewMode(newView)}
                            size="small"
                        >
                            <ToggleButton value="kanban">
                                <KanbanIcon sx={{ mr: 1 }} />
                                Kanban
                            </ToggleButton>
                            <ToggleButton value="table">
                                <TableViewIcon sx={{ mr: 1 }} />
                                Tabla
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Stack>
            </Paper>

            {/* Content */}
            {viewMode === 'kanban' ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <KanbanColumn 
                            status="pending" 
                            title="Pendientes" 
                            tasks={tasksByStatus.pending}
                            color="#ff9800"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <KanbanColumn 
                            status="assigned" 
                            title="Asignadas" 
                            tasks={tasksByStatus.assigned}
                            color="#2196f3"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <KanbanColumn 
                            status="in_progress" 
                            title="En Progreso" 
                            tasks={tasksByStatus.in_progress}
                            color="#9c27b0"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <KanbanColumn 
                            status="completed" 
                            title="Completadas" 
                            tasks={tasksByStatus.completed}
                            color="#4caf50"
                        />
                    </Grid>
                </Grid>
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

            {/* Empty State */}
            {(!data?.results || data.results.length === 0) && !isLoading && (
                <Paper
                    elevation={1}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                    }}
                >
                    <TaskIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay tareas registradas
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        Crea la primera tarea para comenzar la gestión de trabajo
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new task')}
                    >
                        Crear Tarea
                    </Button>
                </Paper>
            )}
        </Box>
    )
}