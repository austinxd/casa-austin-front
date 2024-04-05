import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Typography } from '@mui/material'

interface Props {
    onCancel: () => void
    data: any
    title: string
}

export default function ModalErrors({ onCancel, title, data }: Props) {
    return (
        <Box px={{ md: 4, sm: 4, xs: 0 }} position={'relative'}>
            <IconButton
                onClick={onCancel}
                sx={{
                    p: 0.8,
                    borderRadius: '8px',
                    position: 'absolute',
                    right: '-3px',
                    top: '-3px',
                    background: '#FF4C51',
                    color: 'white',
                    ':hover': {
                        background: '#FF4C51',
                    },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <Typography mb={3} fontSize={18}>
                {title}
            </Typography>
            <Typography variant="body2" fontSize={16} fontWeight={400} textAlign={'center'}>
                {data.detail ? data.detail : data.message}
            </Typography>

            <Box display={'flex'} mt={2} gap={2} justifyContent={'center'}>
                <Button
                    variant="contained"
                    onClick={onCancel}
                    sx={{
                        mt: 3,
                        mb: 1,
                        py: 2,
                        px: 4,
                        background: '#0E6191',
                        fontWeight: 400,
                        color: 'white',
                        ':hover': {
                            background: '#0E6191',
                        },
                    }}
                >
                    Volver
                </Button>
            </Box>
        </Box>
    )
}
