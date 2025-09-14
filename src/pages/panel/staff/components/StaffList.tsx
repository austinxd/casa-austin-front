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
    Grid,
    Paper,
    Stack,
    Divider,
    TextField,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    GridView as CardViewIcon,
    TableRows as TableViewIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Work as WorkIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllStaffQuery, useDeleteStaffMutation } from '@/services/staff/staffService'
import { StaffMember } from '@/interfaces/staff.interface'

export default function StaffList() {
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
    const [search, setSearch] = useState('')

    const { data, isLoading, error, refetch } = useGetAllStaffQuery({
        page: 1,
        page_size: 50,
        search: search,
    })

    const [deleteStaff] = useDeleteStaffMutation()

    const handleEdit = (staff: StaffMember) => {
        console.log('Edit staff:', staff)
        // Modal de edición se implementará
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

    const StaffCard = ({ staff }: { staff: StaffMember }) => (
        <Card 
            elevation={2}
            sx={{ 
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                        sx={{ 
                            width: 56, 
                            height: 56, 
                            mr: 2,
                            bgcolor: 'primary.main',
                            fontSize: '1.5rem'
                        }}
                    >
                        {staff.photo ? (
                            <img src={staff.photo} alt={staff.full_name || 'Usuario'} />
                        ) : (
                            staff.first_name?.[0] || staff.full_name?.[0] || '?'
                        )}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" noWrap>
                            {staff.full_name || 'Sin nombre'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                {getStaffTypeIcon(staff.staff_type || '')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {getStaffTypeText(staff.staff_type || '')}
                            </Typography>
                        </Box>
                        <Chip
                            label={getStatusText(staff.status || 'inactive')}
                            size="small"
                            color={getStatusColor(staff.status || 'inactive')}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5}>
                    {staff.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" noWrap>
                                {staff.email}
                            </Typography>
                        </Box>
                    )}
                    {staff.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                {staff.phone}
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                            <strong>{staff.tasks_today || 0}</strong> tareas hoy
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            💰
                        </Typography>
                        <Typography variant="body2">
                            S/{staff.daily_rate || 0}/día
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(staff)}
                        sx={{ flex: 1 }}
                    >
                        Editar
                    </Button>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(staff.id)}
                        sx={{ color: 'error.main' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    )

    const columns: GridColDef[] = [
        {
            field: 'full_name',
            headerName: 'NOMBRE COMPLETO',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: '0.875rem' }}>
                        {params.row.photo ? (
                            <img src={params.row.photo} alt={params.value || 'Usuario'} />
                        ) : (
                            params.row.first_name?.[0] || params.row.full_name?.[0] || '?'
                        )}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                        {params.value || 'Sin nombre'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'email',
            headerName: 'EMAIL',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary">
                    {params.value || 'Sin email'}
                </Typography>
            ),
        },
        {
            field: 'phone',
            headerName: 'TELÉFONO',
            width: 130,
            sortable: false,
        },
        {
            field: 'staff_type',
            headerName: 'TIPO',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={getStaffTypeText(params.value)}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'ESTADO',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={getStatusText(params.value)}
                    size="small"
                    color={getStatusColor(params.value)}
                />
            ),
        },
        {
            field: 'tasks_today',
            headerName: 'TAREAS HOY',
            width: 110,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'daily_rate',
            headerName: 'TARIFA DIARIA',
            width: 120,
            sortable: false,
            renderCell: (params) => `S/${params.value || 0}`,
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            onClick={() => handleEdit(params.row)}
                            sx={{ color: 'primary.main' }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(params.row.id)}
                            sx={{ color: 'error.main' }}
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

                {/* Filters and View Toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Buscar personal..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />

                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newView) => newView && setViewMode(newView)}
                        size="small"
                    >
                        <ToggleButton value="cards">
                            <CardViewIcon sx={{ mr: 1 }} />
                            Cards
                        </ToggleButton>
                        <ToggleButton value="table">
                            <TableViewIcon sx={{ mr: 1 }} />
                            Tabla
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            {/* Content */}
            {viewMode === 'cards' ? (
                <Grid container spacing={3}>
                    {(data?.results || []).map((staff) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={staff.id}>
                            <StaffCard staff={staff} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper elevation={1} sx={{ height: 600, width: '100%' }}>
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
                        density="compact"
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f0f0f0',
                                py: 1,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f8f9fa',
                                fontWeight: 600,
                                borderBottom: '2px solid #e0e0e0',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    />
                </Paper>
            )}

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
                        Agrega el primer empleado para comenzar la gestión de personal
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