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
} from '@mui/material'
import {
    PlayArrow as StartIcon,
    Stop as CompleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllTasksQuery, useStartWorkMutation, useCompleteWorkMutation } from '@/services/tasks/tasksService'
import { WorkTask } from '@/interfaces/staff.interface'

export default function TaskManagement() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [taskTypeFilter, setTaskTypeFilter] = useState('')

    const { data, isLoading, refetch } = useGetAllTasksQuery({
        page: currentPage,
        page_size: pageSize,
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
            case 'pending': return 'warning'
            case 'assigned': return 'info'
            case 'in_progress': return 'primary'
            case 'completed': return 'success'
            case 'cancelled': return 'error'
            default: return 'default'
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

    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'TÍTULO',
            flex: 1,
            sortable: false,
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
                    color={getStatusColor(params.value)}
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
                        <IconButton
                            size="small"
                            onClick={() => handleStartWork(params.row.id)}
                            sx={{ color: 'success.main' }}
                            title="Iniciar trabajo"
                        >
                            <StartIcon fontSize="small" />
                        </IconButton>
                    )}
                    {params.row.status === 'in_progress' && (
                        <IconButton
                            size="small"
                            onClick={() => handleCompleteWork(params.row.id)}
                            sx={{ color: 'primary.main' }}
                            title="Completar trabajo"
                        >
                            <CompleteIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton
                        size="small"
                        onClick={() => console.log('Edit task:', params.row)}
                        sx={{ color: 'info.main' }}
                        title="Editar"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ]

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Cargando tareas...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Tareas ({data?.length || 0} tareas)
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => console.log('Add new task')}
                >
                    Crear Tarea
                </Button>
            </Box>

            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    size="small"
                    placeholder="Buscar tareas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 200 }}
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
            </Box>
            
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data || []}
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
        </Box>
    )
}