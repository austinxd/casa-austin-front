import { useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'
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
    const [value, setValue] = useState(0)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h1" mb={3}>
                Gestión de Personal
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="staff management tabs">
                    <Tab label="Personal" {...a11yProps(0)} />
                    <Tab label="Tareas" {...a11yProps(1)} />
                    <Tab label="Tiempo" {...a11yProps(2)} />
                    <Tab label="Horarios" {...a11yProps(3)} />
                </Tabs>
            </Box>
            
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
        </Box>
    )
}