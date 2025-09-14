import { Box, Typography } from '@mui/material'
import { useGetStaffDashboardQuery } from '@/services/staff/staffService'

export default function StaffDashboard() {
    const { data, isLoading } = useGetStaffDashboardQuery()

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Cargando dashboard...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" mb={3}>
                Dashboard de Personal
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="h6">Total Personal</Typography>
                    <Typography variant="h4">{data?.total_staff || 0}</Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="h6">Personal Activo</Typography>
                    <Typography variant="h4">{data?.active_staff || 0}</Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="h6">Tareas Hoy</Typography>
                    <Typography variant="h4">{data?.tasks_today || 0}</Typography>
                </Box>
                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Typography variant="h6">Tareas Completadas</Typography>
                    <Typography variant="h4">{data?.completed_tasks || 0}</Typography>
                </Box>
            </Box>
        </Box>
    )
}