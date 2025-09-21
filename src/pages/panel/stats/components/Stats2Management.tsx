import { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Switch,
    FormControlLabel,
} from '@mui/material'
import {
    Person as PersonIcon,
    Computer as ComputerIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    Group as GroupIcon,
    Public as PublicIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams, ClientSearchGroup, IpSearchGroup, FavoriteProperty } from '@/interfaces/stats.interface'

type Order = 'asc' | 'desc'

interface Column {
    id: keyof ClientSearchGroup | keyof IpSearchGroup | 'actions'
    label: string
    minWidth?: number
    align?: 'right' | 'left' | 'center'
}

const clientColumns: readonly Column[] = [
    { id: 'client_name', label: 'Cliente', minWidth: 120 },
    { id: 'client_email', label: 'Email', minWidth: 150 },
    { id: 'total_searches', label: 'Total Búsquedas', minWidth: 100, align: 'center' },
    { id: 'unique_dates_searched', label: 'Fechas Únicas', minWidth: 100, align: 'center' },
    { id: 'favorite_properties', label: 'Propiedades Favoritas', minWidth: 200 },
]

const ipColumns: readonly Column[] = [
    { id: 'ip_address', label: 'IP', minWidth: 120 },
    { id: 'total_searches', label: 'Total Búsquedas', minWidth: 100, align: 'center' },
    { id: 'unique_dates_searched', label: 'Fechas Únicas', minWidth: 100, align: 'center' },
    { id: 'different_devices', label: 'Dispositivos', minWidth: 100, align: 'center' },
    { id: 'favorite_properties', label: 'Propiedades Favoritas', minWidth: 200 },
]

export default function Stats2Management() {
    const [filters, setFilters] = useState<StatsQueryParams>({
        period: 'week',
        date_from: dayjs().subtract(21, 'day').format('YYYY-MM-DD'),
        date_to: dayjs().format('YYYY-MM-DD'),
        include_anonymous: true
    })

    // Estados para las tablas
    const [clientOrder, setClientOrder] = useState<Order>('desc')
    const [clientOrderBy, setClientOrderBy] = useState<keyof ClientSearchGroup>('total_searches')
    const [clientPage, setClientPage] = useState(0)
    const [clientRowsPerPage, setClientRowsPerPage] = useState(10)

    const [ipOrder, setIpOrder] = useState<Order>('desc')
    const [ipOrderBy, setIpOrderBy] = useState<keyof IpSearchGroup>('total_searches')
    const [ipPage, setIpPage] = useState(0)
    const [ipRowsPerPage, setIpRowsPerPage] = useState(10)

    const { data: statsData, isLoading, error, refetch } = useGetStatsQuery(filters)

    const handleFilterChange = (field: keyof StatsQueryParams, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }


    // Funciones de ordenamiento
    const handleClientSort = (property: keyof ClientSearchGroup) => {
        const isAsc = clientOrderBy === property && clientOrder === 'asc'
        setClientOrder(isAsc ? 'desc' : 'asc')
        setClientOrderBy(property)
    }

    const handleIpSort = (property: keyof IpSearchGroup) => {
        const isAsc = ipOrderBy === property && ipOrder === 'asc'
        setIpOrder(isAsc ? 'desc' : 'asc')
        setIpOrderBy(property)
    }

    // Función para ordenar datos
    const sortData = <T extends Record<string, any>>(array: T[], orderBy: keyof T, order: Order): T[] => {
        return array.slice().sort((a, b) => {
            const aVal = a[orderBy]
            const bVal = b[orderBy]
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return order === 'desc' ? bVal - aVal : aVal - bVal
            }
            
            const aStr = String(aVal).toLowerCase()
            const bStr = String(bVal).toLowerCase()
            
            if (order === 'desc') {
                return bStr.localeCompare(aStr)
            }
            return aStr.localeCompare(bStr)
        })
    }

    // Datos ordenados y paginados
    const sortedClients = useMemo(() => {
        if (!statsData?.stats?.search_analytics?.client_search_groups?.top_searching_clients) return []
        return sortData(statsData.stats.search_analytics.client_search_groups.top_searching_clients, clientOrderBy, clientOrder)
    }, [statsData, clientOrderBy, clientOrder])

    const sortedIps = useMemo(() => {
        if (!statsData?.stats?.search_analytics?.ip_search_groups?.top_searching_ips) return []
        return sortData(statsData.stats.search_analytics.ip_search_groups.top_searching_ips, ipOrderBy, ipOrder)
    }, [statsData, ipOrderBy, ipOrder])

    const paginatedClients = sortedClients.slice(
        clientPage * clientRowsPerPage,
        clientPage * clientRowsPerPage + clientRowsPerPage
    )

    const paginatedIps = sortedIps.slice(
        ipPage * ipRowsPerPage,
        ipPage * ipRowsPerPage + ipRowsPerPage
    )

    // Renderizar propiedades favoritas
    const renderFavoriteProperties = (properties: FavoriteProperty[]) => {
        return (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {properties.map((prop, index) => (
                    <Chip
                        key={index}
                        label={`${prop.property__name} (${prop.count})`}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Stack>
        )
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error al cargar el análisis de búsquedas. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SearchIcon />
                    Filtros de Análisis de Búsquedas
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Período</InputLabel>
                            <Select
                                value={filters.period}
                                label="Período"
                                onChange={(e) => handleFilterChange('period', e.target.value)}
                            >
                                <MenuItem value="day">Diario</MenuItem>
                                <MenuItem value="week">Semanal</MenuItem>
                                <MenuItem value="month">Mensual</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Fecha Desde"
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Fecha Hasta"
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filters.include_anonymous}
                                    onChange={(e) => handleFilterChange('include_anonymous', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Incluir Anónimos"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <Button
                            variant="outlined"
                            onClick={() => refetch()}
                            startIcon={<RefreshIcon />}
                            fullWidth
                        >
                            Refrescar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Cards de métricas resumidas */}
            {statsData && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="primary">
                                            {statsData.stats.summary.total_searches.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Búsquedas
                                        </Typography>
                                    </Box>
                                    <SearchIcon color="primary" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="success.main">
                                            {statsData.stats.search_analytics?.client_search_groups?.total_clients_searching || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Clientes Únicos
                                        </Typography>
                                    </Box>
                                    <GroupIcon color="success" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="warning.main">
                                            {statsData.stats.search_analytics?.ip_search_groups?.total_anonymous_ips || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            IPs Anónimas
                                        </Typography>
                                    </Box>
                                    <PublicIcon color="warning" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" color="secondary.main">
                                            {statsData.stats.summary.unique_searchers.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Usuarios
                                        </Typography>
                                    </Box>
                                    <TrendingUpIcon color="secondary" sx={{ fontSize: 40 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tabla de Clientes Registrados */}
            <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="primary" />
                        Clientes Registrados ({sortedClients.length})
                    </Typography>
                </Box>
                
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {clientColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.id !== 'favorite_properties' ? (
                                            <TableSortLabel
                                                active={clientOrderBy === column.id}
                                                direction={clientOrderBy === column.id ? clientOrder : 'asc'}
                                                onClick={() => handleClientSort(column.id as keyof ClientSearchGroup)}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        ) : (
                                            column.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedClients.map((client) => (
                                <TableRow hover key={client.client_id} tabIndex={-1}>
                                    <TableCell>{client.client_name}</TableCell>
                                    <TableCell>{client.client_email}</TableCell>
                                    <TableCell align="center">
                                        <Chip label={client.total_searches} color="primary" size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={client.unique_dates_searched} color="secondary" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        {renderFavoriteProperties(client.favorite_properties)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={sortedClients.length}
                    rowsPerPage={clientRowsPerPage}
                    page={clientPage}
                    onPageChange={(_, newPage) => setClientPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setClientRowsPerPage(parseInt(e.target.value, 10))
                        setClientPage(0)
                    }}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>

            {/* Tabla de Usuarios Anónimos */}
            <Paper>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ComputerIcon color="warning" />
                        Usuarios Anónimos por IP ({sortedIps.length})
                    </Typography>
                </Box>
                
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {ipColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.id !== 'favorite_properties' ? (
                                            <TableSortLabel
                                                active={ipOrderBy === column.id}
                                                direction={ipOrderBy === column.id ? ipOrder : 'asc'}
                                                onClick={() => handleIpSort(column.id as keyof IpSearchGroup)}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        ) : (
                                            column.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedIps.map((ip) => (
                                <TableRow hover key={ip.ip_address} tabIndex={-1}>
                                    <TableCell>
                                        <Chip label={ip.ip_address} variant="outlined" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={ip.total_searches} color="primary" size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={ip.unique_dates_searched} color="secondary" size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={ip.different_devices} color="info" size="small" />
                                    </TableCell>
                                    <TableCell>
                                        {renderFavoriteProperties(ip.favorite_properties)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={sortedIps.length}
                    rowsPerPage={ipRowsPerPage}
                    page={ipPage}
                    onPageChange={(_, newPage) => setIpPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setIpRowsPerPage(parseInt(e.target.value, 10))
                        setIpPage(0)
                    }}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>

            {/* Información del período */}
            {statsData && (
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Período analizado:</strong> {' '}
                        {dayjs(statsData.stats.period_info.start_date).format('DD/MM/YYYY')} - {' '}
                        {dayjs(statsData.stats.period_info.end_date).format('DD/MM/YYYY')} {' '}
                        ({statsData.stats.period_info.days_analyzed} días) | {' '}
                        <strong>Generado:</strong> {dayjs(statsData.generated_at).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}