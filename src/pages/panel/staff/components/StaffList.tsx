import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    Card,
    CardContent,
    Avatar,
    Paper,
    Stack,
    TextField,
    InputAdornment,
    List,
    ListItem,
    Divider,
    Tooltip,
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Work as WorkIcon,
} from '@mui/icons-material'
import { useGetAllStaffQuery, useDeleteStaffMutation } from '@/services/staff/staffService'
import { StaffMember } from '@/interfaces/staff.interface'

export default function StaffList() {
    const [search, setSearch] = useState('')

    const { data, isLoading, error, refetch } = useGetAllStaffQuery({
        page: 1,
        page_size: 50,
        search: search,
    })

    const [deleteStaff] = useDeleteStaffMutation()

    const handleEdit = (staff: StaffMember) => {
        console.log('Edit staff:', staff)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de eliminar este empleado?')) {
            try {
                await deleteStaff(id).unwrap()
                refetch()
            } catch (error) {
                console.error('Error deleting staff:', error)
            }
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success'
            case 'inactive': return 'error'
            case 'on_leave': return 'warning'
            default: return 'default'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Activo'
            case 'inactive': return 'Inactivo'
            case 'on_leave': return 'En vacaciones'
            default: return status
        }
    }

    const getStaffTypeText = (type: string) => {
        switch (type) {
            case 'cleaning': return 'Limpieza'
            case 'maintenance': return 'Mantenimiento'
            case 'supervisor': return 'Supervisor'
            case 'admin': return 'Administrador'
            case 'both': return 'Ambos'
            default: return type
        }
    }

    const getStaffTypeIcon = (type: string) => {
        switch (type) {
            case 'cleaning': return '🧹'
            case 'maintenance': return '🔧'
            case 'supervisor': return '👨‍💼'
            case 'admin': return '⚙️'
            case 'both': return '🔄'
            default: return '👤'
        }
    }

    const StaffListItem = ({ staff }: { staff: StaffMember }) => (
        <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {/* Avatar */}
                    <Avatar
                        sx={{ 
                            width: 60, 
                            height: 60,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem'
                        }}
                    >
                        {staff.photo ? (
                            <img 
                                src={staff.photo} 
                                alt={staff.full_name || 'Usuario'} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            staff.first_name?.[0] || staff.full_name?.[0] || '?'
                        )}
                    </Avatar>

                    {/* Info Principal */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                                {staff.full_name || 'Sin nombre'}
                            </Typography>
                            <Chip
                                label={getStatusText(staff.status || 'inactive')}
                                size="small"
                                color={getStatusColor(staff.status || 'inactive')}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                {getStaffTypeIcon(staff.staff_type || '')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                {getStaffTypeText(staff.staff_type || '')}
                            </Typography>
                        </Box>

                        {/* Detalles de contacto */}
                        <Stack direction="row" spacing={3} flexWrap="wrap">
                            {staff.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {staff.email}
                                    </Typography>
                                </Box>
                            )}
                            {staff.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {staff.phone}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>{staff.tasks_today || 0}</strong> tareas hoy
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                    💰
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    S/{staff.daily_rate || 0}/día
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Acciones */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar empleado">
                            <IconButton
                                onClick={() => handleEdit(staff)}
                                sx={{ color: 'primary.main' }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar empleado">
                            <IconButton
                                onClick={() => handleDelete(staff.id)}
                                sx={{ color: 'error.main' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    Cargando personal...
                </Typography>
            </Box>
        )
    }

    if (error) {
        console.error('StaffList API Error:', error)
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Error al cargar personal
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {JSON.stringify(error)}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Gestión de Personal
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {data?.count || 0} empleados registrados
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new staff')}
                        size="large"
                    >
                        Agregar Personal
                    </Button>
                </Box>

                {/* Búsqueda */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar personal por nombre, email o teléfono..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 400 }}
                />
            </Paper>

            {/* Lista de Personal */}
            <Box>
                {(data?.results || []).map((staff) => (
                    <StaffListItem key={staff.id} staff={staff} />
                ))}
            </Box>

            {/* Empty State */}
            {(!data?.results || data.results.length === 0) && !isLoading && (
                <Paper
                    elevation={1}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                    }}
                >
                    <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay personal registrado
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                        {search ? `No se encontraron resultados para "${search}"` : 'Agrega el primer empleado para comenzar la gestión de personal'}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Add new staff')}
                    >
                        Agregar Personal
                    </Button>
                </Paper>
            )}
        </Box>
    )
}