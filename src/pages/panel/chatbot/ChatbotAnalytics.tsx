import { useState, useMemo, useRef, useEffect } from 'react'
import {
    Box,
    Typography,
    Tab,
    Tabs,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress,
    TextField,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    InputAdornment,
    Paper,
} from '@mui/material'
import {
    SmartToy as SmartToyIcon,
    Message as MessageIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as AttachMoneyIcon,
    Warning as WarningIcon,
    PersonSearch as PersonSearchIcon,
    Search as SearchIcon,
} from '@mui/icons-material'
import { useBoxShadow } from '@/core/utils'
import { useGetChatAnalyticsQuery, useGetChatSessionsQuery, useGetChatMessagesQuery } from '@/services/chatbot/chatbotService'
import { IChatSession } from '@/interfaces/chatbot/chatbot.interface'

export default function ChatbotAnalytics() {
    const [tab, setTab] = useState(0)
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [searchSessions, setSearchSessions] = useState('')
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [fromDate, setFromDate] = useState(thirtyDaysAgo.toISOString().split('T')[0])
    const [toDate, setToDate] = useState(today.toISOString().split('T')[0])

    const { data: analytics, isLoading } = useGetChatAnalyticsQuery({ from: fromDate, to: toDate })
    const { data: sessionsData } = useGetChatSessionsQuery({ page: 1, search: searchSessions })

    const boxShadow = useBoxShadow(true)

    // Agregados
    const totals = useMemo(() => {
        if (!analytics || analytics.length === 0) return null
        return analytics.reduce(
            (acc, day) => ({
                messages_in: acc.messages_in + day.total_messages_in,
                messages_out_ai: acc.messages_out_ai + day.total_messages_out_ai,
                messages_out_human: acc.messages_out_human + day.total_messages_out_human,
                sessions: acc.sessions + day.total_sessions,
                new_sessions: acc.new_sessions + day.new_sessions,
                escalations: acc.escalations + day.escalations,
                cost: acc.cost + parseFloat(day.estimated_cost_usd),
                tokens_in: acc.tokens_in + day.total_tokens_input,
                tokens_out: acc.tokens_out + day.total_tokens_output,
                reservations: acc.reservations + day.reservations_created,
                clients: acc.clients + day.clients_identified,
            }),
            {
                messages_in: 0, messages_out_ai: 0, messages_out_human: 0,
                sessions: 0, new_sessions: 0, escalations: 0, cost: 0,
                tokens_in: 0, tokens_out: 0, reservations: 0, clients: 0,
            }
        )
    }, [analytics])

    // Intents agregados
    const intentsAgg = useMemo(() => {
        if (!analytics) return []
        const map: Record<string, number> = {}
        analytics.forEach((day) => {
            Object.entries(day.intents_breakdown || {}).forEach(([intent, count]) => {
                map[intent] = (map[intent] || 0) + (count as number)
            })
        })
        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .map(([intent, count]) => ({ intent, count }))
    }, [analytics])

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={700}>
                    Austin Assistant
                </Typography>
                <Box display="flex" gap={2}>
                    <TextField
                        type="date"
                        label="Desde"
                        size="small"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        label="Hasta"
                        size="small"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Resumen" />
                <Tab label="Intenciones" />
                <Tab label="Conversaciones" />
                <Tab label="Costos" />
            </Tabs>

            {/* TAB 0: RESUMEN */}
            {tab === 0 && (
                <Box>
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={2} mb={3}>
                        <KPICard
                            icon={<MessageIcon />}
                            label="Mensajes Hoy"
                            value={analytics?.[0]
                                ? (analytics[0].total_messages_in + analytics[0].total_messages_out_ai + analytics[0].total_messages_out_human).toString()
                                : '0'}
                            color="#0E6191"
                        />
                        <KPICard
                            icon={<SmartToyIcon />}
                            label="Sesiones Periodo"
                            value={totals?.sessions.toString() || '0'}
                            color="#4caf50"
                        />
                        <KPICard
                            icon={<WarningIcon />}
                            label="Escalaciones"
                            value={totals?.escalations.toString() || '0'}
                            color="#ff9800"
                        />
                        <KPICard
                            icon={<AttachMoneyIcon />}
                            label="Costo USD"
                            value={`$${totals?.cost.toFixed(2) || '0.00'}`}
                            color="#e91e63"
                        />
                    </Box>

                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap={2}>
                        <KPICard
                            icon={<TrendingUpIcon />}
                            label="Reservas Creadas"
                            value={totals?.reservations.toString() || '0'}
                            color="#9c27b0"
                        />
                        <KPICard
                            icon={<PersonSearchIcon />}
                            label="Clientes Identificados"
                            value={totals?.clients.toString() || '0'}
                            color="#00bcd4"
                        />
                        <KPICard
                            icon={<MessageIcon />}
                            label="Msgs IA / Humano"
                            value={`${totals?.messages_out_ai || 0} / ${totals?.messages_out_human || 0}`}
                            color="#607d8b"
                        />
                    </Box>

                    {/* Tabla diaria */}
                    <Card sx={{ mt: 3, boxShadow }}>
                        <CardContent>
                            <Typography variant="h6" mb={2}>Métricas por Día</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell align="right">Sesiones</TableCell>
                                        <TableCell align="right">Msgs In</TableCell>
                                        <TableCell align="right">Msgs IA</TableCell>
                                        <TableCell align="right">Msgs Humano</TableCell>
                                        <TableCell align="right">Escalaciones</TableCell>
                                        <TableCell align="right">Costo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(analytics || []).map((day) => (
                                        <TableRow key={day.id}>
                                            <TableCell>{day.date}</TableCell>
                                            <TableCell align="right">{day.total_sessions}</TableCell>
                                            <TableCell align="right">{day.total_messages_in}</TableCell>
                                            <TableCell align="right">{day.total_messages_out_ai}</TableCell>
                                            <TableCell align="right">{day.total_messages_out_human}</TableCell>
                                            <TableCell align="right">{day.escalations}</TableCell>
                                            <TableCell align="right">${parseFloat(day.estimated_cost_usd).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* TAB 1: INTENCIONES */}
            {tab === 1 && (
                <Card sx={{ boxShadow }}>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Intenciones Detectadas</Typography>
                        {intentsAgg.length === 0 ? (
                            <Typography color="textSecondary">Sin datos de intenciones</Typography>
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Intención</TableCell>
                                        <TableCell align="right">Cantidad</TableCell>
                                        <TableCell align="right">%</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {intentsAgg.map(({ intent, count }) => {
                                        const total = intentsAgg.reduce((s, i) => s + i.count, 0)
                                        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
                                        return (
                                            <TableRow key={intent}>
                                                <TableCell>
                                                    <Chip label={intent} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell align="right">{count}</TableCell>
                                                <TableCell align="right">{pct}%</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* TAB 2: CONVERSACIONES */}
            {tab === 2 && (
                <Box display="flex" gap={2} sx={{ height: 'calc(100vh - 240px)', minHeight: 500 }}>
                    {/* Lista de sesiones */}
                    <Card sx={{ width: 340, minWidth: 340, boxShadow, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Buscar..."
                                value={searchSessions}
                                onChange={(e) => setSearchSessions(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <List sx={{ overflow: 'auto', flex: 1, p: 0 }}>
                            {(sessionsData?.results || []).map((session) => {
                                const name = session.client_name || session.wa_profile_name || session.wa_id
                                const initial = name.charAt(0).toUpperCase()
                                const statusColor =
                                    session.ai_enabled ? '#0E6191' :
                                    session.status === 'escalated' ? '#ff1744' : '#e67e22'
                                const preview = session.last_message_preview?.content || 'Sin mensajes'
                                const time = session.last_message_at
                                    ? new Date(session.last_message_at).toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
                                    : ''
                                return (
                                    <ListItemButton
                                        key={session.id}
                                        selected={selectedSessionId === session.id}
                                        onClick={() => setSelectedSessionId(session.id)}
                                        sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: statusColor, width: 40, height: 40, fontSize: 16 }}>
                                                {initial}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                                                        {name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">{time}</Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {preview}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                )
                            })}
                        </List>
                    </Card>

                    {/* Panel de chat */}
                    <Card sx={{ flex: 1, boxShadow, display: 'flex', flexDirection: 'column' }}>
                        {selectedSessionId ? (
                            <ChatPanel sessionId={selectedSessionId} sessions={sessionsData?.results || []} />
                        ) : (
                            <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
                                <Typography color="text.secondary">
                                    Selecciona una conversación
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Box>
            )}

            {/* TAB 3: COSTOS */}
            {tab === 3 && (
                <Box>
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2} mb={3}>
                        <KPICard
                            icon={<AttachMoneyIcon />}
                            label="Costo Total Periodo"
                            value={`$${totals?.cost.toFixed(4) || '0.0000'}`}
                            color="#e91e63"
                        />
                        <KPICard
                            icon={<SmartToyIcon />}
                            label="Tokens Totales"
                            value={`${((totals?.tokens_in || 0) + (totals?.tokens_out || 0)).toLocaleString()}`}
                            color="#673ab7"
                        />
                    </Box>

                    <Card sx={{ boxShadow }}>
                        <CardContent>
                            <Typography variant="h6" mb={2}>Costos por Día</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell align="right">Tokens Input</TableCell>
                                        <TableCell align="right">Tokens Output</TableCell>
                                        <TableCell align="right">Costo USD</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(analytics || []).map((day) => (
                                        <TableRow key={day.id}>
                                            <TableCell>{day.date}</TableCell>
                                            <TableCell align="right">{day.total_tokens_input.toLocaleString()}</TableCell>
                                            <TableCell align="right">{day.total_tokens_output.toLocaleString()}</TableCell>
                                            <TableCell align="right">${parseFloat(day.estimated_cost_usd).toFixed(4)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    )
}

// ========= Chat Panel Component =========
function ChatPanel({ sessionId, sessions }: { sessionId: string; sessions: IChatSession[] }) {
    const { data: messages, isLoading } = useGetChatMessagesQuery({ sessionId })
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const session = sessions.find(s => s.id === sessionId)
    const displayName = session?.client_name || session?.wa_profile_name || session?.wa_id || 'Chat'

    // Scroll al fondo cuando cambian los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Mensajes vienen newest-first, invertir para mostrar cronológicamente
    const sortedMessages = useMemo(() => {
        if (!messages) return []
        return [...messages].reverse()
    }, [messages])

    const STATUS_LABELS: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'default' }> = {
        active: { label: 'Activa', color: 'success' },
        escalated: { label: 'Escalada', color: 'error' },
        ai_paused: { label: 'IA Pausada', color: 'warning' },
        closed: { label: 'Cerrada', color: 'default' },
    }

    const statusInfo = STATUS_LABELS[session?.status || ''] || STATUS_LABELS.active

    return (
        <>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{displayName}</Typography>
                    <Typography variant="caption" color="text.secondary">{session?.wa_id}</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <Chip label={statusInfo.label} size="small" color={statusInfo.color} />
                    <Chip
                        label={session?.ai_enabled ? 'IA Activa' : 'IA Pausada'}
                        size="small"
                        variant="outlined"
                        color={session?.ai_enabled ? 'primary' : 'default'}
                    />
                </Box>
            </Box>

            {/* Mensajes */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#f5f5f5' }}>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress size={28} />
                    </Box>
                ) : sortedMessages.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" mt={4}>
                        Sin mensajes
                    </Typography>
                ) : (
                    sortedMessages.map((msg) => {
                        const isInbound = msg.direction === 'inbound'
                        const isAI = msg.direction === 'outbound_ai'
                        const bgColor = isInbound ? '#fff' : isAI ? '#0E6191' : '#e67e22'
                        const textColor = isInbound ? '#000' : '#fff'
                        const time = new Date(msg.created).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

                        return (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isInbound ? 'flex-start' : 'flex-end',
                                    mb: 1,
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        px: 2, py: 1,
                                        maxWidth: '70%',
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        borderRadius: 2,
                                    }}
                                >
                                    {msg.direction === 'outbound_human' && msg.sent_by_name && (
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.5 }}>
                                            {msg.sent_by_name}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {msg.content}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: isInbound ? 'text.secondary' : 'rgba(255,255,255,0.7)',
                                            display: 'block',
                                            textAlign: 'right',
                                            mt: 0.5,
                                        }}
                                    >
                                        {time}
                                        {!isInbound && (isAI ? ' · IA' : ' · Admin')}
                                    </Typography>
                                </Paper>
                            </Box>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>
        </>
    )
}

// ========= KPI Card Component =========
function KPICard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    const boxShadow = useBoxShadow(true)
    return (
        <Card sx={{ boxShadow }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        width: 44, height: 44, borderRadius: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: `${color}15`, color,
                    }}
                >
                    {icon}
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">{label}</Typography>
                    <Typography variant="h6" fontWeight={700}>{value}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
