import { useState } from 'react'
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Stack,
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

const filterPresets: FilterPreset[] = [
    { label: 'Últimos 7 días', days: 7, value: '7d' },
    { label: 'Últimos 30 días', days: 30, value: '30d' },
    { label: 'Últimos 90 días', days: 90, value: '90d' },
    { label: 'Personalizado', days: 0, value: 'custom' },
]

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`analytics-tabpanel-${index}`}
            aria-labelledby={`analytics-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `analytics-tab-${index}`,
        'aria-controls': `analytics-tabpanel-${index}`,
    }
}

export default function StatsPage() {
    const [selectedTab, setSelectedTab] = useState(0)
    
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

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue)
    }

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


    return (
        <Container maxWidth={false} sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    📊 Casa Austin Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Dashboard de análisis de negocio y métricas de rendimiento
                </Typography>
            </Box>

            {/* Filtros globales */}
            {renderFilters()}

            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={selectedTab} 
                    onChange={handleTabChange} 
                    aria-label="analytics tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab 
                        icon={<SearchIcon />} 
                        label="Análisis de Búsquedas" 
                        {...a11yProps(0)} 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<MoneyIcon />} 
                        label="Análisis de Ingresos" 
                        {...a11yProps(1)} 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<CalendarIcon />} 
                        label="Check-ins Próximos" 
                        {...a11yProps(2)} 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {/* Tab Content */}
            <TabPanel value={selectedTab} index={0}>
                <SearchDashboard filters={globalFilters} />
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
                <IngresosDashboard year={new Date().getFullYear()} />
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
                <CheckinsDashboard filters={globalFilters} />
            </TabPanel>
        </Container>
    )
}