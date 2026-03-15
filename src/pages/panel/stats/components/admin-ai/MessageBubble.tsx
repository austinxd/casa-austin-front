import { Box, Typography } from '@mui/material'
import { IAdminChatMessage } from '@/interfaces/admin-ai.interface'
import ToolCallIndicator from './ToolCallIndicator'

interface Props {
    message: IAdminChatMessage
}

export default function MessageBubble({ message }: Props) {
    const isUser = message.role === 'user'

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                mb: 1.5,
            }}
        >
            <Box
                sx={{
                    maxWidth: '75%',
                    minWidth: 60,
                }}
            >
                {!isUser && message.tool_calls && message.tool_calls.length > 0 && (
                    <ToolCallIndicator toolCalls={message.tool_calls} />
                )}
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: isUser
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                        backgroundColor: isUser ? '#0E6191' : '#f0f0f0',
                        color: isUser ? '#fff' : '#333',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: 1.5,
                            '& strong': { fontWeight: 700 },
                        }}
                    >
                        {message.content}
                    </Typography>
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 0.3,
                        px: 1,
                        color: '#999',
                        textAlign: isUser ? 'right' : 'left',
                        fontSize: 10,
                    }}
                >
                    {new Date(message.created).toLocaleTimeString('es-PE', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Typography>
            </Box>
        </Box>
    )
}
