import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Chip,
    Card,
    CardContent,
    Grid,
    Paper,
    IconButton,
    Tooltip,
    Avatar,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import {
    Add as AddIcon,
    PlayArrow as StartIcon,
    Stop as CompleteIcon,
    Edit as EditIcon,
    Assignment as TaskIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllTasksQuery, useStartWorkMutation, useCompleteWorkMutation } from '@/services/tasks/tasksService'
import TaskEditModal from './TaskEditModal'
import TaskAddModal from './TaskAddModal'
import PanelContent from '@/components/layout/PanelContent'
import { WorkTask } from '@/interfaces/staff.interface'

export default function TaskManagement() {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const { data, isLoading, error, refetch } = useGetAllTasksQuery({
        page: 1,
        page_size: 100,
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
            case 'in_progress': return 'secondary'
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

    const columns: GridColDef[] = [
        {
            field: 'title',
            headerName: 'TAREA',
            flex: 2,
            minWidth: 180,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1, fontSize: '1.2rem' }}>
                        {getTaskTypeIcon(params.row.task_type)}
                    </Typography>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                            {params.value || `Tarea ${getTaskTypeText(params.row.task_type)}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {getTaskTypeText(params.row.task_type)}
                        </Typography>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'staff_member_name',
            headerName: 'ASIGNADO A',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                        {params.value?.[0] || 'U'}
                    </Avatar>
                    <Typography variant="body2">
                        {params.value || 'Sin asignar'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'property_name',
            headerName: 'PROPIEDAD',
            width: 140,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.row.property_background_color && (
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: params.row.property_background_color,
                                mr: 1,
                                border: '1px solid #ccc',
                                flexShrink: 0,
                            }}
                        />
                    )}
                    <Typography variant="body2" noWrap>
                        {params.value || 'Sin propiedad'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'ESTADO',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={getStatusText(params.value)}
                    size="small"
                    color={getStatusColor(params.value)}
                    sx={{ fontWeight: 'medium', minWidth: 100 }}
                />
            ),
        },
        {
            field: 'scheduled_date',
            headerName: 'FECHA',
            width: 110,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value ? new Date(params.value).toLocaleDateString('es-ES') : 'Sin fecha'}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 160,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {params.row.status === 'assigned' && (
                        <Tooltip title="Iniciar trabajo">
                            <IconButton
                                size="medium"
                                onClick={() => handleStartWork(params.row.id)}
                                sx={{ 
                                    color: 'success.main',
                                    bgcolor: 'success.50',
                                    '&:hover': { 
                                        bgcolor: 'success.100',
                                        transform: 'scale(1.1)'
                                    },
                                    border: '1px solid',
                                    borderColor: 'success.200',
                                }}
                            >
                                <StartIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.status === 'in_progress' && (
                        <Tooltip title="Completar trabajo">
                            <IconButton
                                size="medium"
                                onClick={() => handleCompleteWork(params.row.id)}
                                sx={{ 
                                    color: 'primary.main',
                                    bgcolor: 'primary.50',
                                    '&:hover': { 
                                        bgcolor: 'primary.100',
                                        transform: 'scale(1.1)'
                                    },
                                    border: '1px solid',
                                    borderColor: 'primary.200',
                                }}
                            >
                                <CompleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Editar tarea">
                        <IconButton
                            size="medium"
                            onClick={() => {
                                setSelectedTask(params.row)
                                setEditModalOpen(true)
                            }}
                            sx={{ 
                                color: 'warning.main',
                                bgcolor: 'warning.50',
                                '&:hover': { 
                                    bgcolor: 'warning.100',
                                    transform: 'scale(1.1)'
                                },
                                border: '1px solid',
                                borderColor: 'warning.200',
                            }}
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

    if (error) {
        console.error('TaskManagement API Error:', error)
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Error al cargar tareas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Por favor, inicia sesión para ver los datos
                </Typography>
            </Box>
        )
    }

    // Estadísticas
    const tasksByStatus = {
        pending: data?.results?.filter(task => task.status === 'pending') || [],
        assigned: data?.results?.filter(task => task.status === 'assigned') || [],
        in_progress: data?.results?.filter(task => task.status === 'in_progress') || [],
        completed: data?.results?.filter(task => task.status === 'completed') || [],
    }

    return (
        <PanelContent>
            {/* Header Responsive */}
            <Stack 
                direction="row" 
                justifyContent="flex-end"
                sx={{ mb: 2 }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddModalOpen(true)}
                    fullWidth={isMobile}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        maxWidth: { xs: '100%', sm: 'auto' }
                    }}
                >
                    Crear Tarea
                </Button>
            </Stack>

            {/* Estadísticas Responsive */}
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: 'warning.50', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                                <Typography variant="h5" fontWeight="bold" color="warning.main">
                                    {tasksByStatus.pending.length}
                                </Typography>
                                <Typography variant="body2" color="warning.dark">
                                    Pendientes
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: '#1976d2', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                                <Typography variant="h5" fontWeight="bold" color="white">
                                    {tasksByStatus.assigned.length}
                                </Typography>
                                <Typography variant="body2" color="white">
                                    Asignadas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: '#9c27b0', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                                <Typography variant="h5" fontWeight="bold" color="white">
                                    {tasksByStatus.in_progress.length}
                                </Typography>
                                <Typography variant="body2" color="white">
                                    En Progreso
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card elevation={0} sx={{ bgcolor: 'success.50', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
                                <Typography variant="h5" fontWeight="bold" color="success.main">
                                    {tasksByStatus.completed.length}
                                </Typography>
                                <Typography variant="body2" color="success.dark">
                                    Completadas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de Tareas Responsive */}
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <DataGrid
                    rows={data?.results || []}
                    columns={columns}
                    density="compact"
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f0f0f0',
                            py: { xs: 1, sm: 2 },
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f8f9fa',
                            fontWeight: 700,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            borderBottom: '2px solid #e0e0e0',
                            color: '#374151',
                            minHeight: { xs: '40px !important', sm: '56px !important' },
                        },
                        '& .MuiDataGrid-row': {
                            minHeight: { xs: '60px !important', sm: '72px !important' },
                            '&:hover': {
                                backgroundColor: '#f9fafb',
                            },
                            '&:nth-of-type(even)': {
                                backgroundColor: '#fafbfc',
                            },
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '2px solid #e0e0e0',
                            backgroundColor: '#f8f9fa',
                            minHeight: { xs: '40px', sm: '52px' },
                        },
                    }}
                />
            </Paper>

            {/* Empty State */}
            {(!data?.results || data.results.length === 0) && !isLoading && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        border: '2px dashed #e0e0e0',
                        mt: 3,
                    }}
                >
                    <TaskIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">
                        No hay tareas registradas
                    </Typography>
                    <Typography variant="body1" color="text.disabled" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        Crea la primera tarea para comenzar la gestión de trabajo
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddModalOpen(true)}
                        size="large"
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Crear Primera Tarea
                    </Button>
                </Paper>
            )}

            {/* Modal de Edición */}
            <TaskEditModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedTask(null)
                }}
                task={selectedTask}
                onTaskUpdated={refetch}
            />

            {/* Modal de Agregar Tarea */}
            <TaskAddModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onTaskAdded={refetch}
            />
        </PanelContent>
    )
}