import { useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'
import Cookies from 'js-cookie'
import StaffList from './components/StaffList'
import TaskManagement from './components/TaskManagement'
import TimeTracking from './components/TimeTracking'
import ScheduleManagement from './components/ScheduleManagement'

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
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default function PersonalManagement() {
    const userRole = Cookies.get('rollTkn') || ''
    const isMaintenanceUser = userRole === 'mantenimiento'
    
    const [value, setValue] = useState(0)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Gestión de Personal
            </Typography>
            
            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                zIndex: (theme) => theme.zIndex.appBar,
                bgcolor: 'background.paper'
            }}>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="staff management tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            minWidth: { xs: 'auto', sm: 160 },
                            px: { xs: 2, sm: 3 },
                        },
                    }}
                >
                    {isMaintenanceUser ? [
                        <Tab key="tareas" label="Tareas" {...a11yProps(0)} />
                    ] : [
                        <Tab key="personal" label="Personal" {...a11yProps(0)} />,
                        <Tab key="tareas" label="Tareas" {...a11yProps(1)} />,
                        <Tab key="tiempo" label="Tiempo" {...a11yProps(2)} />,
                        <Tab key="horarios" label="Horarios" {...a11yProps(3)} />
                    ]}
                </Tabs>
            </Box>
            
            {isMaintenanceUser ? (
                <TabPanel value={value} index={0}>
                    <TaskManagement />
                </TabPanel>
            ) : (
                <>
                    <TabPanel value={value} index={0}>
                        <StaffList />
                    </TabPanel>
                    
                    <TabPanel value={value} index={1}>
                        <TaskManagement />
                    </TabPanel>
                    
                    <TabPanel value={value} index={2}>
                        <TimeTracking />
                    </TabPanel>
                    
                    <TabPanel value={value} index={3}>
                        <ScheduleManagement />
                    </TabPanel>
                </>
            )}
        </Box>
    )
}