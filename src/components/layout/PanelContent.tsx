import { Box, BoxProps } from '@mui/material'

interface PanelContentProps extends BoxProps {
    children: React.ReactNode
}

export default function PanelContent({ children, sx, ...props }: PanelContentProps) {
    return (
        <Box
            sx={{
                px: { xs: 1.5, sm: 3 },
                py: { xs: 1.5, sm: 3 },
                width: '100%',
                maxWidth: '100%',
                ...sx
            }}
            {...props}
        >
            {children}
        </Box>
    )
}