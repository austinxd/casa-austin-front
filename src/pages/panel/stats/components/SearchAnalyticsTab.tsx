import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'

import { Typography, Paper, Alert } from '@mui/material'

// Componentes simplificados temporalmente para evitar errores de dependencias
const UpcomingCheckinsSubTab = () => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Check-ins Próximos</Typography>
        <Alert severity="info">
            Esta sección está en desarrollo. Aquí se mostrarán los próximos check-ins con demanda alta.
        </Alert>
    </Paper>
)

const UserSearchersSubTab = () => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Usuarios Buscadores</Typography>
        <Alert severity="info">
            Esta sección está en desarrollo. Aquí se mostrarán los usuarios que buscan propiedades activamente.
        </Alert>
    </Paper>
)

const ConversionOpportunitiesSubTab = () => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Oportunidades de Conversión</Typography>
        <Alert severity="info">
            Esta sección está en desarrollo. Aquí se mostrarán oportunidades para convertir búsquedas en reservas.
        </Alert>
    </Paper>
)

const SearchMetricsSubTab = () => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Métricas de Búsqueda</Typography>
        <Alert severity="info">
            Esta sección está en desarrollo. Aquí se mostrarán métricas detalladas de patrones de búsqueda.
        </Alert>
    </Paper>
)

const AnalysisConfigSubTab = () => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Configuración de Análisis</Typography>
        <Alert severity="info">
            Esta sección está en desarrollo. Aquí se podrán configurar parámetros de análisis.
        </Alert>
    </Paper>
)

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
            id={`search-tabpanel-${index}`}
            aria-labelledby={`search-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `search-tab-${index}`,
        'aria-controls': `search-tabpanel-${index}`,
    }
}

export default function SearchAnalyticsTab() {
    const [value, setValue] = useState(0)

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="search analytics tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="📅 Check-ins Próximos" {...a11yProps(0)} />
                    <Tab label="👤 Usuarios Buscadores" {...a11yProps(1)} />
                    <Tab label="🎯 Oportunidades" {...a11yProps(2)} />
                    <Tab label="📊 Métricas" {...a11yProps(3)} />
                    <Tab label="⚙️ Configuración" {...a11yProps(4)} />
                </Tabs>
            </Box>
            
            <TabPanel value={value} index={0}>
                <UpcomingCheckinsSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={1}>
                <UserSearchersSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={2}>
                <ConversionOpportunitiesSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={3}>
                <SearchMetricsSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={4}>
                <AnalysisConfigSubTab />
            </TabPanel>
        </Box>
    )
}