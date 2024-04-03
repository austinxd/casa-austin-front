import { Box, TextField, TextFieldProps, Typography, styled } from '@mui/material'
import { RefObject, forwardRef } from 'react'

const CssTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        height: '55px',
        color: '#2F2B3D',

        opacity: 0.9,
        '& fieldset': {
            color: '#2F2B3D',
            opacity: 0.9,
            background: 'transparent',
            borderRadius: '8px',
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
        webkitBoxShadow: '0 0 0px 1000px #F5F8FA inset' /* Resetear el borde */,
        boxShadow: '0 0 0px 1000px #F5F8FA inset' /* Resetear el borde */,
        color: '#2F2B3D',
        opacity: 0.9,
        fontWeight: 600,
    },
})

type BaseProps = {
    label?: string
    placeholder?: string
    messageError?: string
    type: 'number' | 'text'
}

type Props = BaseProps & TextFieldProps

export const SecondaryInput = forwardRef(function SecondaryInput(
    { placeholder, label, messageError, type, ...textFieldProps }: Props,
    ref: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined
) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '0px',
                height: 82,
            }}
        >
            <CssTextField
                autoComplete="off"
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                {...textFieldProps}
                ref={ref}
                type={type}
                label={label}
            />

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
})

SecondaryInput.displayName = 'SecondaryInput'
