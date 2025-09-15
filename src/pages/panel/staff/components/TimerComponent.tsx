import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { AccessTime as TimerIcon } from '@mui/icons-material'

interface TimerComponentProps {
    startTime: string
}

export default function TimerComponent({ startTime }: TimerComponentProps) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const startTimeMs = new Date(startTime).getTime()
        
        const updateElapsed = () => {
            const now = new Date().getTime()
            const elapsedMs = now - startTimeMs
            setElapsed(Math.max(0, Math.floor(elapsedMs / 1000))) // en segundos
        }
        
        // Actualizar inmediatamente
        updateElapsed()
        
        // Actualizar cada segundo
        const interval = setInterval(updateElapsed, 1000)
        
        return () => clearInterval(interval)
    }, [startTime])

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'info.light',
            color: 'info.dark',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            border: '1px solid',
            borderColor: 'info.main'
        }}>
            <TimerIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600}>
                {formatTime(elapsed)}
            </Typography>
        </Box>
    )
}