import { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Snackbar,
    InputAdornment,
} from '@mui/material'
import {
    Calculate as CalculateIcon,
    ContentCopy as CopyIcon,
    CalendarToday as CalendarIcon,
    People as PeopleIcon,
} from '@mui/icons-material'
import { useLazyCalculatePricingQuery } from '@/services/pricing/pricingService'
import dayjs from 'dayjs'

export default function CotizadorCenter() {
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [guests, setGuests] = useState<number>(2)
    const [showCopySnackbar, setShowCopySnackbar] = useState(false)
    
    const [calculatePricing, { data, isLoading, error }] = useLazyCalculatePricingQuery()

    const handleGuestsChange = (value: string) => {
        const parsed = parseInt(value)
        if (!value || isNaN(parsed)) {
            setGuests(1)
        } else if (parsed < 1) {
            setGuests(1)
        } else {
            setGuests(parsed)
        }
    }

    const handleCalculate = () => {
        if (!checkInDate || !checkOutDate || !guests) {
            return
        }

        const formattedCheckIn = dayjs(checkInDate).format('YYYY-MM-DD')
        const formattedCheckOut = dayjs(checkOutDate).format('YYYY-MM-DD')

        calculatePricing({
            check_in_date: formattedCheckIn,
            check_out_date: formattedCheckOut,
            guests: guests,
        })
    }

    const handleCopyToClipboard = () => {
        if (!data?.data?.message1 || !data?.data?.message2) {
            return
        }

        const fullMessage = `${data.data.message1}\n\n${data.data.message2}`
        
        navigator.clipboard.writeText(fullMessage).then(() => {
            setShowCopySnackbar(true)
        }).catch((err) => {
            console.error('Error al copiar:', err)
        })
    }

    const checkInDateObj = checkInDate ? dayjs(checkInDate) : null
    const checkOutDateObj = checkOutDate ? dayjs(checkOutDate) : null
    const today = dayjs().startOf('day')

    const checkInError = checkInDateObj && checkInDateObj.isBefore(today)
    const checkOutError = checkOutDateObj && checkInDateObj && !checkOutDateObj.isAfter(checkInDateObj)
    
    const isFormValid = checkInDate && checkOutDate && guests > 0 && !checkInError && !checkOutError
    const hasResultMessages = data?.data?.message1 && data?.data?.message2

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                💰 Cotizador de Propiedades
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Datos de la Reserva
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Fecha de Llegada"
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                error={!!checkInError}
                                helperText={checkInError ? 'La fecha de llegada no puede ser en el pasado' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Fecha de Salida"
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                error={!!checkOutError}
                                helperText={checkOutError ? 'La fecha de salida debe ser después de la llegada' : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Cantidad de Huéspedes"
                                type="number"
                                value={guests}
                                onChange={(e) => handleGuestsChange(e.target.value)}
                                InputProps={{
                                    inputProps: { min: 1, max: 20 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PeopleIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<CalculateIcon />}
                                onClick={handleCalculate}
                                disabled={!isFormValid || isLoading}
                                sx={{
                                    py: 1.5,
                                    backgroundColor: '#0E6191',
                                    '&:hover': {
                                        backgroundColor: '#0a4d73',
                                    },
                                }}
                            >
                                {isLoading ? 'Calculando...' : 'Calcular Cotización'}
                            </Button>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                Error al calcular la cotización. Por favor, intenta nuevamente.
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7}>
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!isLoading && !data && (
                        <Paper sx={{ p: 4, textAlign: 'center', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box>
                                <CalculateIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Completa el formulario y presiona "Calcular Cotización"
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Ingresa las fechas de llegada, salida y la cantidad de huéspedes
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    {!isLoading && data?.data && (
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Resultado de la Cotización
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<CopyIcon />}
                                    onClick={handleCopyToClipboard}
                                    disabled={!hasResultMessages}
                                    size="small"
                                >
                                    Copiar
                                </Button>
                            </Box>

                            <Card sx={{ mb: 2, backgroundColor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            whiteSpace: 'pre-line',
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {data.data.message1}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ backgroundColor: '#e3f2fd' }}>
                                <CardContent>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            whiteSpace: 'pre-line',
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {data.data.message2}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {data.data.general_recommendations && data.data.general_recommendations.length > 0 && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    {data.data.general_recommendations.join(', ')}
                                </Alert>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <Snackbar
                open={showCopySnackbar}
                autoHideDuration={3000}
                onClose={() => setShowCopySnackbar(false)}
                message="✅ Cotización copiada al portapapeles"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    )
}
