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
    useTheme,
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
    const theme = useTheme()
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
            case 'checkout_cleaning': return 'Limpieza'
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

    // Calculate calendar days difference between check-out and scheduled date
    const calculateDaysDifference = (): number => {
        if (!task.check_out_date || !task.scheduled_date) return 0
        
        // Normalize dates to midnight to get calendar day difference
        const checkOutDate = new Date(task.check_out_date)
        checkOutDate.setHours(0, 0, 0, 0)
        
        const scheduledDate = new Date(task.scheduled_date)
        scheduledDate.setHours(0, 0, 0, 0)
        
        const diffTime = scheduledDate.getTime() - checkOutDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        return Math.max(0, diffDays) // Return 0 if scheduled date is before check-out
    }

    // Get card background color based on days difference: 0d=Blanco, 1d=Amarillo, 2d=Naranja, 3d+=Rojo
    const getCardBackgroundColor = (): string => {
        const daysDiff = calculateDaysDifference()
        
        if (daysDiff === 0) return theme.palette.background.paper // Blanco - mismo día
        if (daysDiff === 1) return theme.palette.mode === 'dark' ? '#3d3300' : '#fff59d' // Amarillo - 1 día
        if (daysDiff === 2) return theme.palette.mode === 'dark' ? '#4d2c00' : '#ffcc80' // Naranja - 2 días
        return theme.palette.mode === 'dark' ? '#4d0000' : '#ffab91' // Rojo - 3+ días
    }

    // Get text color based on background color for better contrast
    const getTextColor = (): string => {
        const daysDiff = calculateDaysDifference()
        
        if (daysDiff === 0) return theme.palette.text.secondary // Default background
        
        // For colored backgrounds, use appropriate contrast
        if (theme.palette.mode === 'dark') {
            // In dark mode, colored backgrounds are dark, so use light text
            return theme.palette.common.white
        } else {
            // In light mode, colored backgrounds are light, so use dark text
            return theme.palette.common.black
        }
    }

    // Get divider color based on background for better contrast
    const getDividerColor = (): string => {
        const daysDiff = calculateDaysDifference()
        // For all colored backgrounds, use a darker divider for better visibility
        if (daysDiff >= 1) return theme.palette.grey[600]
        // For white background, use standard divider
        return theme.palette.divider
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
                backgroundColor: getCardBackgroundColor(),
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
                p: { xs: 1.2, sm: 2, md: 2.5 }, 
                pb: { xs: 0.8, sm: 1.5 }, 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column' 
            }}>
                {/* Mobile Header - Creative Layout */}
                <Box sx={{ 
                    display: { xs: 'block', sm: 'flex' },
                    justifyContent: { sm: 'space-between' },
                    alignItems: { sm: 'flex-start' },
                    mb: { xs: 1.2, sm: 1.5 }
                }}>
                    {/* Mobile: Icon + Title in one line, Property below */}
                    <Box sx={{ 
                        display: { xs: 'flex', sm: 'flex' }, 
                        alignItems: 'center', 
                        justifyContent: { xs: 'space-between', sm: 'flex-start' },
                        flex: 1, 
                        minWidth: 0,
                        mb: { xs: 0.8, sm: 0 }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                            {/* Task Type Icon - Larger on mobile */}
                            <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: { xs: 40, sm: 'auto' },
                                height: { xs: 40, sm: 'auto' },
                                borderRadius: { xs: 2, sm: 0 },
                                bgcolor: { xs: 'rgba(255,255,255,0.2)', sm: 'transparent' },
                                mr: { xs: 1, sm: 1 }
                            }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontSize: { xs: '1.4rem', sm: '1.5rem' }
                                    }}
                                >
                                    {getTaskTypeIcon(task.task_type)}
                                </Typography>
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography 
                                    variant="h6" 
                                    fontWeight="700" 
                                    sx={{ 
                                        lineHeight: 1.2,
                                        fontSize: { xs: '0.95rem', sm: '0.95rem', md: '1rem' },
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: getTextColor(),
                                        mb: { xs: 0.3, sm: 0 }
                                    }}
                                >
                                    {getTaskTypeText(task.task_type)}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {/* Status chip - Top right on mobile */}
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Chip
                                label={getStatusText(task.status)}
                                color={getStatusColor(task.status) as any}
                                size="small"
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 24
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Property Name - Full width on mobile */}
                    <Box sx={{ 
                        display: { xs: 'flex', sm: 'none' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.8
                    }}>
                        {task.property_name ? (
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: getTextColor(),
                                    fontWeight: 500,
                                    fontSize: "0.8rem",
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1,
                                    mr: 1
                                }}
                            >
                                📍 {task.property_name}
                            </Typography>
                        ) : (
                            <Chip
                                label="NO ASIGNADO"
                                size="small"
                                sx={{
                                    bgcolor: 'error.main',
                                    color: 'error.contrastText',
                                    fontWeight: 600,
                                    fontSize: '0.65rem',
                                    height: 20
                                }}
                            />
                        )}
                        
                        {/* Priority and Menu on mobile */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Chip
                                label={getPriorityText(task.priority)}
                                size="small"
                                sx={{
                                    backgroundColor: getPriorityColor(task.priority),
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.65rem',
                                    height: 20
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={handleClick}
                                sx={{ 
                                    color: getTextColor(),
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.3)'
                                    }
                                }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Desktop Layout */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {task.property_name ? (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: getTextColor(),
                                    fontWeight: 400,
                                    fontSize: "0.75rem",
                                    display: 'block',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {task.property_name}
                            </Typography>
                        ) : (
                            <Chip
                                label="NO ASIGNADO"
                                size="small"
                                sx={{
                                    bgcolor: 'error.main',
                                    color: 'error.contrastText',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 20,
                                    '& .MuiChip-label': {
                                        px: 1
                                    }
                                }}
                            />
                        )}
                    </Box>

                    {/* Desktop Status and Menu */}
                    <Box sx={{ 
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center', 
                        gap: 1
                    }}>
                        <Chip
                            label={getStatusText(task.status)}
                            color={getStatusColor(task.status) as any}
                            size="small"
                            sx={{ 
                                fontWeight: 500,
                                fontSize: '0.75rem'
                            }}
                        />
                        <Chip
                            label={getPriorityText(task.priority)}
                            size="small"
                            sx={{
                                backgroundColor: getPriorityColor(task.priority),
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 24,
                                alignSelf: 'center'
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={handleClick}
                            sx={{ 
                                color: getTextColor(),
                                width: 32,
                                height: 32
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
                                sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1,
                                    color: getTextColor()
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
                            <Chip
                                label="No asignado"
                                size="small"
                                sx={{
                                    bgcolor: 'error.main',
                                    color: 'error.contrastText',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    height: { xs: 20, sm: 22 },
                                    '& .MuiChip-label': {
                                        px: 1
                                    }
                                }}
                            />
                        </>
                    )}
                </Box>

                {/* Dates Section - Mobile Creative Layout */}
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'column' },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                    gap: { xs: 1, sm: 0.5 },
                    mb: { xs: 1.2, sm: 1.5 },
                    background: { xs: 'rgba(255,255,255,0.1)', sm: 'transparent' },
                    borderRadius: { xs: 1.5, sm: 0 },
                    p: { xs: 1, sm: 0 }
                }}>
                    {/* Check-out Date */}
                    {task.check_out_date && (
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'center' },
                            gap: { xs: 0.2, sm: 0.4 },
                            flex: { xs: 1, sm: 'auto' },
                            textAlign: { xs: 'center', sm: 'left' }
                        }}>
                            <Typography sx={{ 
                                fontSize: { xs: '1rem', sm: '0.7rem' },
                                color: getTextColor()
                            }}>
                                🏠
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontSize: { xs: '0.7rem', sm: '0.7rem' },
                                    fontWeight: { xs: 600, sm: 500 },
                                    color: getTextColor(),
                                    lineHeight: 1.2
                                }}
                            >
                                {new Date(task.check_out_date).toLocaleDateString('es-ES')}
                            </Typography>
                        </Box>
                    )}
                    
                    {/* Scheduled Date */}
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'center' },
                        gap: { xs: 0.2, sm: 0.4 },
                        flex: { xs: 1, sm: 'auto' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}>
                        <Typography sx={{ 
                            fontSize: { xs: '1rem', sm: '0.7rem' },
                            color: getTextColor()
                        }}>
                            📅
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.7rem' },
                                fontWeight: { xs: 600, sm: 500 },
                                color: getTextColor(),
                                lineHeight: 1.2
                            }}
                        >
                            {task.scheduled_date 
                                ? new Date(task.scheduled_date).toLocaleDateString('es-ES')
                                : 'Sin fecha'
                            }
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                {task.description && (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            mt: { xs: 0.8, sm: 1.5 }, 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            display: '-webkit-box',
                            WebkitLineClamp: { xs: 2, sm: 2 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: { xs: 1.2, sm: 1.3 },
                            color: getTextColor()
                        }}
                    >
                        {task.description}
                    </Typography>
                )}

                {/* Quick Action Buttons - Mobile-First Design */}
                <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1.2, sm: 0.8 }, 
                    mt: 'auto', 
                    pt: { xs: 1.2, sm: 1.5 },
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    borderTop: { xs: 'none', sm: `1px solid ${getDividerColor()}` },
                    background: { xs: 'rgba(255,255,255,0.1)', sm: 'transparent' },
                    borderRadius: { xs: 1.5, sm: 0 },
                    p: { xs: 1, sm: 0 },
                    mx: { xs: -0.5, sm: 0 }
                }}>
                    {task.status === 'assigned' && (
                        <Tooltip title="Iniciar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => onStartWork(task.id.toString())}
                                sx={{ 
                                    color: '#ffffff',
                                    bgcolor: '#6366f1',
                                    width: { xs: 48, sm: 32 },
                                    height: { xs: 48, sm: 32 },
                                    borderRadius: { xs: 2, sm: 1 },
                                    '&:hover': { 
                                        bgcolor: '#4f46e5',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                                    },
                                    '@media (hover: hover)': {
                                        '&:hover': {
                                            transform: 'scale(1.1)'
                                        }
                                    },
                                    border: '2px solid #6366f1',
                                    transition: 'all 0.3s ease',
                                    boxShadow: { xs: '0 2px 8px rgba(99, 102, 241, 0.3)', sm: 'none' }
                                }}
                            >
                                <StartIcon sx={{ fontSize: { xs: 22, sm: 18 } }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    {task.status === 'in_progress' && (
                        <Tooltip title="Completar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => onCompleteWork(task.id.toString())}
                                sx={{ 
                                    color: '#ffffff',
                                    bgcolor: '#22c55e',
                                    width: { xs: 48, sm: 32 },
                                    height: { xs: 48, sm: 32 },
                                    borderRadius: { xs: 2, sm: 1 },
                                    '&:hover': { 
                                        bgcolor: '#16a34a',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                                    },
                                    '@media (hover: hover)': {
                                        '&:hover': {
                                            transform: 'scale(1.1)'
                                        }
                                    },
                                    border: '2px solid #22c55e',
                                    transition: 'all 0.3s ease',
                                    boxShadow: { xs: '0 2px 8px rgba(34, 197, 94, 0.3)', sm: 'none' }
                                }}
                            >
                                <CompleteIcon sx={{ fontSize: { xs: 22, sm: 18 } }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    <Tooltip title="Editar tarea">
                        <IconButton
                            size="small"
                            onClick={() => onEdit(task)}
                            sx={{ 
                                color: '#ffffff',
                                bgcolor: '#f59e0b',
                                width: { xs: 48, sm: 32 },
                                height: { xs: 48, sm: 32 },
                                borderRadius: { xs: 2, sm: 1 },
                                '&:hover': { 
                                    bgcolor: '#d97706',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                                },
                                '@media (hover: hover)': {
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
                                },
                                border: '2px solid #f59e0b',
                                transition: 'all 0.3s ease',
                                boxShadow: { xs: '0 2px 8px rgba(245, 158, 11, 0.3)', sm: 'none' }
                            }}
                        >
                            <EditIcon sx={{ fontSize: { xs: 22, sm: 18 } }} />
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