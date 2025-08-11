import { Box, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

type Status = 'approved' | 'pending' | 'incomplete' | string

export function StatusIcon({ status, size = 24 }: { status?: Status; size?: number }) {
    const { palette } = useTheme()

    const map = {
        approved: {
            icon: <CheckCircleIcon sx={{ color: 'green' }} fontSize="inherit" />,
            color: 'green',
            label: 'Aprobado',
        },

        pending: {
            icon: <ScheduleRoundedIcon fontSize="inherit" />,
            color: palette.info.main,
            label: 'Pendiente',
        },
        incomplete: {
            icon: <CloseRoundedIcon sx={{ color: 'red' }} fontSize="inherit" />,
            color: palette.error.main,
            label: 'Incompleto',
        },
    } as const

    const fallback = {
        icon: <ScheduleRoundedIcon fontSize="inherit" />,
        color: palette.text.disabled,
        label: 'Desconocido',
    }
    const { icon, color, label } = (status && (map as any)[status]) ?? fallback

    return (
        <Box
            role="img"
            aria-label={label}
            sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                bgcolor: 'common.white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: Math.round(size * 0.75), // tamaño del ícono relativo
                color, // color del ícono
                lineHeight: 0,
            }}
        >
            {icon}
        </Box>
    )
}
