import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useGetAllTasksQuery } from '@/services/tasks/tasksService'

export default function CrudTasks() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')

    const { data, isLoading, refetch } = useGetAllTasksQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
    })

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Cargando tareas...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" mb={3}>
                Gestión de Tareas
            </Typography>
            <Typography>
                Tareas registradas: {data?.count || 0}
            </Typography>
            {/* Componentes de tareas se implementarán en las siguientes tareas */}
        </Box>
    )
}