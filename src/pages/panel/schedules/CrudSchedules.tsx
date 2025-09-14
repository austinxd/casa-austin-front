import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useGetAllSchedulesQuery } from '@/services/schedules/schedulesService'

export default function CrudSchedules() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { data, isLoading } = useGetAllSchedulesQuery({
        page: currentPage,
        page_size: pageSize,
    })

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Cargando horarios...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" mb={3}>
                Gestión de Horarios
            </Typography>
            <Typography>
                Horarios programados: {data?.count || 0}
            </Typography>
            {/* Componentes de horarios se implementarán en las siguientes tareas */}
        </Box>
    )
}