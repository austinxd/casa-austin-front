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
    Snackbar,
    Stack,
} from '@mui/material'
import {
    Calculate as CalculateIcon,
    ContentCopy as CopyIcon,
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

    const handleCheckInChange = (newValue: Dayjs | null) => {
        setCheckInDate(newValue)
        
        if (newValue && checkOutDate) {
            if (!checkOutDate.isAfter(newValue)) {
                setCheckOutDate(newValue.add(1, 'day'))
            }
        } else if (newValue && !checkOutDate) {
            setCheckOutDate(newValue.add(1, 'day'))
        }
    }

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
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
                                Cotizador
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Calcula el precio de tu estadía
                            </Typography>
                        </Box>

                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <DatePicker
                                        label="Llegada"
                                        value={checkInDate}
                                        onChange={handleCheckInChange}
                                        minDate={today}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!checkInError,
                                            },
                                            day: {
                                                sx: {
                                                    '&:not(.Mui-disabled)': {
                                                        color: '#212121',
                                                        fontWeight: 600,
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: '#bdbdbd',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#0E6191 !important',
                                                        color: '#ffffff !important',
                                                        fontWeight: 700,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    
                                    <DatePicker
                                        label="Salida"
                                        value={checkOutDate}
                                        onChange={(newValue) => setCheckOutDate(newValue)}
                                        minDate={checkInDate ? checkInDate.add(1, 'day') : today.add(1, 'day')}
                                        disabled={!checkInDate}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!checkOutError,
                                            },
                                            day: {
                                                sx: {
                                                    '&:not(.Mui-disabled)': {
                                                        color: '#212121',
                                                        fontWeight: 600,
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: '#bdbdbd',
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#0E6191 !important',
                                                        color: '#ffffff !important',
                                                        fontWeight: 700,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Stack>

                                {(checkInError || checkOutError) && (
                                    <Alert severity="error" sx={{ py: 1 }}>
                                        {checkInError 
                                            ? 'La fecha de llegada no puede ser en el pasado' 
                                            : 'La fecha de salida debe ser después de la llegada'}
                                    </Alert>
                                )}

                                {nightsCount > 0 && (
                                    <Box sx={{ py: 1, px: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {nightsCount} {nightsCount === 1 ? 'noche' : 'noches'}
                                        </Typography>
                                    </Box>
                                )}

                                <TextField
                                    fullWidth
                                    label="Huéspedes"
                                    type="number"
                                    value={guests}
                                    onChange={(e) => handleGuestsChange(e.target.value)}
                                    InputProps={{
                                        inputProps: { min: 1 },
                                    }}
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                                    onClick={handleCalculate}
                                    disabled={!isFormValid || isLoading}
                                    sx={{
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        backgroundColor: '#212121',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#424242',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    {isLoading ? 'Calculando...' : 'Calcular'}
                                </Button>

                                {error && (
                                    <Alert severity="error" sx={{ py: 1 }}>
                                        Error al calcular. Intenta nuevamente.
                                    </Alert>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        {isLoading && (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                minHeight: 300,
                                gap: 2,
                            }}>
                                <CircularProgress size={40} sx={{ color: '#212121' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Calculando...
                                </Typography>
                            </Box>
                        )}

                        {!isLoading && !data && (
                            <Box 
                                sx={{ 
                                    p: 6, 
                                    textAlign: 'center', 
                                    minHeight: 300, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                }}
                            >
                                <Box>
                                    <Typography variant="body1" color="text.secondary">
                                        Completa el formulario para ver los precios
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {!isLoading && data?.data && (
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 3, 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        Cotización
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CopyIcon />}
                                        onClick={handleCopyToClipboard}
                                        disabled={!hasResultMessages}
                                        sx={{
                                            textTransform: 'none',
                                            borderColor: '#212121',
                                            color: '#212121',
                                            '&:hover': {
                                                borderColor: '#424242',
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            },
                                        }}
                                    >
                                        Copiar
                                    </Button>
                                </Box>

                                <Stack spacing={2}>
                                    <Box 
                                        sx={{ 
                                            p: 2.5, 
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                whiteSpace: 'pre-line',
                                                color: '#212121',
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {data.data.message1}
                                        </Typography>
                                    </Box>

                                    <Box 
                                        sx={{ 
                                            p: 2.5, 
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                whiteSpace: 'pre-line',
                                                fontWeight: 600,
                                                color: '#212121',
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {data.data.message2}
                                        </Typography>
                                    </Box>

                                    {data.data.general_recommendations && data.data.general_recommendations.length > 0 && (
                                        <Alert severity="info" sx={{ py: 1 }}>
                                            <Typography variant="body2">
                                                {data.data.general_recommendations.join(' • ')}
                                            </Typography>
                                        </Alert>
                                    )}
                                </Stack>
                            </Paper>
                        )}
                    </Grid>
                </Grid>

                <Snackbar
                    open={showCopySnackbar}
                    autoHideDuration={3000}
                    onClose={() => setShowCopySnackbar(false)}
                    message="Copiado al portapapeles"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        </LocalizationProvider>
    )
}
