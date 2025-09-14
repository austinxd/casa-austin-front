import { useState } from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'
import { useGetAllStaffQuery } from '@/services/staff/staffService'
import { useGetAllTasksQuery } from '@/services/tasks/tasksService'
import { useGetAllTimeTrackingQuery } from '@/services/time-tracking/timeTrackingService'
import { useGetAllSchedulesQuery } from '@/services/schedules/schedulesService'

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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    // API calls for different sections
    const { data: staffData, isLoading: staffLoading } = useGetAllStaffQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
    })

    const { data: tasksData, isLoading: tasksLoading } = useGetAllTasksQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
    })

    const { data: timeData, isLoading: timeLoading } = useGetAllTimeTrackingQuery({
        page: currentPage,
        page_size: pageSize,
    })

    const { data: schedulesData, isLoading: schedulesLoading } = useGetAllSchedulesQuery({
        page: currentPage,
        page_size: pageSize,
    })

    return (
        <Box sx={{ width: '100%', p: 3 }}>
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
                <Typography variant="h5" mb={2}>Lista de Personal</Typography>
                {staffLoading ? (
                    <Typography>Cargando personal...</Typography>
                ) : (
                    <Box>
                        <Typography>Total empleados: {staffData?.count || 0}</Typography>
                        {/* Aquí irá el componente completo de staff */}
                        <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                            {JSON.stringify(staffData, null, 2)}
                        </pre>
                    </Box>
                )}
            </TabPanel>
            
            <TabPanel value={value} index={1}>
                <Typography variant="h5" mb={2}>Gestión de Tareas</Typography>
                {tasksLoading ? (
                    <Typography>Cargando tareas...</Typography>
                ) : (
                    <Box>
                        <Typography>Total tareas: {tasksData?.count || 0}</Typography>
                        {/* Aquí irá el componente completo de tareas */}
                        <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                            {JSON.stringify(tasksData, null, 2)}
                        </pre>
                    </Box>
                )}
            </TabPanel>
            
            <TabPanel value={value} index={2}>
                <Typography variant="h5" mb={2}>Seguimiento de Tiempo</Typography>
                {timeLoading ? (
                    <Typography>Cargando registros de tiempo...</Typography>
                ) : (
                    <Box>
                        <Typography>Total registros: {timeData?.count || 0}</Typography>
                        {/* Aquí irá el componente completo de tiempo */}
                        <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                            {JSON.stringify(timeData, null, 2)}
                        </pre>
                    </Box>
                )}
            </TabPanel>
            
            <TabPanel value={value} index={3}>
                <Typography variant="h5" mb={2}>Gestión de Horarios</Typography>
                {schedulesLoading ? (
                    <Typography>Cargando horarios...</Typography>
                ) : (
                    <Box>
                        <Typography>Total horarios: {schedulesData?.count || 0}</Typography>
                        {/* Aquí irá el componente completo de horarios */}
                        <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                            {JSON.stringify(schedulesData, null, 2)}
                        </pre>
                    </Box>
                )}
            </TabPanel>
        </Box>
    )
}