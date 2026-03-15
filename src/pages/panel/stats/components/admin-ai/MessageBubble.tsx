import { Box, Typography } from '@mui/material'
import { IAdminChatMessage } from '@/interfaces/admin-ai.interface'
import ToolCallIndicator from './ToolCallIndicator'

const renderMarkdown = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^#### (.*$)/gm, '<h4 style="margin:12px 0 4px;font-size:14px">$1</h4>')
        .replace(/^### (.*$)/gm, '<h3 style="margin:16px 0 6px;font-size:15px">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 style="margin:16px 0 6px;font-size:16px">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 style="margin:16px 0 6px;font-size:17px">$1</h1>')
        .replace(/^---$/gm, '<hr style="margin:12px 0;border:none;border-top:1px solid #ccc"/>')
        .replace(/^- (.*$)/gm, '<li style="margin:2px 0">$1</li>')
        .replace(/\n/g, '<br />')
}

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
                    {isUser ? (
                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                lineHeight: 1.5,
                            }}
                        >
                            {message.content}
                        </Typography>
                    ) : (
                        <Typography
                            variant="body2"
                            component="div"
                            sx={{
                                wordBreak: 'break-word',
                                lineHeight: 1.6,
                                '& strong': { fontWeight: 700 },
                                '& h1, & h2, & h3, & h4': { fontWeight: 700, color: '#222' },
                                '& li': { marginLeft: '16px', listStyleType: 'disc' },
                                '& hr': { opacity: 0.5 },
                            }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                        />
                    )}
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
