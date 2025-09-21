import { useState } from 'react'
import {
    Box,
    Container,
    Typography,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Stack,
    useTheme,
    useMediaQuery,
    Chip,
} from '@mui/material'
import {
    Search as SearchIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    DateRange as DateRangeIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'

// Componentes de dashboard
import SearchDashboard from '@/pages/panel/stats/components/analytics/SearchDashboard'
import IngresosDashboard from '@/pages/panel/stats/components/analytics/IngresosDashboard'
import CheckinsDashboard from '@/pages/panel/stats/components/analytics/CheckinsDashboard'

// Interfaces
import { GlobalFilters, FilterPreset } from '@/interfaces/analytics.interface'

const DRAWER_WIDTH = 280

const filterPresets: FilterPreset[] = [
    { label: 'Últimos 7 días', days: 7, value: '7d' },
    { label: 'Últimos 30 días', days: 30, value: '30d' },
    { label: 'Últimos 90 días', days: 90, value: '90d' },
    { label: 'Personalizado', days: 0, value: 'custom' },
]

export default function StatsPage() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    
    const [selectedDashboard, setSelectedDashboard] = useState<'search' | 'ingresos' | 'checkins'>('search')
    const [mobileOpen, setMobileOpen] = useState(false)
    
    // Filtros globales
    const [globalFilters, setGlobalFilters] = useState<GlobalFilters>({
        dateRange: {
            date_from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
            date_to: dayjs().format('YYYY-MM-DD')
        },
        preset: '30d',
        includeClients: true,
        includeAnonymous: true,
        period: 'week',
        currency: 'PEN',
        limit: 20,
        daysAhead: 60
    })

    const handlePresetChange = (preset: string) => {
        setGlobalFilters(prev => {
            const selectedPreset = filterPresets.find(p => p.value === preset)
            if (selectedPreset && selectedPreset.days > 0) {
                return {
                    ...prev,
                    preset,
                    dateRange: {
                        date_from: dayjs().subtract(selectedPreset.days, 'day').format('YYYY-MM-DD'),
                        date_to: dayjs().format('YYYY-MM-DD')
                    }
                }
            }
            return { ...prev, preset }
        })
    }

    const handleDateChange = (field: 'date_from' | 'date_to', value: string) => {
        setGlobalFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value
            },
            preset: 'custom'
        }))
    }

    const handleFilterChange = <K extends keyof GlobalFilters>(
        field: K,
        value: GlobalFilters[K]
    ) => {
        setGlobalFilters(prev => ({ ...prev, [field]: value }))
    }

    const navigation = [
        {
            id: 'search',
            label: 'Análisis de Búsquedas',
            icon: <SearchIcon />,
            description: 'Tracking de búsquedas y conversión'
        },
        {
            id: 'ingresos',
            label: 'Análisis de Ingresos',
            icon: <MoneyIcon />,
            description: 'Revenue, precios y crecimiento'
        },
        {
            id: 'checkins',
            label: 'Check-ins Próximos',
            icon: <CalendarIcon />,
            description: 'Demanda y fechas trending'
        }
    ]

    const renderFilters = () => (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon />
                    Filtros Globales
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* Preset de fechas */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Período</InputLabel>
                        <Select
                            value={globalFilters.preset}
                            label="Período"
                            onChange={(e) => handlePresetChange(e.target.value)}
                        >
                            {filterPresets.map(preset => (
                                <MenuItem key={preset.value} value={preset.value}>
                                    {preset.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Fecha desde */}
                    <TextField
                        size="small"
                        label="Desde"
                        type="date"
                        value={globalFilters.dateRange.date_from}
                        onChange={(e) => handleDateChange('date_from', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150 }}
                    />

                    {/* Fecha hasta */}
                    <TextField
                        size="small"
                        label="Hasta"
                        type="date"
                        value={globalFilters.dateRange.date_to}
                        onChange={(e) => handleDateChange('date_to', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 150 }}
                    />

                    {/* Botón refrescar */}
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => window.location.reload()}
                    >
                        Refrescar
                    </Button>
                </Stack>

                {/* Chips de filtros específicos */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                        label={`Clientes: ${globalFilters.includeClients ? 'Incluir' : 'Excluir'}`}
                        color={globalFilters.includeClients ? 'primary' : 'default'}
                        variant={globalFilters.includeClients ? 'filled' : 'outlined'}
                        onClick={() => handleFilterChange('includeClients', !globalFilters.includeClients)}
                        size="small"
                    />
                    <Chip
                        label={`Anónimos: ${globalFilters.includeAnonymous ? 'Incluir' : 'Excluir'}`}
                        color={globalFilters.includeAnonymous ? 'primary' : 'default'}
                        variant={globalFilters.includeAnonymous ? 'filled' : 'outlined'}
                        onClick={() => handleFilterChange('includeAnonymous', !globalFilters.includeAnonymous)}
                        size="small"
                    />
                    <Chip
                        label={`Moneda: ${globalFilters.currency}`}
                        color="info"
                        variant="outlined"
                        onClick={() => handleFilterChange('currency', globalFilters.currency === 'PEN' ? 'USD' : 'PEN')}
                        size="small"
                    />
                    <Chip
                        label={`Período: ${globalFilters.period}`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                    />
                </Stack>
            </Stack>
        </Paper>
    )

    const renderSidebar = () => (
        <List>
            {navigation.map((item) => (
                <ListItem key={item.id} disablePadding>
                    <ListItemButton
                        selected={selectedDashboard === item.id}
                        onClick={() => {
                            setSelectedDashboard(item.id as typeof selectedDashboard)
                            if (isMobile) setMobileOpen(false)
                        }}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.light,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.light,
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: selectedDashboard === item.id ? theme.palette.primary.main : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            secondary={item.description}
                            primaryTypographyProps={{
                                fontWeight: selectedDashboard === item.id ? 'bold' : 'normal',
                                color: selectedDashboard === item.id ? theme.palette.primary.main : 'inherit'
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )

    const renderDashboard = () => {
        switch (selectedDashboard) {
            case 'search':
                return <SearchDashboard filters={globalFilters} />
            case 'ingresos':
                return <IngresosDashboard filters={globalFilters} />
            case 'checkins':
                return <CheckinsDashboard filters={globalFilters} />
            default:
                return <SearchDashboard filters={globalFilters} />
        }
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            position: 'relative',
                            height: '100%'
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                            📊 Casa Austin Analytics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Dashboard de análisis de negocio
                        </Typography>
                    </Box>
                    {renderSidebar()}
                </Drawer>
            </Box>

            {/* Contenido principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    height: '100vh',
                    overflow: 'auto'
                }}
            >
                <Container maxWidth={false} sx={{ py: 3 }}>
                    {/* Header */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {navigation.find(nav => nav.id === selectedDashboard)?.label}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {navigation.find(nav => nav.id === selectedDashboard)?.description}
                        </Typography>
                    </Box>

                    {/* Filtros globales */}
                    {renderFilters()}

                    {/* Dashboard específico */}
                    {renderDashboard()}
                </Container>
            </Box>
        </Box>
    )
}