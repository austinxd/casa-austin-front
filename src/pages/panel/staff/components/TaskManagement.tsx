import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Chip,
    Stack,
    TextField,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Collapse,
    IconButton,
} from '@mui/material'
import {
    Add as AddIcon,
    Assignment as TaskIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material'
import ButtonPrimary from '@/components/common/button/ButtonPrimary'
import { useGetAllTasksQuery, useStartWorkMutation, useCompleteWorkMutation } from '@/services/tasks/tasksService'
import TaskEditModal from './TaskEditModal'
import TaskAddModal from './TaskAddModal'
import TaskCard from './TaskCard'
import { WorkTask } from '@/interfaces/staff.interface'

export default function TaskManagement() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]
    
    const { data, isLoading, error, refetch } = useGetAllTasksQuery({
        page: 1,
        page_size: 100,
        date_from: today, // Filtrar tareas desde hoy en adelante
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
            console.log('Work started successfully for task:', taskId)
        } catch (error) {
            console.error('Error starting work:', error)
        } finally {
            // Siempre refrescar la vista, incluso si hay error
            refetch()
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
            console.log('Work completed successfully for task:', taskId)
        } catch (error) {
            console.error('Error completing work:', error)
        } finally {
            // Siempre refrescar la vista, incluso si hay error
            refetch()
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

    // Tareas filtradas
    const filteredTasks = statusFilter 
        ? data?.results?.filter(task => task.status === statusFilter) || []
        : data?.results || []

    // Estado de filtros
    const statusFilterOptions = [
        { value: 'pending', label: 'Pendientes', color: 'warning' as const },
        { value: 'assigned', label: 'Asignadas', color: 'info' as const },
        { value: 'in_progress', label: 'En Progreso', color: 'secondary' as const },
        { value: 'completed', label: 'Completadas', color: 'success' as const },
    ]

    return (
        <Box sx={{ width: '100%' }}>


            {/* Filtros y Acciones Optimizados */}
            <Paper elevation={0} sx={{ 
                p: isMobile ? 1 : { sm: 2 }, 
                mb: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
            }}>
                {isMobile ? (
                    /* Mobile: Línea principal con botón de filtros desplegable */
                    <Box>
                        {/* Línea principal */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: showFilters ? 1.5 : 0
                        }}>
                            {/* Campo de búsqueda */}
                            <TextField
                                size="small"
                                placeholder="Buscar tareas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                variant="outlined"
                                sx={{ 
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        height: 36,
                                        bgcolor: 'white',
                                        fontSize: '0.875rem'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            {/* Botón de filtros con indicador de activo */}
                            <IconButton
                                onClick={() => setShowFilters(!showFilters)}
                                size="small"
                                sx={{
                                    bgcolor: showFilters ? 'primary.light' : 'action.hover',
                                    color: showFilters ? 'primary.main' : 'text.secondary',
                                    width: 36,
                                    height: 36,
                                    '&:hover': {
                                        bgcolor: showFilters ? 'primary.light' : 'action.selected'
                                    }
                                }}
                            >
                                <FilterIcon sx={{ fontSize: 18 }} />
                                {statusFilter && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        width: 8,
                                        height: 8,
                                        bgcolor: 'error.main',
                                        borderRadius: '50%'
                                    }} />
                                )}
                            </IconButton>
                            
                            {/* Botón crear tarea */}
                            <ButtonPrimary
                                onClick={() => setAddModalOpen(true)}
                                style={{
                                    background: '#0E6191',
                                    color: 'white',
                                    height: '36px',
                                    fontWeight: 600,
                                    minWidth: '90px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    padding: '0 12px'
                                }}
                            >
                                <AddIcon sx={{ fontSize: '16px' }} />
                                Nueva
                            </ButtonPrimary>
                        </Box>
                        
                        {/* Filtros desplegables */}
                        <Collapse in={showFilters}>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                pt: 1,
                                borderTop: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Chip
                                    label="Todas"
                                    variant={statusFilter === null ? 'filled' : 'outlined'}
                                    color={statusFilter === null ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter(null)}
                                    size="small"
                                    sx={{
                                        height: 32,
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        cursor: 'pointer'
                                    }}
                                />
                                {statusFilterOptions.map((filter) => (
                                    <Chip
                                        key={filter.value}
                                        label={`${filter.label} (${tasksByStatus[filter.value as keyof typeof tasksByStatus].length})`}
                                        variant={statusFilter === filter.value ? 'filled' : 'outlined'}
                                        color={statusFilter === filter.value ? filter.color : 'default'}
                                        onClick={() => setStatusFilter(filter.value)}
                                        size="small"
                                        sx={{
                                            height: 32,
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Collapse>
                    </Box>
                ) : (
                    /* Desktop: Layout original */
                    <>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Typography 
                                variant="subtitle2" 
                                color="text.secondary" 
                                sx={{ 
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}
                            >
                                Filtrar por estado:
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 1.5
                            }}>
                                <TextField
                                    size="small"
                                    placeholder="Buscar tareas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    variant="outlined"
                                    sx={{ 
                                        minWidth: 200,
                                        '& .MuiOutlinedInput-root': {
                                            height: 40,
                                            bgcolor: 'white'
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                
                                <ButtonPrimary
                                    onClick={() => setAddModalOpen(true)}
                                    style={{
                                        background: '#0E6191',
                                        color: 'white',
                                        height: '40px',
                                        fontWeight: 600,
                                        minWidth: '160px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: '20px' }} />
                                    Crear Tarea
                                </ButtonPrimary>
                            </Box>
                        </Box>

                        <Stack 
                            direction="row" 
                            spacing={1.5}
                            sx={{ 
                                flexWrap: 'wrap', 
                                gap: 1.5,
                                '& > *': {
                                    flexShrink: 0
                                }
                            }}
                        >
                            <Chip
                                label="Todas"
                                variant={statusFilter === null ? 'filled' : 'outlined'}
                                color={statusFilter === null ? 'primary' : 'default'}
                                onClick={() => setStatusFilter(null)}
                                size="small"
                                sx={{
                                    minHeight: 32,
                                    fontSize: '0.8125rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            />
                            {statusFilterOptions.map((filter) => (
                                <Chip
                                    key={filter.value}
                                    label={`${filter.label} (${tasksByStatus[filter.value as keyof typeof tasksByStatus].length})`}
                                    variant={statusFilter === filter.value ? 'filled' : 'outlined'}
                                    color={statusFilter === filter.value ? filter.color : 'default'}
                                    onClick={() => setStatusFilter(filter.value)}
                                    size="small"
                                    sx={{
                                        minHeight: 32,
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </>
                )}
            </Paper>

            {/* Grid de Cards de Tareas */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {filteredTasks?.map((task) => (
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
            {(!filteredTasks || filteredTasks.length === 0) && !isLoading && (
                statusFilter ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            textAlign: 'center',
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            border: '2px dashed #e0e0e0',
                            mt: 3,
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            color="text.secondary" 
                            gutterBottom 
                            fontWeight="500"
                            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                        >
                            No hay tareas {statusFilterOptions.find(f => f.value === statusFilter)?.label.toLowerCase()}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.disabled" 
                            sx={{ 
                                mb: 2,
                                fontSize: { xs: '0.875rem', sm: '0.875rem' }
                            }}
                        >
                            Prueba con otro filtro o crea una nueva tarea
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => setStatusFilter(null)}
                            size="small"
                            sx={{ 
                                textTransform: 'none',
                                mr: 1
                            }}
                        >
                            Ver todas
                        </Button>
                        <ButtonPrimary
                            onClick={() => setAddModalOpen(true)}
                            style={{
                                background: '#0E6191',
                                color: 'white',
                                height: '36px',
                                fontWeight: 600,
                                width: '140px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <AddIcon sx={{ fontSize: '18px' }} />
                            Crear tarea
                        </ButtonPrimary>
                    </Paper>
                ) : (
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
                    <ButtonPrimary
                        onClick={() => setAddModalOpen(true)}
                        style={{
                            background: '#0E6191',
                            color: 'white',
                            height: '48px',
                            fontWeight: 600,
                            width: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '8px'
                        }}
                    >
                        <AddIcon sx={{ fontSize: '20px' }} />
                        Crear Primera Tarea
                    </ButtonPrimary>
                </Paper>
            ))}

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