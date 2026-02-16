import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
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
    IconButton,
    Switch,
    Tooltip,
    Badge,
} from '@mui/material'
import {
    SmartToy as SmartToyIcon,
    Message as MessageIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as AttachMoneyIcon,
    Warning as WarningIcon,
    PersonSearch as PersonSearchIcon,
    Search as SearchIcon,
    Send as SendIcon,
    ChatBubbleOutline,
} from '@mui/icons-material'
import { useBoxShadow } from '@/core/utils'
import {
    useGetChatAnalyticsQuery,
    useGetChatSessionsQuery,
    useGetChatMessagesQuery,
    useSendChatMessageMutation,
    useToggleChatAIMutation,
} from '@/services/chatbot/chatbotService'
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
    const { data: sessionsData } = useGetChatSessionsQuery(
        { page: 1, search: searchSessions },
        { pollingInterval: tab === 0 ? 10000 : undefined }
    )

    const boxShadow = useBoxShadow(true)

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

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={700}>
                    Austin Assistant
                </Typography>
                {tab > 0 && (
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
                )}
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab icon={<ChatBubbleOutline sx={{ fontSize: 18 }} />} iconPosition="start" label="Conversaciones" />
                <Tab label="Resumen" />
                <Tab label="Intenciones" />
                <Tab label="Costos" />
            </Tabs>

            {/* TAB 0: CONVERSACIONES */}
            {tab === 0 && (
                <Box display="flex" gap={2} sx={{ height: 'calc(100vh - 220px)', minHeight: 500 }}>
                    {/* Lista de sesiones */}
                    <Card sx={{ width: 360, minWidth: 360, boxShadow, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Buscar por nombre o teléfono..."
                                value={searchSessions}
                                onChange={(e) => setSearchSessions(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#f5f5f5' } }}
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
                                    ? formatTimeAgo(session.last_message_at)
                                    : ''
                                const isSelected = selectedSessionId === session.id
                                return (
                                    <ListItemButton
                                        key={session.id}
                                        selected={isSelected}
                                        onClick={() => setSelectedSessionId(session.id)}
                                        sx={{
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            py: 1.5,
                                            '&.Mui-selected': { backgroundColor: '#E3F2FD' },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                badgeContent={session.unread_count || 0}
                                                color="primary"
                                                invisible={!session.unread_count}
                                            >
                                                <Avatar sx={{ bgcolor: statusColor, width: 42, height: 42, fontSize: 17, fontWeight: 600 }}>
                                                    {initial}
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 170 }}>
                                                        {name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                                        {time}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" noWrap component="div">
                                                        {preview}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                                                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: statusColor }} />
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                                                            {session.ai_enabled ? 'IA' : session.status === 'escalated' ? 'Escalada' : 'Pausada'}
                                                        </Typography>
                                                        {session.client && (
                                                            <Chip label="Cliente" size="small" variant="outlined" color="primary" sx={{ height: 18, fontSize: 10, ml: 0.5 }} />
                                                        )}
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                )
                            })}
                            {(sessionsData?.results || []).length === 0 && (
                                <Box textAlign="center" py={6}>
                                    <ChatBubbleOutline sx={{ fontSize: 40, color: 'text.disabled' }} />
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        No hay conversaciones
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Card>

                    {/* Panel de chat */}
                    <Card sx={{ flex: 1, boxShadow, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {selectedSessionId ? (
                            <ChatPanel sessionId={selectedSessionId} sessions={sessionsData?.results || []} />
                        ) : (
                            <Box display="flex" alignItems="center" justifyContent="center" flex={1} flexDirection="column" gap={1}>
                                <ChatBubbleOutline sx={{ fontSize: 56, color: 'text.disabled' }} />
                                <Typography color="text.secondary">
                                    Selecciona una conversación
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Box>
            )}

            {/* TAB 1: RESUMEN */}
            {tab === 1 && (
                <Box>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
                    ) : (
                        <>
                            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={2} mb={3}>
                                <KPICard icon={<MessageIcon />} label="Mensajes Recibidos" value={totals?.messages_in.toString() || '0'} color="#0E6191" />
                                <KPICard icon={<SmartToyIcon />} label="Sesiones" value={totals?.sessions.toString() || '0'} color="#4caf50" />
                                <KPICard icon={<WarningIcon />} label="Escalaciones" value={totals?.escalations.toString() || '0'} color="#ff9800" />
                                <KPICard icon={<AttachMoneyIcon />} label="Costo USD" value={`$${totals?.cost.toFixed(2) || '0.00'}`} color="#e91e63" />
                            </Box>
                            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap={2} mb={3}>
                                <KPICard icon={<TrendingUpIcon />} label="Reservas Atribuidas" value={totals?.reservations.toString() || '0'} color="#9c27b0" />
                                <KPICard icon={<PersonSearchIcon />} label="Clientes Identificados" value={totals?.clients.toString() || '0'} color="#00bcd4" />
                                <KPICard icon={<MessageIcon />} label="Msgs IA / Humano" value={`${totals?.messages_out_ai || 0} / ${totals?.messages_out_human || 0}`} color="#607d8b" />
                            </Box>
                            <Card sx={{ boxShadow }}>
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
                                                <TableRow key={day.id} hover>
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

                            <Card sx={{ boxShadow, mt: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>Conversaciones Recientes</Typography>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Contacto</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell align="right">Mensajes</TableCell>
                                                <TableCell align="center">IA</TableCell>
                                                <TableCell>Último mensaje</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(sessionsData?.results || []).map((session) => {
                                                const name = session.client_name || session.wa_profile_name || session.wa_id
                                                const statusLabel: Record<string, string> = {
                                                    active: 'Activa',
                                                    ai_paused: 'IA Pausada',
                                                    escalated: 'Escalada',
                                                    closed: 'Cerrada',
                                                }
                                                const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
                                                    active: 'success',
                                                    ai_paused: 'warning',
                                                    escalated: 'error',
                                                    closed: 'default',
                                                }
                                                return (
                                                    <TableRow key={session.id} hover>
                                                        <TableCell>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>{name}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{session.wa_id}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={statusLabel[session.status] || session.status}
                                                                color={statusColor[session.status] || 'default'}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">{session.total_messages}</TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={session.ai_enabled ? 'Sí' : 'No'}
                                                                size="small"
                                                                color={session.ai_enabled ? 'primary' : 'default'}
                                                                variant="outlined"
                                                                sx={{ minWidth: 36 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                                                                {session.last_message_preview?.content || '—'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
                                                                {session.last_message_at ? formatTimeAgo(session.last_message_at) : ''}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            {(sessionsData?.results || []).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        <Typography variant="body2" color="text.secondary" py={2}>
                                                            No hay conversaciones
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Box>
            )}

            {/* TAB 2: INTENCIONES */}
            {tab === 2 && (
                <Card sx={{ boxShadow }}>
                    <CardContent>
                        <Typography variant="h6" mb={2}>Intenciones Detectadas</Typography>
                        {intentsAgg.length === 0 ? (
                            <Typography color="text.secondary">Sin datos de intenciones en este periodo</Typography>
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
                                            <TableRow key={intent} hover>
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

            {/* TAB 3: COSTOS */}
            {tab === 3 && (
                <Box>
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2} mb={3}>
                        <KPICard icon={<AttachMoneyIcon />} label="Costo Total Periodo" value={`$${totals?.cost.toFixed(4) || '0.0000'}`} color="#e91e63" />
                        <KPICard icon={<SmartToyIcon />} label="Tokens Totales" value={`${((totals?.tokens_in || 0) + (totals?.tokens_out || 0)).toLocaleString()}`} color="#673ab7" />
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
                                        <TableRow key={day.id} hover>
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

// ========= Chat Panel =========
function ChatPanel({ sessionId, sessions }: { sessionId: string; sessions: IChatSession[] }) {
    const { data: messages, isLoading, refetch } = useGetChatMessagesQuery(
        { sessionId },
        { pollingInterval: 5000 }
    )
    const [sendMessage, { isLoading: isSending }] = useSendChatMessageMutation()
    const [toggleAI] = useToggleChatAIMutation()
    const [messageText, setMessageText] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const session = sessions.find(s => s.id === sessionId)
    const displayName = session?.client_name || session?.wa_profile_name || session?.wa_id || 'Chat'
    const [aiEnabled, setAiEnabled] = useState(session?.ai_enabled ?? true)

    useEffect(() => {
        if (session) setAiEnabled(session.ai_enabled)
    }, [session?.ai_enabled])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Reset input cuando cambia de sesión
    useEffect(() => { setMessageText('') }, [sessionId])

    const sortedMessages = useMemo(() => {
        if (!messages) return []
        return [...messages].reverse()
    }, [messages])

    const handleSend = useCallback(async () => {
        if (!messageText.trim() || isSending) return
        const text = messageText.trim()
        setMessageText('')
        try {
            await sendMessage({ sessionId, content: text }).unwrap()
            refetch()
        } catch {
            setMessageText(text)
        }
    }, [messageText, sessionId, sendMessage, refetch, isSending])

    const handleToggleAI = useCallback(async (value: boolean) => {
        setAiEnabled(value)
        try {
            await toggleAI({ sessionId, ai_enabled: value }).unwrap()
        } catch {
            setAiEnabled(!value)
        }
    }, [sessionId, toggleAI])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const STATUS_COLORS: Record<string, string> = {
        active: '#4caf50',
        escalated: '#ff1744',
        ai_paused: '#e67e22',
        closed: '#9e9e9e',
    }

    return (
        <>
            {/* Header */}
            <Box sx={{
                px: 2.5, py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fafafa',
            }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: STATUS_COLORS[session?.status || 'active'], width: 36, height: 36, fontSize: 15 }}>
                        {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600}>{displayName}</Typography>
                        <Typography variant="caption" color="text.secondary">{session?.wa_id}</Typography>
                    </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title={aiEnabled ? 'IA respondiendo automáticamente' : 'IA pausada — respuestas manuales'}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="caption" color={aiEnabled ? 'primary' : 'text.secondary'} sx={{ mr: 0.5 }}>
                                IA
                            </Typography>
                            <Switch
                                size="small"
                                checked={aiEnabled}
                                onChange={(_, v) => handleToggleAI(v)}
                                color="primary"
                            />
                        </Box>
                    </Tooltip>
                </Box>
            </Box>

            {/* Banner IA pausada */}
            {!aiEnabled && (
                <Box sx={{ px: 2, py: 0.8, backgroundColor: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <SmartToyIcon sx={{ fontSize: 16, color: '#0E6191' }} />
                    <Typography variant="caption" color="primary">
                        IA pausada — estás respondiendo manualmente
                    </Typography>
                </Box>
            )}

            {/* Mensajes */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2, backgroundColor: '#f0f2f5' }}>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={6}><CircularProgress size={28} /></Box>
                ) : sortedMessages.length === 0 ? (
                    <Box textAlign="center" mt={6}>
                        <ChatBubbleOutline sx={{ fontSize: 40, color: 'text.disabled' }} />
                        <Typography variant="body2" color="text.secondary" mt={1}>Sin mensajes</Typography>
                    </Box>
                ) : (
                    sortedMessages.map((msg) => {
                        const isInbound = msg.direction === 'inbound'
                        const isAI = msg.direction === 'outbound_ai'
                        const isHuman = msg.direction === 'outbound_human'
                        const bgColor = isInbound ? '#fff' : isAI ? '#0E6191' : '#e67e22'
                        const textColor = isInbound ? '#1a1a1a' : '#fff'
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
                                        px: 2, py: 1.2,
                                        maxWidth: '65%',
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        borderRadius: isInbound ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    {isHuman && msg.sent_by_name && (
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.3, fontWeight: 600 }}>
                                            {msg.sent_by_name}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                        {msg.content}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: isInbound ? 'text.disabled' : 'rgba(255,255,255,0.6)',
                                            display: 'block',
                                            textAlign: 'right',
                                            mt: 0.5,
                                            fontSize: 10,
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

            {/* Input */}
            <Box sx={{
                px: 2, py: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                backgroundColor: '#fff',
            }}>
                <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={4}
                    placeholder="Escribe un mensaje..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!messageText.trim() || isSending}
                    sx={{
                        bgcolor: '#0E6191',
                        color: '#fff',
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: '#0a4d73' },
                        '&.Mui-disabled': { bgcolor: '#ccc', color: '#fff' },
                    }}
                >
                    {isSending ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
                </IconButton>
            </Box>
        </>
    )
}

// ========= Helpers =========
function formatTimeAgo(dateStr: string): string {
    const now = new Date()
    const d = new Date(dateStr)
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'ahora'
    if (diffMin < 60) return `${diffMin}m`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `${diffHrs}h`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays}d`
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
}

// ========= KPI Card =========
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
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="h6" fontWeight={700}>{value}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
