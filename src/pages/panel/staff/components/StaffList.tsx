import { useState } from 'react'
import {
    Box,
    Typography,
    IconButton,
    Chip,
    Avatar,
    Paper,
    TextField,
    InputAdornment,
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
} from '@mui/icons-material'
import ButtonPrimary from '@/components/common/button/ButtonPrimary'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllStaffQuery, useDeleteStaffMutation } from '@/services/staff/staffService'
import { StaffMember } from '@/interfaces/staff.interface'
import StaffAddModal from './StaffAddModal'

export default function StaffList() {
    const [search, setSearch] = useState('')
    const [addModalOpen, setAddModalOpen] = useState(false)

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

    const columns: GridColDef[] = [
        {
            field: 'full_name',
            headerName: 'EMPLEADO',
            flex: 2,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, mr: 2, fontSize: '1rem' }}>
                        {params.row.photo ? (
                            <img 
                                src={params.row.photo} 
                                alt={params.value || 'Usuario'} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            params.row.first_name?.[0] || params.row.full_name?.[0] || '?'
                        )}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                            {params.value || 'Sin nombre'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" sx={{ mr: 0.5 }}>
                                {getStaffTypeIcon(params.row.staff_type || '')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getStaffTypeText(params.row.staff_type || '')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ),
        },
        {
            field: 'contact',
            headerName: 'CONTACTO',
            flex: 2,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ py: 1 }}>
                    {params.row.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" noWrap>
                                {params.row.email}
                            </Typography>
                        </Box>
                    )}
                    {params.row.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {params.row.phone}
                            </Typography>
                        </Box>
                    )}
                    {!params.row.email && !params.row.phone && (
                        <Typography variant="body2" color="text.disabled">
                            Sin contacto
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'ESTADO',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={getStatusText(params.value)}
                    size="small"
                    color={getStatusColor(params.value)}
                    sx={{ 
                        fontWeight: 'medium',
                        minWidth: 80,
                    }}
                />
            ),
        },
        {
            field: 'tasks_today',
            headerName: 'TAREAS HOY',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Chip
                        label={params.value || 0}
                        size="small"
                        color={params.value > 0 ? 'primary' : 'default'}
                        variant="outlined"
                    />
                </Box>
            ),
        },
        {
            field: 'daily_rate',
            headerName: 'TARIFA DIARIA',
            width: 130,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="600" color="success.main">
                    S/{params.value || 0}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar empleado">
                        <IconButton
                            size="small"
                            onClick={() => handleEdit(params.row)}
                            sx={{ 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.50' }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar empleado">
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(params.row.id)}
                            sx={{ 
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.50' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
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
                    Por favor, inicia sesión para ver los datos
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Filtros y Acciones */}
            <Paper elevation={0} sx={{ 
                p: { xs: 1.5, sm: 2 }, 
                mb: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
            }}>
                {/* Fila superior con botones de acción */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 1 }
                }}>
                    <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            fontWeight: 600,
                            order: { xs: 2, sm: 1 }
                        }}
                    >
                        Gestión de Personal:
                    </Typography>
                    
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 1.5,
                        order: { xs: 1, sm: 2 },
                        width: { xs: '100%', sm: 'auto' },
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}>
                        {/* Campo de búsqueda */}
                        <TextField
                            size="small"
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            variant="outlined"
                            sx={{ 
                                minWidth: { xs: '100%', sm: 300 },
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
                        
                        {/* Botón agregar personal */}
                        <ButtonPrimary
                            onClick={() => setAddModalOpen(true)}
                            style={{
                                background: '#0E6191',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '40px',
                                minWidth: '140px',
                                whiteSpace: 'nowrap' as const,
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <AddIcon sx={{ fontSize: 16 }} />
                            Agregar Personal
                        </ButtonPrimary>
                    </Box>
                </Box>
            </Paper>

            {/* Tabla */}
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <DataGrid
                    rows={data?.results || []}
                    columns={columns}
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
                            py: 2,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            px: { xs: 1, sm: 2 },
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f8f9fa',
                            fontWeight: 700,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            borderBottom: '2px solid #e0e0e0',
                            color: '#374151',
                        },
                        '& .MuiDataGrid-row': {
                            minHeight: { xs: '52px', sm: '60px' },
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
                            '& .MuiTablePagination-root': {
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            },
                        },
                        '@media (max-width: 600px)': {
                            '& .MuiDataGrid-columnHeaders': {
                                display: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: '8px',
                                borderBottom: '1px solid #e0e0e0',
                                '&:before': {
                                    content: 'attr(data-field)',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    marginBottom: '4px',
                                },
                            },
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
                    }}
                >
                    <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="600">
                        {search ? 'No se encontraron resultados' : 'No hay personal registrado'}
                    </Typography>
                    <Typography variant="body1" color="text.disabled" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        {search 
                            ? `No se encontraron empleados que coincidan con "${search}"`
                            : 'Agrega el primer empleado para comenzar la gestión de personal'
                        }
                    </Typography>
                    {!search && (
                        <ButtonPrimary
                            onClick={() => setAddModalOpen(true)}
                            style={{
                                background: '#0E6191',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '12px 24px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                minWidth: '180px',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <AddIcon style={{ fontSize: 16 }} />
                            Agregar Primer Empleado
                        </ButtonPrimary>
                    )}
                </Paper>
            )}

            {/* Modal de Agregar Personal */}
            <StaffAddModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onStaffAdded={refetch}
            />
        </Box>
    )
}