import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import UpcomingCheckinsSubTab from './search-analytics/UpcomingCheckinsSubTab'
import UserSearchersSubTab from './search-analytics/UserSearchersSubTab'
import ConversionOpportunitiesSubTab from './search-analytics/ConversionOpportunitiesSubTab'
import SearchMetricsSubTab from './search-analytics/SearchMetricsSubTab'
import AnalysisConfigSubTab from './search-analytics/AnalysisConfigSubTab'

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