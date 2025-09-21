import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import ReservationMetricsSubTab from './general-stats/ReservationMetricsSubTab'
import PropertyAnalysisSubTab from './general-stats/PropertyAnalysisSubTab'
import ClientBehaviorSubTab from './general-stats/ClientBehaviorSubTab'
import FinancialAnalysisSubTab from './general-stats/FinancialAnalysisSubTab'

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
            id={`general-tabpanel-${index}`}
            aria-labelledby={`general-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `general-tab-${index}`,
        'aria-controls': `general-tabpanel-${index}`,
    }
}

export default function GeneralStatsTab() {
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
                    aria-label="general stats tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="📈 Métricas de Reservas" {...a11yProps(0)} />
                    <Tab label="🏠 Análisis por Propiedades" {...a11yProps(1)} />
                    <Tab label="👥 Comportamiento de Clientes" {...a11yProps(2)} />
                    <Tab label="💰 Análisis Financiero" {...a11yProps(3)} />
                </Tabs>
            </Box>
            
            <TabPanel value={value} index={0}>
                <ReservationMetricsSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={1}>
                <PropertyAnalysisSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={2}>
                <ClientBehaviorSubTab />
            </TabPanel>
            
            <TabPanel value={value} index={3}>
                <FinancialAnalysisSubTab />
            </TabPanel>
        </Box>
    )
}