import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

interface SearchInputTableProps extends Omit<TextFieldProps, 'onChange'> {
    searchTerm: string
    onSearchChange: (searchTerm: string) => void
}

const SearchInputTable: React.FC<SearchInputTableProps> = ({
    searchTerm,
    onSearchChange,
    ...rest
}) => {
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value)
    }

    return (
        <TextField
            {...rest}
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
                '& .MuiOutlinedInput-root': {
                    height: '45px',
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
                    webkitBoxShadow: '0 0 0px 1000px #F5F8FA inset',
                    boxShadow: '0 0 0px 1000px #F5F8FA inset',
                    color: '#2F2B3D',
                    opacity: 0.9,
                    fontWeight: 600,
                },
            }}
        />
    )
}

export default SearchInputTable
