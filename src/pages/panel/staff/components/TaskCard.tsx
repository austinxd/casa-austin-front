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

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                },
                border: 'none',
            }}
        >
            {/* Priority Strip */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: getPriorityColor(task.priority),
                }}
            />

            <CardContent sx={{ p: 3, pb: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        {/* Task Type Icon */}
                        <Typography variant="h5" sx={{ mr: 1 }}>
                            {getTaskTypeIcon(task.task_type)}
                        </Typography>
                        <Box>
                            <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                                {task.title || getTaskTypeText(task.task_type)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getTaskTypeText(task.task_type)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Menu */}
                    <IconButton
                        size="small"
                        onClick={handleClick}
                        sx={{ ml: 1, color: 'text.secondary' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                {/* Property and Status Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="600">
                            🏠 {task.property_name || 'Sin propiedad'}
                        </Typography>
                    </Box>
                    
                    <Chip
                        label={getStatusText(task.status)}
                        color={getStatusColor(task.status) as any}
                        size="small"
                        sx={{ fontWeight: 500 }}
                    />
                </Box>

                {/* Assigned Staff */}
                {task.staff_member_name && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.8rem' }}>
                            {task.staff_member_name[0]}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                            Asignado a: <strong>{task.staff_member_name}</strong>
                        </Typography>
                    </Box>
                )}

                {/* Date and Priority */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                }}>
                    <Typography variant="caption" color="text.secondary">
                        📅 {task.scheduled_date 
                            ? new Date(task.scheduled_date).toLocaleDateString('es-ES')
                            : 'Sin fecha programada'
                        }
                    </Typography>
                    
                    <Chip
                        label={getPriorityText(task.priority)}
                        size="small"
                        sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                        }}
                    />
                </Box>

                {/* Description */}
                {task.description && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            mt: 2, 
                            fontSize: '0.8rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {task.description}
                    </Typography>
                )}

                {/* Quick Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                    {task.status === 'assigned' && (
                        <Tooltip title="Iniciar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => onStartWork(task.id.toString())}
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
                    
                    {task.status === 'in_progress' && (
                        <Tooltip title="Completar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => onCompleteWork(task.id.toString())}
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
                            size="small"
                            onClick={() => onEdit(task)}
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