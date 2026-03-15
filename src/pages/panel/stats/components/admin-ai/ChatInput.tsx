import { useState } from 'react'
import { Box, TextField, IconButton } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

interface Props {
    onSend: (message: string) => void
    disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
    const [text, setText] = useState('')

    const handleSend = () => {
        const trimmed = text.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setText('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#fff',
            }}
        >
            <TextField
                fullWidth
                multiline
                maxRows={4}
                size="small"
                placeholder="Escribe tu consulta..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                    },
                }}
            />
            <IconButton
                color="primary"
                onClick={handleSend}
                disabled={disabled || !text.trim()}
                sx={{
                    backgroundColor: '#0E6191',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#0a4d73' },
                    '&.Mui-disabled': { backgroundColor: '#ccc', color: '#fff' },
                    width: 42,
                    height: 42,
                }}
            >
                <SendIcon />
            </IconButton>
        </Box>
    )
}
