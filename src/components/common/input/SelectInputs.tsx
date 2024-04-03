'use client'
import { Box, MenuItem, Select, SelectProps, Typography, styled } from '@mui/material'
import { RefObject, forwardRef } from 'react'

const CssSelect = styled(Select)({
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
}

type Props = BaseProps & SelectProps

export const SelectInputs = forwardRef(function SelectInputs(
    { placeholder, label, messageError, ...textFieldProps }: Props,
    ref: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined
) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '0px',
            }}
        >
            <CssSelect
                fullWidth
                placeholder={placeholder}
                {...textFieldProps}
                ref={ref}
                label={label}
                sx={{}}
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </CssSelect>

            <Typography color={'error'} ml={1.5} mt={0.2} variant="subtitle2">
                {messageError}
            </Typography>
        </Box>
    )
})

SelectInputs.displayName = 'SelectInputs'
