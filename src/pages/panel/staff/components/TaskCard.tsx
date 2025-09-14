import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Card,
    CardContent,
    Tooltip,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    PlayArrow as StartIcon,
    Stop as CompleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { WorkTask } from '@/interfaces/staff.interface'

interface TaskCardProps {
    task: WorkTask
    onStartWork: (id: string) => void
    onCompleteWork: (id: string) => void
    onEdit: (task: WorkTask) => void
}

export default function TaskCard({ task, onStartWork, onCompleteWork, onEdit }: TaskCardProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    
    const handleClose = () => {
        setAnchorEl(null)
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

    const getTaskTypeText = (type: string) => {
        switch (type) {
            case 'checkout_cleaning': return 'Limpieza Salida'
            case 'maintenance': return 'Mantenimiento'
            case 'inspection': return 'Inspección'
            case 'checkin_preparation': return 'Preparación Entrada'
            default: return type
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return '#4caf50'
            case 'medium': return '#ff9800'
            case 'high': return '#f44336'
            case 'urgent': return '#d32f2f'
            default: return '#9e9e9e'
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

    const getPropertyColor = (task: WorkTask) => {
        // Usar el color del API si está disponible
        if (task.property_background_color) {
            return task.property_background_color
        }
        
        // Fallback a colores hardcodeados si el API no incluye el color
        switch (task.property_name) {
            case 'Casa Austin 1': return '#FF6B6B'  // Rojo
            case 'Casa Austin 2': return '#4ECDC4'  // Verde azulado
            case 'Casa Austin 3': return '#45B7D1'  // Azul
            case 'Casa Austin 4': return '#F7D794'  // Amarillo
            default: return '#9E9E9E' // Gris por defecto
        }
    }

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: { xs: 'auto', sm: 180, md: 200 },
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                },
                border: 'none',
                // Agregar el color de fondo de la propiedad como borde
                ...(task.property_name && {
                    borderLeft: `4px solid ${getPropertyColor(task)}`,
                }),
            }}
        >

            <CardContent sx={{ 
                p: { xs: 1.5, sm: 2, md: 2.5 }, 
                pb: { xs: 1, sm: 1.5 }, 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column' 
            }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'center', sm: 'flex-start' }, 
                    mb: { xs: 1, sm: 1.5 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        {/* Task Type Icon */}
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mr: { xs: 0.5, sm: 1 },
                                fontSize: { xs: '1.2rem', sm: '1.5rem' }
                            }}
                        >
                            {getTaskTypeIcon(task.task_type)}
                        </Typography>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography 
                                variant="h6" 
                                fontWeight="600" 
                                sx={{ 
                                    lineHeight: 1.1,
                                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {getTaskTypeText(task.task_type)}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: task.property_name ? "text.secondary" : "#d32f2f",
                                    fontWeight: task.property_name ? 400 : 700,
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                    display: 'block',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {task.property_name || "NO ASIGNADO"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Status and Menu Row */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mt: { xs: 1, sm: 0 },
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'space-between', sm: 'flex-end' }
                    }}>
                        <Chip
                            label={getStatusText(task.status)}
                            color={getStatusColor(task.status) as any}
                            size="small"
                            sx={{ 
                                fontWeight: 500,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={handleClick}
                            sx={{ 
                                color: 'text.secondary',
                                width: { xs: 44, sm: 32 },
                                height: { xs: 44, sm: 32 }
                            }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Assigned Staff */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: { xs: 1, sm: 1.5 }
                }}>
                    {task.staff_member_name ? (
                        <>
                            <Avatar sx={{ 
                                width: { xs: 22, sm: 26 }, 
                                height: { xs: 22, sm: 26 }, 
                                mr: { xs: 0.8, sm: 1.2 }, 
                                fontSize: { xs: '0.65rem', sm: '0.75rem' }
                            }}>
                                {task.staff_member_name[0]}
                            </Avatar>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1
                                }}
                            >
                                <strong>{task.staff_member_name}</strong>
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Avatar sx={{ 
                                width: { xs: 22, sm: 26 }, 
                                height: { xs: 22, sm: 26 }, 
                                mr: { xs: 0.8, sm: 1.2 }, 
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                bgcolor: '#f5f5f5',
                                color: '#d32f2f'
                            }}>
                                ?
                            </Avatar>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#d32f2f', 
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                }}
                            >
                                No asignado
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Dates and Priority */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { sm: 'space-between' }, 
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                    gap: { xs: 0.8, sm: 1 },
                    mb: { xs: 1, sm: 1.5 }
                }}>
                    {/* Dates Container */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 0.3,
                        flex: 1
                    }}>
                        {/* Check-out Date */}
                        {task.check_out_date && (
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.4
                                }}
                            >
                                🏠 Check-out: {new Date(task.check_out_date).toLocaleDateString('es-ES')}
                            </Typography>
                        )}
                        
                        {/* Scheduled Date */}
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.4
                            }}
                        >
                            📅 Programada: {task.scheduled_date 
                                ? new Date(task.scheduled_date).toLocaleDateString('es-ES')
                                : 'Sin fecha programada'
                            }
                        </Typography>
                    </Box>
                    
                    <Chip
                        label={getPriorityText(task.priority)}
                        size="small"
                        sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 22, sm: 24 },
                            alignSelf: { xs: 'flex-start', sm: 'center' }
                        }}
                    />
                </Box>

                {/* Description */}
                {task.description && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            mt: { xs: 0.8, sm: 1.5 }, 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            display: '-webkit-box',
                            WebkitLineClamp: { xs: 2, sm: 2 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: { xs: 1.2, sm: 1.3 }
                        }}
                    >
                        {task.description}
                    </Typography>
                )}

                {/* Quick Action Buttons */}
                <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 0.8 }, 
                    mt: 'auto', 
                    pt: { xs: 1, sm: 1.5 }, 
                    borderTop: '1px solid #f0f0f0' 
                }}>
                    {task.status === 'assigned' && (
                        <Tooltip title="Iniciar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => onStartWork(task.id.toString())}
                                sx={{ 
                                    color: 'success.main',
                                    bgcolor: 'success.light',
                                    width: { xs: 44, sm: 32 },
                                    height: { xs: 44, sm: 32 },
                                    '&:hover': { 
                                        bgcolor: 'success.main',
                                        color: 'white',
                                        transform: 'scale(1.1)'
                                    },
                                    border: '1px solid',
                                    borderColor: 'success.main',
                                }}
                            >
                                <StartIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    {task.status === 'in_progress' && (
                        <Tooltip title="Completar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => onCompleteWork(task.id.toString())}
                                sx={{ 
                                    color: 'primary.main',
                                    bgcolor: 'primary.light',
                                    width: { xs: 44, sm: 32 },
                                    height: { xs: 44, sm: 32 },
                                    '&:hover': { 
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        transform: 'scale(1.1)'
                                    },
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                }}
                            >
                                <CompleteIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    <Tooltip title="Editar tarea">
                        <IconButton
                            size="small"
                            onClick={() => onEdit(task)}
                            sx={{ 
                                color: 'warning.main',
                                bgcolor: 'grey.100',
                                width: { xs: 44, sm: 32 },
                                height: { xs: 44, sm: 32 },
                                '&:hover': { 
                                    bgcolor: 'warning.light',
                                    color: 'warning.dark',
                                    transform: 'scale(1.1)'
                                },
                                border: '1px solid',
                                borderColor: 'warning.main',
                            }}
                        >
                            <EditIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { 
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }
                }}
            >
                <MenuItem onClick={() => { onEdit(task); handleClose(); }}>
                    <EditIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                    Editar tarea
                </MenuItem>
                
                {task.status === 'assigned' && (
                    <MenuItem onClick={() => { onStartWork(task.id.toString()); handleClose(); }}>
                        <StartIcon sx={{ mr: 1, fontSize: '1.1rem', color: 'success.main' }} />
                        Iniciar trabajo
                    </MenuItem>
                )}
                
                {task.status === 'in_progress' && (
                    <MenuItem onClick={() => { onCompleteWork(task.id.toString()); handleClose(); }}>
                        <CompleteIcon sx={{ mr: 1, fontSize: '1.1rem', color: 'primary.main' }} />
                        Completar trabajo
                    </MenuItem>
                )}
            </Menu>
        </Card>
    )
}