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
    Dialog,
    DialogContent,
    DialogTitle,
    Badge,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    PlayArrow as StartIcon,
    Stop as CompleteIcon,
    Edit as EditIcon,
    CameraAlt as CameraIcon,
    Image as ImageIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import { useState, useRef } from 'react'
import { WorkTask } from '@/interfaces/staff.interface'
import { useUploadTaskPhotoMutation } from '@/services/tasks/tasksService'
import TimerComponent from './TimerComponent'
import Cookies from 'js-cookie'

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
    const [uploadTaskPhoto, { isLoading: isUploadingPhoto }] = useUploadTaskPhotoMutation()
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const open = Boolean(anchorEl)
    
    // Obtener rol del usuario desde cookie
    const userRole = Cookies.get('rollTkn')
    const isMaintenanceUser = userRole === 'mantenimiento'
    
    // Verificar si la tarea tiene fotos
    const hasPhotos = task.photos && task.photos.length > 0

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handlePhotoUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('photo', file)
        formData.append('description', 'Evidencia de trabajo')

        try {
            await uploadTaskPhoto({ 
                id: task.id.toString(), 
                data: formData 
            }).unwrap()
            
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            
            console.log('Foto subida exitosamente para tarea:', task.id)
        } catch (error) {
            console.error('Error al subir foto:', error)
        }
    }

    const handleViewPhotos = () => {
        if (hasPhotos) {
            setCurrentPhotoIndex(0)
            setPhotoDialogOpen(true)
        }
    }

    const handleClosePhotoDialog = () => {
        setPhotoDialogOpen(false)
    }

    const handleNextPhoto = () => {
        if (hasPhotos && currentPhotoIndex < task.photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1)
        }
    }

    const handlePrevPhoto = () => {
        if (hasPhotos && currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1)
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
                        {/* Check-out Date - CUADRADA */}
                        {task.check_out_date && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: isMobile ? 1 : 0.8,
                                bgcolor: '#FFF8E1',
                                borderRadius: 1.5,
                                border: '2px solid #FFD54F',
                                flex: '1 1 45%',
                                minHeight: isMobile ? '60px' : '55px',
                                boxShadow: '0 2px 8px rgba(255,193,7,0.15)'
                            }}>
                                <Typography 
                                    sx={{ 
                                        fontSize: isMobile ? '1.2rem' : '1.1rem',
                                        lineHeight: 1,
                                        mb: 0.3
                                    }}
                                >
                                    🏠
                                </Typography>
                                <Typography 
                                    variant="caption"
                                    sx={{ 
                                        fontSize: isMobile ? '0.6rem' : '0.65rem',
                                        fontWeight: 600,
                                        color: '#F57F17',
                                        textAlign: 'center',
                                        lineHeight: 1,
                                        mb: 0.2
                                    }}
                                >
                                    CHECK-OUT
                                </Typography>
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        fontSize: isMobile ? '0.75rem' : '0.8rem',
                                        fontWeight: 700,
                                        color: '#E65100',
                                        textAlign: 'center',
                                        lineHeight: 1
                                    }}
                                >
                                    {new Date(task.check_out_date).toLocaleDateString('es-ES', { 
                                        weekday: 'short', 
                                        day: '2-digit', 
                                        month: '2-digit' 
                                    })}
                                </Typography>
                            </Box>
                        )}
                        
                        {/* Scheduled Date - CUADRADA */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: isMobile ? 1 : 0.8,
                            bgcolor: '#E3F2FD',
                            borderRadius: 1.5,
                            border: '2px solid #42A5F5',
                            flex: '1 1 45%',
                            minHeight: isMobile ? '60px' : '55px',
                            boxShadow: '0 2px 8px rgba(25,118,210,0.15)'
                        }}>
                            <Typography 
                                sx={{ 
                                    fontSize: isMobile ? '1.2rem' : '1.1rem',
                                    lineHeight: 1,
                                    mb: 0.3
                                }}
                            >
                                📅
                            </Typography>
                            <Typography 
                                variant="caption"
                                sx={{ 
                                    fontSize: isMobile ? '0.6rem' : '0.65rem',
                                    fontWeight: 600,
                                    color: '#1565C0',
                                    textAlign: 'center',
                                    lineHeight: 1,
                                    mb: 0.2
                                }}
                            >
                                PROGRAMADA
                            </Typography>
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    fontSize: isMobile ? '0.75rem' : '0.8rem',
                                    fontWeight: 700,
                                    color: '#0D47A1',
                                    textAlign: 'center',
                                    lineHeight: 1
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
                        <>
                            {/* Timer de progreso */}
                            {task.actual_start_time && (
                                <TimerComponent startTime={task.actual_start_time} />
                            )}
                            
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
                        </>
                    )}
                    
                    {/* Botón de editar - SOLO para usuarios NO mantenimiento */}
                    {!isMaintenanceUser && (
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
                    )}
                    
                    <Tooltip title="Subir foto">
                        <IconButton
                            size="small"
                            onClick={handlePhotoUpload}
                            disabled={isUploadingPhoto}
                            sx={{ 
                                color: 'success.main',
                                bgcolor: 'grey.100',
                                width: { xs: 44, sm: 32 },
                                height: { xs: 44, sm: 32 },
                                '&:hover': { 
                                    bgcolor: 'success.light',
                                    color: 'success.dark',
                                    transform: 'scale(1.1)'
                                },
                                '&:disabled': {
                                    opacity: 0.6
                                },
                                border: '1px solid',
                                borderColor: 'success.main',
                            }}
                        >
                            <CameraIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
                        </IconButton>
                    </Tooltip>
                    
                    {/* Botón para ver fotos - solo si existen */}
                    {hasPhotos && (
                        <Tooltip title={`Ver fotos (${task.photos.length})`}>
                            <IconButton
                                size="small"
                                onClick={handleViewPhotos}
                                sx={{ 
                                    color: '#7c3aed',
                                    bgcolor: 'grey.100',
                                    width: { xs: 44, sm: 32 },
                                    height: { xs: 44, sm: 32 },
                                    '&:hover': { 
                                        bgcolor: '#ede9fe',
                                        color: '#5b21b6',
                                        transform: 'scale(1.1)'
                                    },
                                    border: '1px solid',
                                    borderColor: '#7c3aed',
                                }}
                            >
                                <Badge 
                                    badgeContent={task.photos.length} 
                                    color="primary" 
                                    sx={{ 
                                        '& .MuiBadge-badge': { 
                                            fontSize: '0.6rem',
                                            minWidth: 16,
                                            height: 16
                                        } 
                                    }}
                                >
                                    <ImageIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    )}
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
                {/* Opción de editar en menú - SOLO para usuarios NO mantenimiento */}
                {!isMaintenanceUser && (
                    <MenuItem onClick={() => { onEdit(task); handleClose(); }}>
                        <EditIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                        Editar tarea
                    </MenuItem>
                )}
                
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
                <MenuItem onClick={() => { handlePhotoUpload(); handleClose(); }}>
                    <CameraIcon sx={{ mr: 1, fontSize: '1.1rem', color: 'success.main' }} />
                    Subir foto
                </MenuItem>
                
                {/* Opción para ver fotos en menú - solo si existen */}
                {hasPhotos && (
                    <MenuItem onClick={() => { handleViewPhotos(); handleClose(); }}>
                        <ImageIcon sx={{ mr: 1, fontSize: '1.1rem', color: '#7c3aed' }} />
                        Ver fotos ({task.photos.length})
                    </MenuItem>
                )}
            </Menu>
            
            {/* Hidden file input for photo upload */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            
            {/* Dialog para ver fotos */}
            <Dialog
                open={photoDialogOpen}
                onClose={handleClosePhotoDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Typography variant="h6">
                        Fotos de la tarea - {currentPhotoIndex + 1} de {hasPhotos ? task.photos.length : 0}
                    </Typography>
                    <IconButton onClick={handleClosePhotoDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 2 }}>
                    {hasPhotos && task.photos[currentPhotoIndex] && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={task.photos[currentPhotoIndex].photo}
                                alt={`Foto ${currentPhotoIndex + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    objectFit: 'contain',
                                    borderRadius: 8
                                }}
                            />
                            
                            {/* Descripción de la foto */}
                            {task.photos[currentPhotoIndex].description && (
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        mt: 1, 
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    {task.photos[currentPhotoIndex].description}
                                </Typography>
                            )}
                            
                            {/* Fecha de subida */}
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    mt: 0.5, 
                                    display: 'block',
                                    color: 'text.secondary'
                                }}
                            >
                                Subida: {new Date(task.photos[currentPhotoIndex].uploaded_at).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                            
                            {/* Navegación entre fotos */}
                            {task.photos.length > 1 && (
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <IconButton 
                                        onClick={handlePrevPhoto}
                                        disabled={currentPhotoIndex === 0}
                                        sx={{ bgcolor: 'action.hover' }}
                                    >
                                        ←
                                    </IconButton>
                                    <IconButton 
                                        onClick={handleNextPhoto}
                                        disabled={currentPhotoIndex === task.photos.length - 1}
                                        sx={{ bgcolor: 'action.hover' }}
                                    >
                                        →
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}