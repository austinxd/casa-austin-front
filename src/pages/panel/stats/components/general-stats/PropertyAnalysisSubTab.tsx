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
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Chip,
} from '@mui/material'
import {
    Home as HomeIcon,
    AttachMoney as MoneyIcon,
    Hotel as HotelIcon,
    TrendingUp as TrendingUpIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useGetStatsQuery } from '@/services/stats/statsService'
import { StatsQueryParams, PropertyBreakdown } from '@/interfaces/stats.interface'

type Order = 'asc' | 'desc'
type OrderBy = keyof PropertyBreakdown

export default function PropertyAnalysisSubTab() {
    const [filters, setFilters] = useState<StatsQueryParams>({
        period: 'week',
        date_from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        date_to: dayjs().format('YYYY-MM-DD'),
        include_anonymous: true
    })
    
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<OrderBy>('total_revenue')

    const { data: statsData, isLoading, error, refetch } = useGetStatsQuery(filters)

    const handleFilterChange = (field: keyof StatsQueryParams, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    const handleSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    // Datos ordenados
    const sortedProperties = useMemo(() => {
        if (!statsData?.stats?.properties_breakdown) return []
        
        return statsData.stats.properties_breakdown.slice().sort((a, b) => {
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
    }, [statsData, orderBy, order])

    // Configuración del gráfico de barras comparativo
    const propertyComparisonOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 400
        },
        xaxis: {
            categories: sortedProperties.map(prop => prop.property_name)
        },
        title: {
            text: 'Comparativa de Rendimiento por Propiedad',
            align: 'center'
        },
        colors: ['#0E6191', '#28a745', '#ffc107'],
        dataLabels: { enabled: true },
        legend: { position: 'top' }
    }

    const propertyComparisonSeries = [
        {
            name: 'Ingresos ($)',
            data: sortedProperties.map(prop => prop.total_revenue)
        },
        {
            name: 'Reservas',
            data: sortedProperties.map(prop => prop.total_reservations)
        },
        {
            name: 'Ocupación (%)',
            data: sortedProperties.map(prop => prop.occupancy_rate)
        }
    ]

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
                Error al cargar el análisis de propiedades. Por favor intenta nuevamente.
            </Alert>
        )
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon />
                    Filtros de Análisis
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
                    
                    <Grid item xs={12} sm={6} md={3}>
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
                    
                    <Grid item xs={12} sm={6} md={3}>
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

            {/* Top 3 propiedades */}
            {sortedProperties.length > 0 && (
                <Grid container spacing={2} mb={3}>
                    {sortedProperties.slice(0, 3).map((property, index) => {
                        const colors = ['primary', 'success', 'warning'] as const
                        const icons = [TrendingUpIcon, MoneyIcon, HotelIcon]
                        const IconComponent = icons[index] || HomeIcon
                        
                        return (
                            <Grid item xs={12} md={4} key={property.property_name}>
                                <Card sx={{ position: 'relative' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="h6" color={`${colors[index]}.main`} noWrap>
                                                    {property.property_name}
                                                </Typography>
                                                <Typography variant="h4" color={`${colors[index]}.main`}>
                                                    ${property.total_revenue.toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {property.total_reservations} reservas | {property.occupancy_rate.toFixed(1)}% ocupación
                                                </Typography>
                                            </Box>
                                            <IconComponent color={colors[index]} sx={{ fontSize: 40 }} />
                                        </Stack>
                                        <Chip 
                                            label={`#${index + 1}`} 
                                            color={colors[index]} 
                                            size="small" 
                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            )}

            {/* Gráfico comparativo */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Chart
                    options={propertyComparisonOptions}
                    series={propertyComparisonSeries}
                    type="bar"
                    height={400}
                />
            </Paper>

            {/* Tabla detallada */}
            <Paper>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HomeIcon color="primary" />
                        Ranking Detallado de Propiedades ({sortedProperties.length})
                    </Typography>
                </Box>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'property_name'}
                                        direction={orderBy === 'property_name' ? order : 'asc'}
                                        onClick={() => handleSort('property_name')}
                                    >
                                        Propiedad
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={orderBy === 'total_revenue'}
                                        direction={orderBy === 'total_revenue' ? order : 'asc'}
                                        onClick={() => handleSort('total_revenue')}
                                    >
                                        Ingresos Totales
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={orderBy === 'total_reservations'}
                                        direction={orderBy === 'total_reservations' ? order : 'asc'}
                                        onClick={() => handleSort('total_reservations')}
                                    >
                                        Reservas
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={orderBy === 'occupancy_rate'}
                                        direction={orderBy === 'occupancy_rate' ? order : 'asc'}
                                        onClick={() => handleSort('occupancy_rate')}
                                    >
                                        Ocupación (%)
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={orderBy === 'average_price'}
                                        direction={orderBy === 'average_price' ? order : 'asc'}
                                        onClick={() => handleSort('average_price')}
                                    >
                                        Precio Promedio
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={orderBy === 'total_nights'}
                                        direction={orderBy === 'total_nights' ? order : 'asc'}
                                        onClick={() => handleSort('total_nights')}
                                    >
                                        Noches Reservadas
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProperties.map((property, index) => (
                                <TableRow key={property.property_name} hover>
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Chip 
                                                label={index + 1} 
                                                size="small" 
                                                color={index < 3 ? "primary" : "default"}
                                            />
                                            <Typography variant="body2" fontWeight="medium">
                                                {property.property_name}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" color="success.main" fontWeight="bold">
                                            ${property.total_revenue.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={property.total_reservations} color="primary" size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={`${property.occupancy_rate.toFixed(1)}%`} 
                                            color={property.occupancy_rate > 70 ? "success" : property.occupancy_rate > 50 ? "warning" : "error"} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">
                                            ${property.average_price.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">
                                            {property.total_nights}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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