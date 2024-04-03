import { Box, FormControl, InputLabel, MenuItem, Select, Typography, styled } from '@mui/material'

import { SelectProps } from '@mui/material/Select'
interface Option {
    value: string | number
    label: string
}
interface BaseProps {
    label: string
    messageError: string
    options: Option[]
}

type Props = BaseProps & SelectProps

const CssFormControl = styled(FormControl)({
    '& .MuiOutlinedInput-root': {
        height: '55px',
        color: '#2F2B3D',
        opacity: 0.9,
        '& fieldset': {
            borderRadius: '8px',
            border: '1px solid #D1D0D4',
            background: 'transparent',
        },
        '&:hover fieldset': {
            border: '1px solid #D1D0D4',
        },
        '&.Mui-focused fieldset': {
            border: '1px solid #D1D0D4',
        },
    },
    '& .MuiSelect-select': {
        textAlign: 'left',
    },
    '& .MuiInputBase-input': {
        color: '#2F2B3D',
        fontSize: '16px',
        fontWeight: 600,
        height: '24px',
    },
})
export default function SelectInputPrimary({
    label,
    options,
    messageError,
    ...selectProps
}: Props) {
    return (
        <Box height={82}>
            <CssFormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    defaultValue={''}
                    {...selectProps}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={label}
                >
                    {options.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{ color: '#2F2B3D', opacity: 0.9 }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
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
            </CssFormControl>
        </Box>
    )
}
