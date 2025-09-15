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
    useMediaQuery,
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [expandDescription, setExpandDescription] = useState(false)
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
                minHeight: isMobile ? 140 : { sm: 180, md: 200 },
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
                p: isMobile ? 1 : { sm: 2, md: 2.5 }, 
                pb: isMobile ? 1 : { sm: 1.5 }, 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column' 
            }}>
                {/* Header */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: isMobile ? 0.8 : { sm: 1.5 },
                    flexWrap: 'nowrap'
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
                                    fontSize: isMobile ? '0.8rem' : { sm: '0.95rem', md: '1rem' },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: getTextColor()
                                }}
                            >
                                {getTaskTypeText(task.task_type)}
                            </Typography>
                            {task.property_name ? (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: getTextColor(),
                                        fontWeight: 400,
                                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
                                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                        height: { xs: 18, sm: 20 },
                                        '& .MuiChip-label': {
                                            px: 1
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Status and Menu Row - Mobile: same row as header */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        mt: isMobile ? 0 : 0,
                        ml: isMobile ? 0.5 : 0,
                        width: 'auto',
                        justifyContent: 'flex-end'
                    }}>
                        <Chip
                            label={getStatusText(task.status)}
                            color={getStatusColor(task.status) as any}
                            size="small"
                            sx={{ 
                                fontWeight: 500,
                                fontSize: isMobile ? '0.65rem' : { sm: '0.75rem' },
                                height: isMobile ? 20 : 24
                            }}
                        />
                        {!isMobile && (
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
                        )}
                    </Box>
                </Box>

                {/* Assigned Staff - Compressed for mobile */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: isMobile ? 0.8 : { sm: 1.5 }
                }}>
                    {task.staff_member_name ? (
                        <>
                            <Avatar sx={{ 
                                width: isMobile ? 18 : { sm: 26 }, 
                                height: isMobile ? 18 : { sm: 26 }, 
                                mr: isMobile ? 0.5 : { sm: 1.2 }, 
                                fontSize: isMobile ? '0.6rem' : { sm: '0.75rem' }
                            }}>
                                {task.staff_member_name[0]}
                            </Avatar>
                            <Typography 
                                variant="body2" 
                                sx={{
                                    fontSize: isMobile ? '0.75rem' : { sm: '0.875rem' },
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

                {/* Dates and Priority - FECHAS MAS GRANDES Y ORGANIZADAS */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : { sm: 'row' },
                    justifyContent: { sm: 'space-between' }, 
                    alignItems: isMobile ? 'stretch' : { sm: 'flex-start' },
                    gap: isMobile ? 1 : { sm: 1.2 },
                    mb: isMobile ? 1.2 : { sm: 1.8 },
                    p: isMobile ? 1 : { sm: 1.2 },
                    bgcolor: isMobile ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.01)',
                    borderRadius: 1.5,
                    border: `1px solid ${getDividerColor()}`
                }}>
                    {/* Dates Container - FECHAS LADO A LADO */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        gap: isMobile ? 1 : 1.2,
                        flex: 1,
                        flexWrap: 'wrap'
                    }}>
                        {/* Check-out Date - HORIZONTAL */}
                        {task.check_out_date && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.6,
                                p: isMobile ? 0.5 : 0.4,
                                bgcolor: 'rgba(255,193,7,0.1)',
                                borderRadius: 1,
                                border: '1px solid rgba(255,193,7,0.3)',
                                flex: '1 1 auto',
                                minWidth: isMobile ? '120px' : '140px'
                            }}>
                                <Typography 
                                    sx={{ 
                                        fontSize: isMobile ? '1.1rem' : '1rem',
                                        lineHeight: 1
                                    }}
                                >
                                    🏠
                                </Typography>
                                <Box>
                                    <Typography 
                                        variant="caption"
                                        sx={{ 
                                            fontSize: isMobile ? '0.65rem' : '0.7rem',
                                            fontWeight: 500,
                                            color: 'text.secondary',
                                            display: 'block',
                                            lineHeight: 1
                                        }}
                                    >
                                        Check-out:
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        sx={{ 
                                            fontSize: isMobile ? '0.8rem' : '0.85rem',
                                            fontWeight: 600,
                                            color: getTextColor(),
                                            lineHeight: 1.1
                                        }}
                                    >
                                        {new Date(task.check_out_date).toLocaleDateString('es-ES', { 
                                            weekday: 'short', 
                                            day: '2-digit', 
                                            month: '2-digit' 
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        
                        {/* Scheduled Date - HORIZONTAL */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.6,
                            p: isMobile ? 0.5 : 0.4,
                            bgcolor: 'rgba(25,118,210,0.1)',
                            borderRadius: 1,
                            border: '1px solid rgba(25,118,210,0.3)',
                            flex: '1 1 auto',
                            minWidth: isMobile ? '120px' : '140px'
                        }}>
                            <Typography 
                                sx={{ 
                                    fontSize: isMobile ? '1.1rem' : '1rem',
                                    lineHeight: 1
                                }}
                            >
                                📅
                            </Typography>
                            <Box>
                                <Typography 
                                    variant="caption"
                                    sx={{ 
                                        fontSize: isMobile ? '0.65rem' : '0.7rem',
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        display: 'block',
                                        lineHeight: 1
                                    }}
                                >
                                    Programada:
                                </Typography>
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        fontSize: isMobile ? '0.8rem' : '0.85rem',
                                        fontWeight: 600,
                                        color: getTextColor(),
                                        lineHeight: 1.1
                                    }}
                                >
                                    {task.scheduled_date 
                                        ? new Date(task.scheduled_date).toLocaleDateString('es-ES', { 
                                            weekday: 'short', 
                                            day: '2-digit', 
                                            month: '2-digit' 
                                        })
                                        : 'Sin fecha'
                                    }
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Description - Optimized for mobile */}
                {task.description && (
                    <Box>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mt: isMobile ? 0.6 : { sm: 1.5 }, 
                                fontSize: isMobile ? '0.65rem' : { sm: '0.75rem' },
                                display: '-webkit-box',
                                WebkitLineClamp: isMobile && !expandDescription ? 1 : 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: isMobile ? 1.1 : { sm: 1.3 },
                                color: getTextColor()
                            }}
                        >
                            {task.description}
                        </Typography>
                        {isMobile && task.description.length > 50 && (
                            <Typography
                                variant="caption"
                                onClick={() => setExpandDescription(!expandDescription)}
                                sx={{
                                    color: 'primary.main',
                                    cursor: 'pointer',
                                    fontSize: '0.6rem',
                                    fontWeight: 500,
                                    mt: 0.3,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                {expandDescription ? 'Ver menos' : 'Ver más'}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Quick Action Buttons con Prioridad */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto', 
                    pt: { xs: 1, sm: 1.5 }, 
                    borderTop: `1px solid ${getDividerColor()}` 
                }}>
                    {/* Botones de acción */}
                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 1, sm: 0.8 }
                    }}>
                    {task.status === 'assigned' && (
                        <Tooltip title="Iniciar trabajo">
                            <IconButton
                                size="small"
                                onClick={() => {
                                    console.log('Play button clicked for task:', task.id)
                                    onStartWork(task.id.toString())
                                }}
                                sx={{ 
                                    color: '#ffffff',
                                    bgcolor: '#6366f1',
                                    width: { xs: 44, sm: 32 },
                                    height: { xs: 44, sm: 32 },
                                    '&:hover': { 
                                        bgcolor: '#4f46e5',
                                        color: 'white',
                                        transform: 'scale(1.1)',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                                    },
                                    border: '1px solid #6366f1',
                                    transition: 'all 0.3s ease'
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
                    
                    {/* Chip de Prioridad del tamaño del botón play */}
                    <Chip
                        label={getPriorityText(task.priority)}
                        sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: isMobile ? '0.75rem' : { sm: '0.8rem' },
                            height: isMobile ? 44 : { sm: 32 },
                            minWidth: isMobile ? 60 : 70,
                            '& .MuiChip-label': {
                                px: isMobile ? 1.5 : 1.2
                            }
                        }}
                    />
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