import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useGetAllTimeTrackingQuery } from '@/services/time-tracking/timeTrackingService'

export default function CrudTimeTracking() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { data, isLoading } = useGetAllTimeTrackingQuery({
        page: currentPage,
        page_size: pageSize,
    })

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Cargando registros de tiempo...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" mb={3}>
                Seguimiento de Tiempo
            </Typography>
            <Typography>
                Registros de tiempo: {data?.count || 0}
            </Typography>
            {/* Componentes de tiempo se implementarán en las siguientes tareas */}
        </Box>
    )
}