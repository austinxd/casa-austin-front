import { useEffect, useRef } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { IAdminChatMessage } from '@/interfaces/admin-ai.interface'
import MessageBubble from './MessageBubble'

interface Props {
    messages: IAdminChatMessage[]
    isLoading?: boolean
    isSending?: boolean
}

export default function ChatMessages({ messages, isLoading, isSending }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isSending])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <CircularProgress size={30} />
            </Box>
        )
    }

    if (messages.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    color: '#999',
                    gap: 1,
                }}
            >
                <Typography variant="h6" color="inherit">
                    Asistente IA Financiero
                </Typography>
                <Typography variant="body2" color="inherit" textAlign="center" maxWidth={400}>
                    Pregunta sobre ingresos, ocupaci&oacute;n, reservas, precios, clientes
                    o cualquier m&eacute;trica de tu negocio. Consulto datos reales.
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                px: 2,
                py: 2,
            }}
        >
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {isSending && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="text.secondary">
                        Analizando datos...
                    </Typography>
                </Box>
            )}

            <div ref={bottomRef} />
        </Box>
    )
}
