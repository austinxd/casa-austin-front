import { Box, Button, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
    text: string
    title: string
    icon: ReactNode
    onCancel: () => void
}

export default function SuccessCard({ icon, onCancel, text, title }: Props) {
    return (
        <Box textAlign={'center'}>
            <Typography mb={2}>{title}</Typography>
            {icon}
            <Typography variant="subtitle2" mt={2}>
                {text}
            </Typography>
            <Button
                sx={{
                    height: 38,
                    width: 167,
                    color: 'white',
                    background: '#0E6191',
                    fontSize: '15px',
                    fontWeight: 400,
                    mt: 4,
                    ':hover': {
                        background: '#0E6191',
                    },
                }}
                onClick={onCancel}
            >
                {' '}
                Volver
            </Button>
        </Box>
    )
}
