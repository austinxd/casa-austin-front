import { Box, TextField, TextFieldProps, Typography, styled } from '@mui/material'
import { RefObject, forwardRef } from 'react'

const CssTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        color: 'white',
        '& fieldset': {
            borderColor: 'white',
            background: 'transparent',
            borderRadius: '5px',
            color: 'white',
        },
    },
    '& input': {
        borderRadius: '5px',
        color: 'white !important',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: 'transparent',
        '::-ms-reveal': { color: 'white  !important', display: 'none' },
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0px 1000px #0E6191 inset',
        boxShadow: '0 0 0px 1000px #0E6191 inset',
        color: 'white  !important',
        background: '#0E6191',
        fontWeight: 400,
    },
    '& .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill': {
        WebkitTextFillColor: 'white',
        borderRadius: '4px',
        background: 'transparent',
    },
})

type BaseProps = {
    label?: string
    placeholder?: string
    messageError?: string
    color: 'secondary' | 'primary' | 'info'
}

type Props = BaseProps & TextFieldProps

export const InputPrimary = forwardRef(function InputPrimary(
    { placeholder, label, messageError, color = 'secondary', ...textFieldProps }: Props,
    ref: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined
) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 85,
                color: 'white',
            }}
        >
            <CssTextField
                color={color}
                focused
                autoComplete="off"
                type="text"
                variant="outlined"
                label={label}
                placeholder={placeholder}
                {...textFieldProps}
                ref={ref}
            />

            <Typography color={'error'} variant="body1" mt={0.5}>
                {messageError}
            </Typography>
        </Box>
    )
})

InputPrimary.displayName = 'InputPrimary'
