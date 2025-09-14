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
    Stack,
    IconButton,
    Divider,
} from '@mui/material'
import {
    Add as AddIcon,
    PlayArrow as StartIcon,
    Stop as CompleteIcon,
    Edit as EditIcon,
    Assignment as TaskIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Home as PropertyIcon,
} from '@mui/icons-material'
import { useGetAllTasksQuery, useStartWorkMutation, useCompleteWorkMutation } from '@/services/tasks/tasksService'

export default function TaskManagement() {
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
            default: priority
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
                    {JSON.stringify(error)}
                </Typography>
            </Box>
        )
    }

    // Agrupar tareas por estado
    const tasksByStatus = {
        pending: data?.results?.filter(task => task.status === 'pending') || [],
        assigned: data?.results?.filter(task => task.status === 'assigned') || [],
        in_progress: data?.results?.filter(task => task.status === 'in_progress') || [],
        completed: data?.results?.filter(task => task.status === 'completed') || [],
    }

    const TaskCard = ({ task }: { task: any }) => (
        <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1, fontSize: '1.2rem' }}>
                            {getTaskTypeIcon(task.task_type)}
                        </Typography>
                        <Chip
                            label={task.priority ? getPriorityText(task.priority) : 'Media'}
                            size="small"
                            color={getPriorityColor(task.priority || 'medium')}
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                        />
                    </Box>
                    <Chip
                        label={getStatusText(task.status)}
                        size="small"
                        sx={{ 
                            bgcolor: `${getStatusColor(task.status)}20`,
                            color: getStatusColor(task.status),
                            borderColor: getStatusColor(task.status),
                        }}
                        variant="outlined"
                    />
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {task.title || `Tarea ${task.task_type ? getTaskTypeText(task.task_type) : 'Sin título'}`}
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
                            {task.scheduled_date ? new Date(task.scheduled_date).toLocaleDateString('es-ES') : 'Sin fecha'}
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

                {/* Summary Cards */}
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'warning.50' }}>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h6" color="warning.main">{tasksByStatus.pending.length}</Typography>
                                <Typography variant="caption">Pendientes</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'info.50' }}>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h6" color="info.main">{tasksByStatus.assigned.length}</Typography>
                                <Typography variant="caption">Asignadas</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'secondary.50' }}>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h6" color="secondary.main">{tasksByStatus.in_progress.length}</Typography>
                                <Typography variant="caption">En Progreso</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card elevation={1} sx={{ bgcolor: 'success.50' }}>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h6" color="success.main">{tasksByStatus.completed.length}</Typography>
                                <Typography variant="caption">Completadas</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tasks List */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', minHeight: 400 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            🟡 Pendientes ({tasksByStatus.pending.length})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {tasksByStatus.pending.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {tasksByStatus.pending.length === 0 && (
                            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 4 }}>
                                No hay tareas pendientes
                            </Typography>
                        )}
                    </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', minHeight: 400 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            🔵 Asignadas ({tasksByStatus.assigned.length})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {tasksByStatus.assigned.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {tasksByStatus.assigned.length === 0 && (
                            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 4 }}>
                                No hay tareas asignadas
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', minHeight: 400 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            🟣 En Progreso ({tasksByStatus.in_progress.length})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {tasksByStatus.in_progress.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {tasksByStatus.in_progress.length === 0 && (
                            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 4 }}>
                                No hay tareas en progreso
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', minHeight: 400 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            🟢 Completadas ({tasksByStatus.completed.length})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {tasksByStatus.completed.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {tasksByStatus.completed.length === 0 && (
                            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 4 }}>
                                No hay tareas completadas
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Empty State */}
            {(!data?.results || data.results.length === 0) && !isLoading && (
                <Paper
                    elevation={1}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                        mt: 3,
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