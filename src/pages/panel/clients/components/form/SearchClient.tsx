import { useDebounce } from '@/components/common'
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'

import { useEffect, useState } from 'react'

interface Props {
    onSave: () => void
    setSearch: any
    setCurrentPage: any
    text: string
    setPageSize: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
}

export default function SearchClient({
    setPageSize,
    pageSize,
    onSave,
    setSearch,
    setCurrentPage,
    text,
}: Props) {
    const [inputText, setInputText] = useState('')
    const textFiler: string = useDebounce(inputText, 450)

    useEffect(() => {
        setSearch(textFiler)
        setCurrentPage(1)
    }, [textFiler])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value)
    }
    const handlePageSizeChange = (event: any) => {
        setPageSize(event.target.value as number)
    }
    return (
        <>
            <Box
                sx={{
                    border: '1px solid #E6E6E8',
                    borderRadius: 1,
                    height: { md: 88, sm: 54, xs: 'auto' },
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    '@media (max-width: 900px)': {
                        px: 0,
                        border: 'none',
                        flexDirection: 'column-reverse',
                        gap: 1,
                        alignItems: 'end',
                    },
                }}
            >
                <Box
                    display={'flex'}
                    sx={{
                        '@media (max-width: 700px)': {
                            width: '100%',
                        },
                    }}
                >
                    <TextField
                        fullWidth
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
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                {
                                    display: 'none',
                                    color: '#2F2B3D',
                                    opacity: 0.9,
                                },
                            '& input:-webkit-autofill': {
                                webkitBoxShadow:
                                    '0 0 0px 1000px #F5F8FA inset' /* Resetear el borde */,
                                boxShadow: '0 0 0px 1000px #F5F8FA inset' /* Resetear el borde */,
                                color: '#2F2B3D',
                                opacity: 0.9,
                                fontWeight: 600,
                            },
                        }}
                        type="text"
                        placeholder="Buscar"
                    />
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        sx={{
                            height: '45px',
                            marginLeft: '6px',
                            border: 'none',
                            borderRadius: '8px',
                            '& .MuiSelect-outlined': {
                                outline: 'none',
                                borderRadius: '8px',
                                border: 'none',
                                padding: '8px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #D1D0D4',
                            },
                        }}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </Box>

                <Box>
                    <Button
                        sx={{
                            height: 38,
                            width: 167,
                            color: 'white',
                            background: '#0E6191',
                            fontSize: '15px',
                            fontWeight: 400,
                            ':hover': {
                                background: '#0E6191',
                            },
                            '@media (max-width: 700px)': {
                                width: 117,
                                px: 0,
                                fontSize: 13,
                            },
                        }}
                        onClick={onSave}
                    >
                        {text}
                    </Button>
                </Box>
            </Box>
        </>
    )
}
