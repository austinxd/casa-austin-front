import { TextField, TextFieldProps } from '@mui/material'

interface BaseProps {
    placeholder: string
}
type Props = BaseProps & TextFieldProps

export default function SearchInputTable({ placeholder, ...props }: Props) {
    return (
        <TextField
            fullWidth
            {...props}
            sx={{
                '& .MuiOutlinedInput-root': {
                    height: '45px',
                    color: '#2F2B3D',
                    opacity: 0.9,
                    '& fieldset': {
                        color: '#2F2B3D',
                        opacity: 0.9,
                        background: 'transparent',
                        borderRadius: 2,
                        border: '1px solid #D1D0D4',
                    },
                    '&:hover fieldset': {
                        border: '1px solid #D1D0D4',
                    },
                    '&.Mui-focused fieldset': {
                        border: '1px solid #D1D0D4',
                    },
                },
                '& input': {
                    height: '24px',
                    color: '#2F2B3D',
                    opacity: 0.9,
                    fontSize: '16px',
                    fontWeight: 600,
                    backgroundColor: '#FFF',
                },
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none',
                    color: '#2F2B3D',
                    opacity: 0.9,
                },
                '& input:-webkit-autofill': {
                    webkitBoxShadow: '0 0 0px 1000px #F5F8FA inset', // Resetear el borde
                    boxShadow: '0 0 0px 1000px #F5F8FA inset', // Resetear el borde
                    color: '#2F2B3D',
                    opacity: 0.9,
                    fontWeight: 600,
                },
            }}
            type="text"
            placeholder={placeholder}
        />
    )
}
