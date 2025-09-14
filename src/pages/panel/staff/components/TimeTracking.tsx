import { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Grid,
} from '@mui/material'
import {
    AccessTime as TimeIcon,
    PlayArrow as CheckInIcon,
    Stop as CheckOutIcon,
} from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useGetAllTimeTrackingQuery, useCreateTimeTrackingMutation } from '@/services/time-tracking/timeTrackingService'
import { TimeTracking as TimeTrackingInterface } from '@/interfaces/staff.interface'

export default function TimeTracking() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [staffFilter, setStaffFilter] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { data, isLoading, refetch } = useGetAllTimeTrackingQuery({
        page: currentPage,
        page_size: pageSize,
        staff_member: staffFilter,
        start_date: startDate,
        end_date: endDate,
    })

    const [createTimeTracking] = useCreateTimeTrackingMutation()

    const handleQuickCheckIn = async () => {
        try {
            const formData = new FormData()
            formData.append('staff_member', 'staff-uuid-placeholder') // TODO: get from authenticated user
            formData.append('building_property', 'property-uuid-placeholder') // TODO: get from selected property
            formData.append('action_type', 'check_in')
            formData.append('latitude', '-12.0464') // TODO: get from geolocation
            formData.append('longitude', '-77.0428') // TODO: get from geolocation
            formData.append('notes', 'Check-in rápido')
            
            await createTimeTracking(formData).unwrap()
            refetch()
        } catch (error) {
            console.error('Error with check-in:', error)
        }
    }

    const handleQuickCheckOut = async () => {
        try {
            const formData = new FormData()
            formData.append('staff_member', 'staff-uuid-placeholder') // TODO: get from authenticated user
            formData.append('building_property', 'property-uuid-placeholder') // TODO: get from selected property
            formData.append('action_type', 'check_out')
            formData.append('latitude', '-12.0464') // TODO: get from geolocation
            formData.append('longitude', '-77.0428') // TODO: get from geolocation
            formData.append('notes', 'Check-out rápido')
            
            await createTimeTracking(formData).unwrap()
            refetch()
        } catch (error) {
            console.error('Error with check-out:', error)
        }
    }

    const getActionTypeText = (type: string) => {
        switch (type) {
            case 'check_in': return 'Entrada'
            case 'check_out': return 'Salida'
            case 'break_start': return 'Inicio Descanso'
            case 'break_end': return 'Fin Descanso'
            default: return type
        }
    }

    const getActionTypeColor = (type: string) => {
        switch (type) {
            case 'check_in': return 'success'
            case 'check_out': return 'error'
            case 'break_start': return 'warning'
            case 'break_end': return 'info'
            default: return 'default'
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'staff_member_name',
            headerName: 'EMPLEADO',
            width: 150,
            sortable: false,
        },
        {
            field: 'property_name',
            headerName: 'PROPIEDAD',
            width: 130,
            sortable: false,
        },
        {
            field: 'action_type',
            headerName: 'ACCIÓN',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={getActionTypeText(params.value)}
                    size="small"
                    color={getActionTypeColor(params.value)}
                />
            ),
        },
        {
            field: 'timestamp',
            headerName: 'FECHA Y HORA',
            width: 180,
            sortable: false,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: 'location_verified',
            headerName: 'UBICACIÓN',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Verificada' : 'No Verificada'}
                    size="small"
                    color={params.value ? 'success' : 'warning'}
                    variant="outlined"
                />
            ),
        },
        {
            field: 'notes',
            headerName: 'NOTAS',
            flex: 1,
            sortable: false,
        },
    ]

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>Cargando registros de tiempo...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Seguimiento de Tiempo ({data?.count || 0} registros)
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <TimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6" gutterBottom>
                                Acciones Rápidas
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckInIcon />}
                                    onClick={handleQuickCheckIn}
                                    size="small"
                                >
                                    Check-In
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CheckOutIcon />}
                                    onClick={handleQuickCheckOut}
                                    size="small"
                                >
                                    Check-Out
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Resumen de Hoy
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Chip label="8 Check-ins" color="success" />
                                <Chip label="6 Check-outs" color="error" />
                                <Chip label="42h trabajadas" color="primary" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Empleado</InputLabel>
                    <Select
                        value={staffFilter}
                        label="Empleado"
                        onChange={(e) => setStaffFilter(e.target.value)}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {/* Aquí se cargarían los empleados dinámicamente */}
                    </Select>
                </FormControl>
                <TextField
                    size="small"
                    type="date"
                    label="Fecha Inicio"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    size="small"
                    type="date"
                    label="Fecha Fin"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>
            
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data?.results || []}
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