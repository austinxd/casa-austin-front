import { logout } from '@/services/auth/authSlice'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface Props {
    onCancel: () => void
}
export default function LogOut({ onCancel }: Props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logOut = () => {
        dispatch(logout())
        navigate('/')
    }

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
                Cerrar sesion
            </Typography>
            <Typography variant="body2" fontSize={16} fontWeight={400} textAlign={'center'}>
                ¿Esta seguro que desea cerrar sesion?
            </Typography>
            <Box display={'flex'} mt={2} gap={2} justifyContent={'center'}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={logOut}
                    sx={{
                        mt: 3,
                        mb: 1,
                        py: 2,
                        px: 4,
                        fontWeight: 400,
                        color: 'white',
                        ':hover': {
                            background: '#FF4C51',
                        },
                    }}
                >
                    Salir
                </Button>
            </Box>
        </Box>
    )
}
