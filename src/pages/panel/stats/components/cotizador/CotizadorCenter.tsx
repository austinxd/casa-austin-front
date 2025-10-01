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
    Divider,
    Chip,
    Stack,
} from '@mui/material'
import {
    Calculate as CalculateIcon,
    ContentCopy as CopyIcon,
    People as PeopleIcon,
    Event as EventIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useLazyCalculatePricingQuery } from '@/services/pricing/pricingService'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'

export default function CotizadorCenter() {
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
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

        const formattedCheckIn = checkInDate.format('YYYY-MM-DD')
        const formattedCheckOut = checkOutDate.format('YYYY-MM-DD')

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

    const today = dayjs().startOf('day')

    const checkInError = checkInDate && checkInDate.isBefore(today)
    const checkOutError = checkOutDate && checkInDate && !checkOutDate.isAfter(checkInDate)
    
    const isFormValid = checkInDate && checkOutDate && guests > 0 && !checkInError && !checkOutError
    const hasResultMessages = data?.data?.message1 && data?.data?.message2

    const nightsCount = checkInDate && checkOutDate ? checkOutDate.diff(checkInDate, 'day') : 0

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Paper 
                            elevation={3}
                            sx={{ 
                                p: 4,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <EventIcon sx={{ fontSize: 32, color: '#0E6191', mr: 1.5 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0E6191' }}>
                                    Datos de Reserva
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{ mt: 3 }}>
                                <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                        p: 2.5, 
                                        mb: 3,
                                        backgroundColor: '#fafafa',
                                        borderColor: checkInError || checkOutError ? '#d32f2f' : '#e0e0e0',
                                        borderWidth: checkInError || checkOutError ? 2 : 1,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 600 }}>
                                        📅 FECHAS DE ESTADÍA
                                    </Typography>
                                    
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                        <DatePicker
                                            label="Fecha de Llegada"
                                            value={checkInDate}
                                            onChange={(newValue) => setCheckInDate(newValue)}
                                            minDate={today}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                    error: !!checkInError,
                                                },
                                            }}
                                        />
                                        
                                        <ArrowForwardIcon sx={{ color: '#0E6191', display: { xs: 'none', sm: 'block' } }} />
                                        
                                        <DatePicker
                                            label="Fecha de Salida"
                                            value={checkOutDate}
                                            onChange={(newValue) => setCheckOutDate(newValue)}
                                            minDate={today}
                                            disabled={!checkInDate}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: 'small',
                                                    error: !!checkOutError,
                                                },
                                            }}
                                        />
                                    </Stack>

                                    {(checkInError || checkOutError) && (
                                        <Alert severity="error" sx={{ mt: 2 }}>
                                            {checkInError 
                                                ? 'La fecha de llegada no puede ser en el pasado' 
                                                : 'La fecha de salida debe ser después de la llegada'}
                                        </Alert>
                                    )}

                                    {nightsCount > 0 && (
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                            <Chip 
                                                icon={<CheckCircleIcon />}
                                                label={`${nightsCount} ${nightsCount === 1 ? 'noche' : 'noches'}`}
                                                color="primary"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>
                                    )}
                                </Paper>

                                <TextField
                                    fullWidth
                                    label="Cantidad de Huéspedes"
                                    type="number"
                                    value={guests}
                                    onChange={(e) => handleGuestsChange(e.target.value)}
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PeopleIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                    helperText="Mínimo 1 huésped"
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                                    onClick={handleCalculate}
                                    disabled={!isFormValid || isLoading}
                                    sx={{
                                        py: 1.8,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        backgroundColor: '#0E6191',
                                        boxShadow: '0 4px 12px rgba(14, 97, 145, 0.3)',
                                        '&:hover': {
                                            backgroundColor: '#0a4d73',
                                            boxShadow: '0 6px 16px rgba(14, 97, 145, 0.4)',
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#e0e0e0',
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
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                minHeight: 400,
                                gap: 2,
                            }}>
                                <CircularProgress size={60} />
                                <Typography variant="body1" color="text.secondary">
                                    Calculando precios disponibles...
                                </Typography>
                            </Box>
                        )}

                        {!isLoading && !data && (
                            <Paper 
                                elevation={2}
                                sx={{ 
                                    p: 5, 
                                    textAlign: 'center', 
                                    minHeight: 400, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                }}
                            >
                                <Box>
                                    <CalculateIcon sx={{ fontSize: 100, color: '#0E6191', mb: 3, opacity: 0.7 }} />
                                    <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
                                        Listo para cotizar
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                                        Completa el formulario con las fechas de tu estadía y la cantidad de huéspedes para ver los precios disponibles
                                    </Typography>
                                </Box>
                            </Paper>
                        )}

                        {!isLoading && data?.data && (
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 28 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Cotización Lista
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<CopyIcon />}
                                        onClick={handleCopyToClipboard}
                                        disabled={!hasResultMessages}
                                        size="medium"
                                        sx={{
                                            backgroundColor: '#0E6191',
                                            '&:hover': {
                                                backgroundColor: '#0a4d73',
                                            },
                                        }}
                                    >
                                        Copiar
                                    </Button>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Card 
                                    sx={{ 
                                        mb: 2, 
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e0e0e0',
                                        boxShadow: 'none',
                                    }}
                                >
                                    <CardContent>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                whiteSpace: 'pre-line',
                                                fontWeight: 500,
                                                color: '#212121',
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {data.data.message1}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card 
                                    sx={{ 
                                        backgroundColor: '#e3f2fd',
                                        border: '1px solid #90caf9',
                                        boxShadow: 'none',
                                    }}
                                >
                                    <CardContent>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                whiteSpace: 'pre-line',
                                                fontWeight: 600,
                                                color: '#0d47a1',
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {data.data.message2}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {data.data.general_recommendations && data.data.general_recommendations.length > 0 && (
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            {data.data.general_recommendations.join(' • ')}
                                        </Typography>
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
        </LocalizationProvider>
    )
}
