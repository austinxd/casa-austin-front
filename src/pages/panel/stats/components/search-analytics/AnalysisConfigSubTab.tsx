import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Stack,
    Slider,
    Switch,
    FormControlLabel,
    Alert,
} from '@mui/material'
import {
    Settings as SettingsIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Share as ShareIcon,
    Visibility as VisibilityIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGetUpcomingCheckinsQuery } from '@/services/upcoming-checkins/upcomingCheckinsService'
import { UpcomingCheckinsParams } from '@/interfaces/analytics.interface'

interface AnalysisConfig {
    temporal_filters: {
        days_ahead: number
        limit: number
        include_anonymous: boolean
    }
    visualization_options: {
        grouping: 'daily' | 'weekly'
        sorting: 'popularity' | 'proximity' | 'alphabetical'
        detail_level: 'summary' | 'complete'
    }
    export_settings: {
        format: 'excel' | 'csv' | 'pdf'
        include_raw_data: boolean
        include_charts: boolean
    }
    schedule_reports: {
        enabled: boolean
        frequency: 'daily' | 'weekly' | 'monthly'
        recipients: string[]
    }
}

export default function AnalysisConfigSubTab() {
    const [config, setConfig] = useState<AnalysisConfig>({
        temporal_filters: {
            days_ahead: 60,
            limit: 20,
            include_anonymous: true
        },
        visualization_options: {
            grouping: 'daily',
            sorting: 'popularity',
            detail_level: 'complete'
        },
        export_settings: {
            format: 'excel',
            include_raw_data: true,
            include_charts: true
        },
        schedule_reports: {
            enabled: false,
            frequency: 'weekly',
            recipients: []
        }
    })

    const [testFilters, setTestFilters] = useState<UpcomingCheckinsParams>(config.temporal_filters)
    
    const { data: testData, isLoading, error, refetch } = useGetUpcomingCheckinsQuery(testFilters)

    const handleConfigChange = (section: keyof AnalysisConfig, field: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const applyFilters = () => {
        setTestFilters(config.temporal_filters)
        refetch()
    }

    const saveConfiguration = () => {
        // Aquí se guardarían las configuraciones en localStorage o backend
        localStorage.setItem('analytics_config', JSON.stringify(config))
        alert('Configuración guardada exitosamente')
    }

    const exportData = () => {
        if (!testData) {
            alert('No hay datos para exportar')
            return
        }
        
        // Simular descarga de datos
        const dataToExport = {
            config: config.export_settings,
            data: testData,
            generated_at: new Date().toISOString()
        }
        
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics_export_${dayjs().format('YYYY-MM-DD_HH-mm')}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const generateShareableLink = () => {
        const params = new URLSearchParams({
            days_ahead: config.temporal_filters.days_ahead.toString(),
            limit: config.temporal_filters.limit.toString(),
            include_anonymous: config.temporal_filters.include_anonymous.toString(),
            grouping: config.visualization_options.grouping,
            sorting: config.visualization_options.sorting
        })
        
        const shareUrl = `${window.location.origin}/panel/stats?${params.toString()}`
        navigator.clipboard.writeText(shareUrl)
        alert('URL compartible copiada al portapapeles')
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon />
                    Configuración de Análisis
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    Personaliza los parámetros de análisis, visualización y exportación de datos
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {/* Filtros Temporales */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilterIcon />
                            Filtros Temporales
                        </Typography>
                        
                        <Stack spacing={3}>
                            <Box>
                                <Typography gutterBottom>
                                    Días hacia adelante: {config.temporal_filters.days_ahead}
                                </Typography>
                                <Slider
                                    value={config.temporal_filters.days_ahead}
                                    onChange={(_, value) => handleConfigChange('temporal_filters', 'days_ahead', value)}
                                    min={1}
                                    max={180}
                                    step={1}
                                    marks={[
                                        { value: 7, label: '1 sem' },
                                        { value: 30, label: '1 mes' },
                                        { value: 60, label: '2 meses' },
                                        { value: 90, label: '3 meses' },
                                        { value: 180, label: '6 meses' }
                                    ]}
                                />
                            </Box>
                            
                            <Box>
                                <Typography gutterBottom>
                                    Límite de resultados: {config.temporal_filters.limit}
                                </Typography>
                                <Slider
                                    value={config.temporal_filters.limit}
                                    onChange={(_, value) => handleConfigChange('temporal_filters', 'limit', value)}
                                    min={1}
                                    max={100}
                                    step={5}
                                    marks={[
                                        { value: 5, label: '5' },
                                        { value: 20, label: '20' },
                                        { value: 50, label: '50' },
                                        { value: 100, label: '100' }
                                    ]}
                                />
                            </Box>
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={config.temporal_filters.include_anonymous}
                                        onChange={(e) => handleConfigChange('temporal_filters', 'include_anonymous', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Incluir búsquedas anónimas en el análisis"
                            />
                        </Stack>
                        
                        <Box mt={3}>
                            <Button
                                variant="contained"
                                onClick={applyFilters}
                                startIcon={<RefreshIcon />}
                                fullWidth
                            >
                                Probar Configuración
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Opciones de Visualización */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VisibilityIcon />
                            Opciones de Visualización
                        </Typography>
                        
                        <Stack spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Agrupación Temporal</InputLabel>
                                <Select
                                    value={config.visualization_options.grouping}
                                    label="Agrupación Temporal"
                                    onChange={(e) => handleConfigChange('visualization_options', 'grouping', e.target.value)}
                                >
                                    <MenuItem value="daily">Diaria</MenuItem>
                                    <MenuItem value="weekly">Semanal</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth size="small">
                                <InputLabel>Ordenamiento</InputLabel>
                                <Select
                                    value={config.visualization_options.sorting}
                                    label="Ordenamiento"
                                    onChange={(e) => handleConfigChange('visualization_options', 'sorting', e.target.value)}
                                >
                                    <MenuItem value="popularity">Por Popularidad</MenuItem>
                                    <MenuItem value="proximity">Por Proximidad</MenuItem>
                                    <MenuItem value="alphabetical">Alfabético</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth size="small">
                                <InputLabel>Nivel de Detalle</InputLabel>
                                <Select
                                    value={config.visualization_options.detail_level}
                                    label="Nivel de Detalle"
                                    onChange={(e) => handleConfigChange('visualization_options', 'detail_level', e.target.value)}
                                >
                                    <MenuItem value="summary">Resumen</MenuItem>
                                    <MenuItem value="complete">Completo</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Vista Previa de Resultados */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Vista Previa de Resultados
                        </Typography>
                        
                        {isLoading && (
                            <Alert severity="info">
                                Cargando datos con la configuración actual...
                            </Alert>
                        )}
                        
                        {error && (
                            <Alert severity="error">
                                Error al cargar los datos de prueba
                            </Alert>
                        )}
                        
                        {testData?.data && (
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" color="primary">
                                                {testData.data.top_upcoming_checkins?.reduce((sum, checkin) => sum + checkin.total_searches, 0) || 0}
                                            </Typography>
                                            <Typography variant="caption">Total Búsquedas</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" color="success.main">
                                                {testData.data.top_upcoming_checkins?.length || 0}
                                            </Typography>
                                            <Typography variant="caption">Fechas Únicas</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" color="warning.main">
                                                {testData.data.top_upcoming_checkins?.length || 0}
                                            </Typography>
                                            <Typography variant="caption">Resultados</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Card variant="outlined">
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" color="info.main">
                                                {testData.data.period_info?.days_ahead || 0}
                                            </Typography>
                                            <Typography variant="caption">Días Adelante</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                </Grid>

                {/* Configuración de Exportación */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DownloadIcon />
                            Configuración de Exportación
                        </Typography>
                        
                        <Stack spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Formato de Exportación</InputLabel>
                                <Select
                                    value={config.export_settings.format}
                                    label="Formato de Exportación"
                                    onChange={(e) => handleConfigChange('export_settings', 'format', e.target.value)}
                                >
                                    <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                                    <MenuItem value="csv">CSV (.csv)</MenuItem>
                                    <MenuItem value="pdf">PDF (.pdf)</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={config.export_settings.include_raw_data}
                                        onChange={(e) => handleConfigChange('export_settings', 'include_raw_data', e.target.checked)}
                                    />
                                }
                                label="Incluir datos en bruto"
                            />
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={config.export_settings.include_charts}
                                        onChange={(e) => handleConfigChange('export_settings', 'include_charts', e.target.checked)}
                                    />
                                }
                                label="Incluir gráficos"
                            />
                        </Stack>
                        
                        <Box sx={{ my: 2, borderBottom: 1, borderColor: 'divider' }} />
                        
                        <Button
                            variant="outlined"
                            onClick={exportData}
                            startIcon={<DownloadIcon />}
                            fullWidth
                            disabled={!testData}
                        >
                            Exportar Datos
                        </Button>
                    </Paper>
                </Grid>

                {/* Reportes Programados */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RefreshIcon />
                            Reportes Programados
                        </Typography>
                        
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={config.schedule_reports.enabled}
                                        onChange={(e) => handleConfigChange('schedule_reports', 'enabled', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Habilitar reportes automáticos"
                            />
                            
                            {config.schedule_reports.enabled && (
                                <>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Frecuencia</InputLabel>
                                        <Select
                                            value={config.schedule_reports.frequency}
                                            label="Frecuencia"
                                            onChange={(e) => handleConfigChange('schedule_reports', 'frequency', e.target.value)}
                                        >
                                            <MenuItem value="daily">Diario</MenuItem>
                                            <MenuItem value="weekly">Semanal</MenuItem>
                                            <MenuItem value="monthly">Mensual</MenuItem>
                                        </Select>
                                    </FormControl>
                                    
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        Los reportes programados se enviarán automáticamente según la frecuencia seleccionada
                                    </Alert>
                                </>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Acciones Globales */}
            <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                    <Button
                        variant="contained"
                        onClick={saveConfiguration}
                        startIcon={<SaveIcon />}
                        color="primary"
                    >
                        Guardar Configuración
                    </Button>
                    
                    <Button
                        variant="outlined"
                        onClick={generateShareableLink}
                        startIcon={<ShareIcon />}
                    >
                        Compartir Vista
                    </Button>
                    
                    <Button
                        variant="outlined"
                        onClick={() => setConfig({
                            temporal_filters: { days_ahead: 60, limit: 20, include_anonymous: true },
                            visualization_options: { grouping: 'daily', sorting: 'popularity', detail_level: 'complete' },
                            export_settings: { format: 'excel', include_raw_data: true, include_charts: true },
                            schedule_reports: { enabled: false, frequency: 'weekly', recipients: [] }
                        })}
                    >
                        Restablecer Defaults
                    </Button>
                </Stack>
                
                <Box mt={2} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        Las configuraciones se guardan localmente y se aplicarán a futuras sesiones
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}