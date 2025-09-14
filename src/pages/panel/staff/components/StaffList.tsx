import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllStaffQuery, useDeleteStaffMutation } from '@/services/staff/staffService'
import { StaffMember } from '@/interfaces/staff.interface'

export default function StaffList() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')

    const { data, isLoading, refetch } = useGetAllStaffQuery({
        page: currentPage,
        page_size: pageSize,
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
            case 'cleaner': return 'Limpieza'
            case 'maintenance': return 'Mantenimiento'
            case 'supervisor': return 'Supervisor'
            case 'admin': return 'Administrador'
            default: return type
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'full_name',
            headerName: 'NOMBRE COMPLETO',
            flex: 1,
            sortable: false,
        },
        {
            field: 'email',
            headerName: 'EMAIL',
            flex: 1,
            sortable: false,
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
            renderCell: (params) => `$${params.value || 0}`,
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        sx={{ color: 'primary.main' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                        sx={{ color: 'error.main' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ]

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Cargando personal...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Personal ({data?.length || 0} empleados)
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => console.log('Add new staff')}
                >
                    Agregar Personal
                </Button>
            </Box>
            
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data || []}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: pageSize },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f0f0f0',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f8f9fa',
                            fontWeight: 600,
                        },
                    }}
                />
            </Box>
        </Box>
    )
}