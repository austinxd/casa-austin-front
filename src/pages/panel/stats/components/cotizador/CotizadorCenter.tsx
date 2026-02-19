import { useState, useEffect } from 'react'
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
    Autocomplete,
    Checkbox,
    FormControlLabel,
} from '@mui/material'
import {
    Calculate as CalculateIcon,
    ContentCopy as CopyIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useLazyCalculatePricingQuery, useLazyCalculateLateCheckoutQuery } from '@/services/pricing/pricingService'
import { useGetAllClientsQuery } from '@/services/clients/clientsService'
import { IRegisterClient } from '@/interfaces/clients/registerClients'
import { LateCheckoutData } from '@/interfaces/pricing.interface'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'

export default function CotizadorCenter() {
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
    const [guests, setGuests] = useState<number>(2)
    const [guestsInput, setGuestsInput] = useState<string>('2')
    const [showCopySnackbar, setShowCopySnackbar] = useState(false)
    const [selectedClient, setSelectedClient] = useState<IRegisterClient | null>(null)
    const [clientSearchTerm, setClientSearchTerm] = useState<string>('')
    const [includeLateCheckout, setIncludeLateCheckout] = useState<boolean>(false)
    const [lateCheckoutData, setLateCheckoutData] = useState<Record<string, LateCheckoutData>>({})
    const [isLoadingLateCheckout, setIsLoadingLateCheckout] = useState<boolean>(false)
    
    const [calculatePricing, { data, isLoading, error }] = useLazyCalculatePricingQuery()
    const [calculateLateCheckout] = useLazyCalculateLateCheckoutQuery()
    const { data: clientsData, isFetching: isLoadingClients } = useGetAllClientsQuery({
        page: 1,
        page_size: 10,
        search: clientSearchTerm,
    })

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
        setGuestsInput(value)
        const parsed = parseInt(value)
        if (!isNaN(parsed) && parsed >= 1) {
            setGuests(parsed)
        }
    }

    const handleGuestsBlur = () => {
        const parsed = parseInt(guestsInput)
        if (!guestsInput || isNaN(parsed) || parsed < 1) {
            setGuests(2)
            setGuestsInput('2')
        } else {
            setGuests(parsed)
            setGuestsInput(parsed.toString())
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
            ...(selectedClient && { client_id: selectedClient.id }),
        })
    }

    const handleCopyToClipboard = () => {
        if (!data?.data?.message1 || !data?.data?.message2 || !checkInDate || !checkOutDate) {
            return
        }

        const formattedCheckIn = checkInDate.format('YYYY-MM-DD')
        const formattedCheckOut = checkOutDate.format('YYYY-MM-DD')
        const bookingUrl = `https://casaaustin.pe/disponibilidad?checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}&guests=${guests}`

        let lateCheckoutInfo = ''
        if (includeLateCheckout && Object.keys(lateCheckoutData).length > 0) {
            const availableLateCheckouts = Object.values(lateCheckoutData).filter(lc => lc.is_available)
            if (availableLateCheckouts.length > 0) {
                lateCheckoutInfo = '\n\n🕐 *Late Checkout Disponible:*'
                availableLateCheckouts.forEach((lateCheckout) => {
                    lateCheckoutInfo += `\n🏠 ${lateCheckout.property_name}: *$${lateCheckout.late_checkout_price_usd.toFixed(2)}* ó *S/.${lateCheckout.late_checkout_price_sol.toFixed(2)}*`
                })
            }
        }

        const additionalInfo = `

🕒 Check-in: 3:00 PM
🕚 Check-out: 11:00 AM
📸  Fotos y detalles⬇️
${bookingUrl}
🎁 Beneficios exclusivos por reservar en nuestra web:
•  5% de puntos en cada reserva
•  Beneficios especiales para miembros de Casa Austin

⚠️ Todo visitante (día o noche) cuenta como persona adicional.`

        const fullMessage = `${data.data.message1}\n\n*PRECIO PARA ${guests} PERSONAS*\n${data.data.message2}${lateCheckoutInfo}${additionalInfo}`
        
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

    const hasAvailableProperties = data?.data?.properties && data.data.properties.some(p => p.available)

    useEffect(() => {
        if (!hasAvailableProperties) {
            setLateCheckoutData({})
            setIncludeLateCheckout(false)
            return
        }

        if (includeLateCheckout && data?.data?.properties && checkOutDate) {
            const availableProperties = data.data.properties.filter(p => p.available)
            
            if (availableProperties.length > 0) {
                setIsLoadingLateCheckout(true)
                const formattedCheckOut = checkOutDate.format('YYYY-MM-DD')
                
                Promise.all(
                    availableProperties.map(property =>
                        calculateLateCheckout({
                            property_id: property.property_id,
                            checkout_date: formattedCheckOut,
                            guests: guests,
                        }).unwrap().then(result => ({
                            ...result,
                            property_id: property.property_id
                        }))
                    )
                ).then(results => {
                    const lateCheckoutMap: Record<string, LateCheckoutData> = {}
                    results.forEach(result => {
                        if (result.success && result.data) {
                            const lateCheckoutWithId = {
                                ...result.data,
                                property_id: result.property_id
                            }
                            lateCheckoutMap[result.property_id] = lateCheckoutWithId
                        }
                    })
                    setLateCheckoutData(lateCheckoutMap)
                    setIsLoadingLateCheckout(false)
                }).catch(() => {
                    setIsLoadingLateCheckout(false)
                })
            }
        } else {
            setLateCheckoutData({})
        }
    }, [includeLateCheckout, data, checkOutDate, guests, calculateLateCheckout, hasAvailableProperties])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
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
                                    value={guestsInput}
                                    onChange={(e) => handleGuestsChange(e.target.value)}
                                    onBlur={handleGuestsBlur}
                                    InputProps={{
                                        inputProps: { min: 1 },
                                    }}
                                />

                                <Autocomplete
                                    fullWidth
                                    options={clientsData?.results || []}
                                    getOptionLabel={(option) => `${option.first_name} ${option.last_name} - ${option.number_doc}`}
                                    value={selectedClient}
                                    onChange={(_, newValue) => setSelectedClient(newValue)}
                                    onInputChange={(_, newInputValue) => setClientSearchTerm(newInputValue)}
                                    loading={isLoadingClients}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cliente (opcional)"
                                            placeholder="Buscar por nombre o documento"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoadingClients ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    noOptionsText="No se encontraron clientes"
                                />

                                {data && hasAvailableProperties && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={includeLateCheckout}
                                                onChange={(e) => setIncludeLateCheckout(e.target.checked)}
                                                disabled={isLoadingLateCheckout}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2">
                                                    Incluir Late Checkout
                                                </Typography>
                                                {isLoadingLateCheckout && (
                                                    <CircularProgress size={16} />
                                                )}
                                            </Box>
                                        }
                                    />
                                )}

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
                                                fontWeight: 600,
                                                color: '#212121',
                                                mb: 1.5,
                                            }}
                                        >
                                            PRECIO PARA {guests} PERSONAS
                                        </Typography>
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
                                        {includeLateCheckout && Object.keys(lateCheckoutData).length > 0 && Object.values(lateCheckoutData).some(lc => lc.is_available) && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: '#212121',
                                                        mb: 1,
                                                    }}
                                                >
                                                    🕐 Late Checkout Disponible:
                                                </Typography>
                                                {Object.values(lateCheckoutData).map((lateCheckout, index) => (
                                                    lateCheckout.is_available && (
                                                        <Typography 
                                                            key={lateCheckout.property_id || index}
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: '#212121',
                                                                lineHeight: 1.8,
                                                            }}
                                                        >
                                                            🏠 {lateCheckout.property_name}: <strong>${lateCheckout.late_checkout_price_usd.toFixed(2)}</strong> ó <strong>S/.{lateCheckout.late_checkout_price_sol.toFixed(2)}</strong>
                                                        </Typography>
                                                    )
                                                ))}
                                            </Box>
                                        )}
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
                                                color: '#212121',
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {`🕒 Check-in: 3:00 PM\n🕚 Check-out: 11:00 AM\n📸  Fotos y detalles⬇️\nhttps://casaaustin.pe/disponibilidad?checkIn=${checkInDate?.format('YYYY-MM-DD')}&checkOut=${checkOutDate?.format('YYYY-MM-DD')}&guests=${guests}\n🎁 Beneficios exclusivos por reservar en nuestra web:\n•  5% de puntos en cada reserva\n•  Beneficios especiales para miembros de Casa Austin\n\n⚠️ Todo visitante (día o noche) cuenta como persona adicional.`}
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
