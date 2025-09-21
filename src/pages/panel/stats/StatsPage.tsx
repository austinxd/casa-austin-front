import { useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'
import StatsManagement from './components/StatsManagement'
import Stats2Management from './components/Stats2Management'

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
            id={`stats-tabpanel-${index}`}
            aria-labelledby={`stats-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `stats-tab-${index}`,
        'aria-controls': `stats-tabpanel-${index}`,
    }
}

export default function StatsPage() {
    const [value, setValue] = useState(0)

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Estadísticas
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={value} onChange={handleChange} aria-label="stats tabs">
                    <Tab label="Estadísticas Generales" {...a11yProps(0)} />
                    <Tab label="Análisis de Búsquedas" {...a11yProps(1)} />
                </Tabs>
            </Box>
            
            <TabPanel value={value} index={0}>
                <StatsManagement />
            </TabPanel>
            
            <TabPanel value={value} index={1}>
                <Stats2Management />
            </TabPanel>
        </Box>
    )
}