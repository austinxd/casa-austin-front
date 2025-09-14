import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useGetAllStaffQuery } from '@/services/staff/staffService'

export default function CrudStaff() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')

    const { data, isLoading, refetch } = useGetAllStaffQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
    })

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Cargando personal...</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" mb={3}>
                Gestión de Personal
            </Typography>
            <Typography>
                Personal registrado: {data?.count || 0}
            </Typography>
            {/* Componentes de staff se implementarán en las siguientes tareas */}
        </Box>
    )
}