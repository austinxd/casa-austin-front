import { useState } from 'react'
import { Box, Tabs, Tab, Typography, Container } from '@mui/material'
import {
    Dashboard as DashboardIcon,
    Analytics as AnalyticsIcon,
    TrendingUp as OpportunitiesIcon,
    Search as SearchIcon,
} from '@mui/icons-material'

// Nuevos componentes principales
import ExecutiveDashboard from './components/executive/ExecutiveDashboard'
import AnalyticsCenter from './components/analytics/AnalyticsCenter'
import OpportunitiesCenter from './components/opportunities/OpportunitiesCenter'
import SearchIntelligenceCenter from './components/search-intelligence/SearchIntelligenceCenter'

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
        id: `stats-tab-${index}`,
        'aria-controls': `stats-tabpanel-${index}`,
    }
}

export default function NewStatsPage() {
    const [selectedTab, setSelectedTab] = useState(0)

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue)
    }

    return (
        <Container maxWidth={false} sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    📊 Casa Austin Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Centro de inteligencia de negocio y análisis de rendimiento
                </Typography>
            </Box>

            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={selectedTab} 
                    onChange={handleTabChange} 
                    aria-label="stats navigation tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab 
                        icon={<DashboardIcon />} 
                        label="Dashboard Ejecutivo" 
                        {...a11yProps(0)} 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<AnalyticsIcon />} 
                        label="Analytics Detallado" 
                        {...a11yProps(1)} 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<OpportunitiesIcon />} 
                        label="Centro de Oportunidades" 
                        {...a11yProps(2)} 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<SearchIcon />} 
                        label="Search Intelligence" 
                        {...a11yProps(3)} 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {/* Tab Content */}
            <TabPanel value={selectedTab} index={0}>
                <ExecutiveDashboard />
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
                <AnalyticsCenter />
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
                <OpportunitiesCenter />
            </TabPanel>

            <TabPanel value={selectedTab} index={3}>
                <SearchIntelligenceCenter />
            </TabPanel>
        </Container>
    )
}