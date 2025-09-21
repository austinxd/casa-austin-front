import { useState } from 'react'
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Typography,
} from '@mui/material'
import {
    BarChart as ReservationsIcon,
    Search as SearchIcon,
    Home as PropertiesIcon,
    People as ClientsIcon,
} from '@mui/icons-material'

// Sub-componentes del centro de analytics
import ReservationsAnalytics from './sub-components/ReservationsAnalytics'
import SearchAnalytics from './sub-components/SearchAnalytics'
import PropertiesAnalytics from './sub-components/PropertiesAnalytics'
import ClientsAnalytics from './sub-components/ClientsAnalytics'

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
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `analytics-tab-${index}`,
        'aria-controls': `analytics-tabpanel-${index}`,
    }
}

export default function AnalyticsCenter() {
    const [selectedTab, setSelectedTab] = useState(0)

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue)
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    📊 Centro de Analytics Detallado
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Análisis profundo con filtros avanzados y múltiples perspectivas
                </Typography>
            </Box>

            {/* Navigation Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={selectedTab} 
                        onChange={handleTabChange} 
                        aria-label="analytics center tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab 
                            icon={<ReservationsIcon />} 
                            label="Reservas & Ingresos" 
                            {...a11yProps(0)} 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<SearchIcon />} 
                            label="Búsquedas & Actividad" 
                            {...a11yProps(1)} 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<PropertiesIcon />} 
                            label="Análisis de Propiedades" 
                            {...a11yProps(2)} 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<ClientsIcon />} 
                            label="Comportamiento de Clientes" 
                            {...a11yProps(3)} 
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ p: 3 }}>
                    <TabPanel value={selectedTab} index={0}>
                        <ReservationsAnalytics />
                    </TabPanel>

                    <TabPanel value={selectedTab} index={1}>
                        <SearchAnalytics />
                    </TabPanel>

                    <TabPanel value={selectedTab} index={2}>
                        <PropertiesAnalytics />
                    </TabPanel>

                    <TabPanel value={selectedTab} index={3}>
                        <ClientsAnalytics />
                    </TabPanel>
                </Box>
            </Paper>
        </Box>
    )
}