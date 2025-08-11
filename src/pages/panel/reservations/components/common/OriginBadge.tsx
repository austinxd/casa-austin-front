// components/common/OriginBadge.tsx
import { Box, Typography, SxProps, Theme, Tooltip, useTheme } from '@mui/material'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import HouseIcon from '@mui/icons-material/House'
import ConstructionIcon from '@mui/icons-material/Construction'
import { AirbnbIcon } from '@/components/common'

interface Props {
    origin: string
    guests?: number | string
    onClick?: () => void
    sx?: SxProps<Theme>
    size?: 'sm' | 'md' // para ajustar densidad si quieres
}

export default function OriginBadge({ origin, guests, onClick, sx, size = 'md' }: Props) {
    const { palette } = useTheme()
    const isAir = origin === 'air'
    const showGuests = origin === 'air' || origin === 'client' || origin === 'aus'

    const iconSx = { color: 'white', fontSize: size === 'md' ? 20 : 18, p: 0, m: 0 }

    const icon =
        origin === 'air' ? (
            <AirbnbIcon />
        ) : origin === 'client' ? (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '20px',
                    width: '20px',
                    background: 'white',
                    borderRadius: 1,
                    mr: 0.2,
                }}
            >
                <GroupOutlinedIcon sx={{ fontSize: 18, color: palette.secondary.main }} />
            </Box>
        ) : origin === 'aus' ? (
            <HouseIcon sx={iconSx} />
        ) : (
            <ConstructionIcon sx={{ ...iconSx, fontSize: size === 'md' ? 18 : 16 }} />
        )

    const label =
        origin === 'air'
            ? 'Airbnb'
            : origin === 'client'
              ? 'Cliente directo'
              : origin === 'aus'
                ? 'Propia (aus)'
                : 'Manual'

    return (
        <Tooltip title={label}>
            <Box
                onClick={onClick}
                sx={{
                    background: isAir ? '#FF5A5F' : 'transparent', // corregido "transparent"
                    color: isAir ? 'white' : 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    cursor: onClick ? 'pointer' : 'default',
                    p: 0.3,
                    ...sx,
                }}
            >
                {icon}
                {showGuests && (
                    <Typography
                        component="span"
                        sx={{
                            fontSize: size === 'md' ? 14 : 13,
                            ml: origin === 'air' ? 0.5 : 0.3,
                            lineHeight: 1,
                            color: 'white',
                        }}
                    >
                        {guests}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    )
}
