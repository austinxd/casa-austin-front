import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Card,
    CardContent,
} from '@mui/material'
import {
    Add as AddIcon,
    Assignment as TaskIcon,
} from '@mui/icons-material'
import { useGetAllTasksQuery, useStartWorkMutation, useCompleteWorkMutation } from '@/services/tasks/tasksService'
import TaskEditModal from './TaskEditModal'
import TaskAddModal from './TaskAddModal'
import TaskCard from './TaskCard'
import { WorkTask } from '@/interfaces/staff.interface'

export default function TaskManagement() {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)

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
        <Box sx={{ width: '100%' }}>
            {/* Header Compacto */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mb: 2,
                '@media (max-width: 600px)': {
                    justifyContent: 'stretch',
                },
            }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddModalOpen(true)}
                    size="small"
                    sx={{ 
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 2,
                        py: 0.5,
                        '@media (max-width: 600px)': {
                            width: '100%',
                        },
                    }}
                >
                    Crear Tarea
                </Button>
            </Box>

            {/* Estadísticas */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ bgcolor: '#ff9800', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    {tasksByStatus.pending.length}
                                </Typography>
                                <Typography variant="caption" color="white">
                                    Pendientes
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ bgcolor: '#2196f3', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    {tasksByStatus.assigned.length}
                                </Typography>
                                <Typography variant="caption" color="white">
                                    Asignadas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ bgcolor: '#e91e63', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    {tasksByStatus.in_progress.length}
                                </Typography>
                                <Typography variant="caption" color="white">
                                    En Progreso
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Card elevation={0} sx={{ bgcolor: '#4caf50', borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    {tasksByStatus.completed.length}
                                </Typography>
                                <Typography variant="caption" color="white">
                                    Completadas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Grid de Cards de Tareas */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {data?.results?.map((task) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                        <TaskCard
                            task={task}
                            onStartWork={handleStartWork}
                            onCompleteWork={handleCompleteWork}
                            onEdit={(task) => {
                                setSelectedTask(task)
                                setEditModalOpen(true)
                            }}
                        />
                    </Grid>
                ))}
            </Grid>

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
                        size="medium"
                        sx={{ 
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
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
        </Box>
    )
}