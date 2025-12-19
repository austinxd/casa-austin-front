import { useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    IconButton,
    Tooltip,
    Checkbox,
    FormControlLabel,
    Grid,
    Skeleton,
    Collapse,
    TextField,
    MenuItem,
    InputAdornment,
    CircularProgress,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PeopleIcon from '@mui/icons-material/People'
import HomeIcon from '@mui/icons-material/Home'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SearchIcon from '@mui/icons-material/Search'
import {
    useGetSearchesByCheckInQuery,
    useGetAchievementsQuery,
    ISearchByClient,
} from '@/services/clients/clientsService'
import { useBoxShadow } from '@/core/utils'

dayjs.locale('es')

export default function MarketingTab() {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
    const [includeAnonymous, setIncludeAnonymous] = useState(false)
    const [expandedClients, setExpandedClients] = useState<{ [key: string]: boolean }>({})
    const [selectedLevel, setSelectedLevel] = useState<string>('')
    const [discountPercent, setDiscountPercent] = useState<number>(0)

    // Obtener niveles/achievements
    const { data: achievementsData } = useGetAchievementsQuery()

    const { data, isLoading, isFetching } = useGetSearchesByCheckInQuery({
        date: selectedDate.format('YYYY-MM-DD'),
        include_anonymous: includeAnonymous,
        ...(selectedLevel && { level: selectedLevel }),
    })

    const handleWhatsApp = (clientData: ISearchByClient) => {
        if (!clientData.client.tel_number) return
        const formattedPhone = clientData.client.tel_number.replace(/\D/g, '')

        // Obtener la búsqueda más próxima (primera del array)
        const search = clientData.searches[0]
        if (!search || !search.pricing) return

        const firstName = clientData.client.first_name
        const checkIn = dayjs(search.check_in_date)
        const checkOut = dayjs(search.check_out_date)

        // Formatear fechas
        const dateRange = `${checkIn.format('D')}–${checkOut.format('D [de] MMMM')}`

        // Construir lista de propiedades disponibles
        let propertiesList = ''

        if (search.pricing.properties && search.pricing.properties.length > 0) {
            if (discountPercent > 0) {
                propertiesList = search.pricing.properties
                    .map(p => {
                        const originalUsd = p.price_usd
                        const originalSol = p.price_sol
                        const discountedUsd = originalUsd * (1 - discountPercent / 100)
                        const discountedSol = originalSol * (1 - discountPercent / 100)
                        return `• *${p.name}*\n  ~$${originalUsd.toFixed(0)} / S/${originalSol.toFixed(0)}~ → *$${discountedUsd.toFixed(0)} / S/${discountedSol.toFixed(0)}*`
                    })
                    .join('\n\n')
            } else {
                propertiesList = search.pricing.properties
                    .map(p => `• *${p.name}* — $${p.price_usd.toFixed(0)} / S/${p.price_sol.toFixed(0)}`)
                    .join('\n')
            }
        } else if (search.pricing.price_usd) {
            const originalUsd = search.pricing.price_usd
            const originalSol = search.pricing.price_sol || 0
            const propName = search.property?.name || 'Casa Austin'
            if (discountPercent > 0) {
                const discountedUsd = originalUsd * (1 - discountPercent / 100)
                const discountedSol = originalSol * (1 - discountPercent / 100)
                propertiesList = `• *${propName}*\n  ~$${originalUsd.toFixed(0)} / S/${originalSol.toFixed(0)}~ → *$${discountedUsd.toFixed(0)} / S/${discountedSol.toFixed(0)}*`
            } else {
                propertiesList = `• *${propName}* — $${originalUsd.toFixed(0)} / S/${originalSol.toFixed(0)}`
            }
        }

        // Mensaje según si hay descuento o no
        let message = ''
        if (discountPercent > 0) {
            message = `Hola ${firstName}! 👋

Tenemos una *promoción especial* para ti:

📅 Fechas: *${dateRange}*
👥 Huéspedes: ${search.guests}
🎁 Descuento: *${discountPercent}% OFF*

${propertiesList}

¿Te reservo? 😊`
        } else {
            message = `Hola ${firstName}! 👋

Las fechas que buscaste están disponibles:

📅 Fechas: *${dateRange}*
👥 Huéspedes: ${search.guests}

${propertiesList}

¿Te ayudo con la reserva? 😊`
        }

        // Usar api.whatsapp.com (URL oficial que maneja mejor los emojis)
        window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`, '_blank')
    }

    const handleCall = (tel: string) => {
        if (!tel) return
        window.open(`tel:${tel}`, '_self')
    }

    const toggleExpand = (clientId: string) => {
        setExpandedClients((prev) => ({
            ...prev,
            [clientId]: !prev[clientId],
        }))
    }

    const formatSearchTimestamp = (timestamp: string) => {
        return dayjs(timestamp).format('DD/MM HH:mm')
    }

    const boxShadow = useBoxShadow(true)

    // Stats Cards
    const StatsCards = () => (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
                <Card sx={{ boxShadow, textAlign: 'center', py: 1 }}>
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="h3" sx={{ fontSize: '28px', fontWeight: 700, color: '#0E6191' }}>
                            {isLoading ? <Skeleton width={40} sx={{ mx: 'auto' }} /> : data?.total_searches || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total búsquedas
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card sx={{ boxShadow, textAlign: 'center', py: 1 }}>
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="h3" sx={{ fontSize: '28px', fontWeight: 700, color: '#4caf50' }}>
                            {isLoading ? <Skeleton width={40} sx={{ mx: 'auto' }} /> : data?.unique_clients || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Clientes únicos
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card sx={{ boxShadow, textAlign: 'center', py: 1 }}>
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="h3" sx={{ fontSize: '28px', fontWeight: 700, color: '#9e9e9e' }}>
                            {isLoading ? <Skeleton width={40} sx={{ mx: 'auto' }} /> : data?.anonymous_searches_count || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Anónimos
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )

    // Client Card Component
    const ClientCard = ({ clientData }: { clientData: ISearchByClient }) => {
        const isExpanded = expandedClients[clientData.client.id] ?? true
        const clientName = `${clientData.client.first_name} ${clientData.client.last_name}`.trim()

        return (
            <Card sx={{ boxShadow, mb: 2 }}>
                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {clientData.client.level_info?.icon && (
                                <Typography sx={{ fontSize: '1.3rem' }}>{clientData.client.level_info.icon}</Typography>
                            )}
                            <Typography variant="subtitle1" fontWeight={600}>
                                {clientName || 'Sin nombre'}
                            </Typography>
                            <Chip
                                label={`${clientData.search_count} ${clientData.search_count === 1 ? 'búsqueda' : 'búsquedas'}`}
                                size="small"
                                sx={{ bgcolor: '#0E6191', color: 'white', fontSize: '11px', height: '22px' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {clientData.client.tel_number && (
                                <>
                                    <Tooltip title="Llamar">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCall(clientData.client.tel_number)}
                                        >
                                            <PhoneIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="WhatsApp">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleWhatsApp(clientData)}
                                            sx={{ color: '#25D366' }}
                                        >
                                            <WhatsAppIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                            <IconButton size="small" onClick={() => toggleExpand(clientData.client.id)}>
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Client Info */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1, color: 'text.secondary' }}>
                        {clientData.client.number_doc && (
                            <Typography variant="caption">DNI: {clientData.client.number_doc}</Typography>
                        )}
                        {clientData.client.tel_number && (
                            <Typography variant="caption">Tel: +{clientData.client.tel_number}</Typography>
                        )}
                        {clientData.client.email && (
                            <Typography variant="caption">{clientData.client.email}</Typography>
                        )}
                    </Box>

                    {/* Searches List */}
                    <Collapse in={isExpanded}>
                        <Box sx={{ borderTop: '1px solid #eee', pt: 1.5, mt: 1 }}>
                            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                                Búsquedas realizadas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {clientData.searches.map((search) => (
                                    <Box
                                        key={search.id}
                                        sx={{
                                            bgcolor: '#f5f5f5',
                                            p: 1.5,
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 14, color: '#0E6191' }} />
                                            <Typography variant="caption" sx={{ color: '#0E6191', fontWeight: 500 }}>
                                                {search.check_in_date} → {search.check_out_date}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                            <PeopleIcon sx={{ fontSize: 14, color: '#666' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {search.guests} {search.guests === 1 ? 'persona' : 'personas'}
                                            </Typography>
                                        </Box>
                                        {search.property && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                                <HomeIcon sx={{ fontSize: 14, color: '#666' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {search.property.name}
                                                </Typography>
                                            </Box>
                                        )}
                                        {search.pricing && (
                                            <Box sx={{ mt: 0.5 }}>
                                                {/* Precio de propiedad específica */}
                                                {search.pricing.price_usd != null && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip label="Disponible" size="small" sx={{ bgcolor: '#4caf50', color: 'white', fontSize: '10px', height: '18px' }} />
                                                        <Typography variant="caption" fontWeight={600} sx={{ color: '#0E6191' }}>
                                                            ${search.pricing.price_usd.toFixed(2)} USD
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {/* Lista de casas disponibles */}
                                                {search.pricing.properties && search.pricing.properties.length > 0 && (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        <Typography variant="caption" fontWeight={600} color="success.main">
                                                            {search.pricing.properties.length} casas disponibles:
                                                        </Typography>
                                                        {search.pricing.properties.map((prop, idx) => (
                                                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                                                                <Typography variant="caption" sx={{ color: '#333' }}>
                                                                    • {prop.name}:
                                                                </Typography>
                                                                <Typography variant="caption" fontWeight={600} sx={{ color: '#0E6191' }}>
                                                                    ${prop.price_usd.toFixed(0)} USD
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    (S/ {prop.price_sol.toFixed(0)})
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            Buscó el: {formatSearchTimestamp(search.search_timestamp)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>
        )
    }

    // Anonymous Card Component
    const AnonymousCard = ({ search }: { search: any }) => (
        <Card sx={{ boxShadow, mb: 2, opacity: 0.85, border: '1px dashed #ccc' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonOutlineIcon sx={{ color: '#9e9e9e' }} />
                    <Typography variant="subtitle1" color="text.secondary">
                        Usuario anónimo
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: '#0E6191' }} />
                        <Typography variant="caption" sx={{ color: '#0E6191', fontWeight: 500 }}>
                            {search.check_in_date} → {search.check_out_date}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 14, color: '#666' }} />
                        <Typography variant="caption" color="text.secondary">
                            {search.guests} {search.guests === 1 ? 'persona' : 'personas'}
                        </Typography>
                    </Box>
                    {search.property && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <HomeIcon sx={{ fontSize: 14, color: '#666' }} />
                            <Typography variant="caption" color="text.secondary">
                                {search.property.name}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        IP: {search.ip_address} | {formatSearchTimestamp(search.search_timestamp)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )

    // Empty State
    const EmptyState = () => (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <SearchIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography color="text.secondary">
                No hay búsquedas para esta fecha
            </Typography>
        </Box>
    )

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box>
                {/* Header con selector de fecha y filtros */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                            Fecha de check-in:
                        </Typography>
                        <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => newValue && setSelectedDate(newValue)}
                            format="DD/MM/YYYY"
                            disablePast={false}
                            disableFuture={false}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: { width: 150 },
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                            Nivel:
                        </Typography>
                        <TextField
                            select
                            size="small"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            sx={{ width: 150 }}
                            placeholder="Todos"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {achievementsData?.data?.achievements?.map((achievement) => (
                                <MenuItem key={achievement.id} value={achievement.id}>
                                    {achievement.icon} {achievement.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                            Descuento:
                        </Typography>
                        <TextField
                            type="number"
                            size="small"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ min: 0, max: 100 }}
                            sx={{ width: 90 }}
                        />
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeAnonymous}
                                onChange={(e) => setIncludeAnonymous(e.target.checked)}
                                size="small"
                            />
                        }
                        label={<Typography variant="body2">Incluir anónimas</Typography>}
                        sx={{ ml: 0 }}
                    />
                </Box>

                {/* Fecha seleccionada */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h2" sx={{ textTransform: 'capitalize' }}>
                        {selectedDate.format('dddd, D [de] MMMM [de] YYYY')}
                    </Typography>
                    {isFetching && <CircularProgress size={24} />}
                </Box>

                {/* Stats */}
                <StatsCards />

                {/* Loading */}
                {isLoading && (
                    <Box>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rounded" height={120} sx={{ mb: 2 }} />
                        ))}
                    </Box>
                )}

                {/* Results */}
                {!isLoading && (
                    <>
                        {(!data?.searches_by_client?.length && !data?.anonymous_searches_detail?.length) ? (
                            <EmptyState />
                        ) : (
                            <>
                                {/* Clients with searches */}
                                {data?.searches_by_client?.map((clientData) => (
                                    <ClientCard key={clientData.client.id} clientData={clientData} />
                                ))}

                                {/* Anonymous searches */}
                                {includeAnonymous && data?.anonymous_searches_detail?.map((search) => (
                                    <AnonymousCard key={search.id} search={search} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </Box>
        </LocalizationProvider>
    )
}
