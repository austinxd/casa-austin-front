import {
    TextField,
    TextFieldProps,
    styled,
    Typography,
    InputAdornment,
    IconButton,
    Box,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { RefObject, forwardRef, useState } from 'react'
type BaseProps = {
    label?: string
    placeholder?: string
    messageError?: string
    color: 'secondary' | 'primary' | 'info'
}

type Props = BaseProps & TextFieldProps

export const InputPrimaryPassword = forwardRef(function InputPrimaryPassword(
    { placeholder, label, messageError, color, ...textFieldProps }: Props,
    ref: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined
) {
    const [showPassword, setShowPassword] = useState(false)
    const CssTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
                borderColor: 'white', // Cambiado de "color" a "borderColor"
                background: 'transparent',
                borderRadius: '5px',
            },
        },
        '& input': {
            borderRadius: '5px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: 'transparent',
            '::-ms-reveal': {
                display: 'none',
            },
        },
        '& input::placeholder': {
            color: 'white', // Cambiar el color del placeholder a blanco
        },
        '& input:-moz-selection': {
            color: 'white', // Cambiar el color del placeholder a blanco
        },
        '& input::selection': {
            color: 'white', // Cambiar el color del placeholder a blanco
        },
        '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0px 1000px red inset',
            boxShadow: '0 0 0px 1000px red inset',
            color: 'white',
            background: 'red',
            fontWeight: 400,
        },
        '& input:-webkit-autofill:hover, input:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0px 1000px red inset',
            boxShadow: '0 0 0px 1000px red inset',
        },
    })
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }
    return (
        <Box sx={{ height: 85 }}>
            <CssTextField
                autoComplete="off"
                label={label}
                focused
                color={color}
                ref={ref}
                id="input-with-icon-textfield"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                placeholder={placeholder}
                {...textFieldProps}
                sx={{ width: '100%', background: 'transparent' }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff color="info" fontSize="small" />
                                ) : (
                                    <Visibility color="info" fontSize="small" />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Typography color={'error'} variant="body1" mt={0.5}>
                {messageError}
            </Typography>
        </Box>
    )
})

InputPrimaryPassword.displayName = 'InputPrimaryPassword'
