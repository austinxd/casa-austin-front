import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Box, Typography } from '@mui/material'

interface PhoneInputComponentProps {
    label?: string
    messageError?: string
    countryCode?: string
}

const InputPhone = ({ messageError, countryCode }: PhoneInputComponentProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '0px',
                height: 82,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Alinea los elementos a los extremos
                }}
            >
                {countryCode && (
                    <Typography
                        variant="subtitle1"
                        sx={{ marginRight: '8px', color: '#2F2B3D', fontWeight: '600' }}
                    >
                        +{countryCode}
                    </Typography>
                )}
                <PhoneInput
                    inputStyle={{
                        height: 55,
                        border: '1px solid #D1D0D4',
                        color: '#2F2B3D',
                        width: 'auto',
                        borderRadius: '8px',
                    }}
                    inputProps={{ name: 'tel_number' }} // Nombre del campo de entrada, se usará para el react-hook-form
                />
            </Box>

            <Typography
                color={'error'}
                fontSize={11}
                ml={1.5}
                mt={0.2}
                textAlign={'start'}
                variant="subtitle2"
            >
                {messageError}
            </Typography>
        </Box>
    )
}

export default InputPhone
