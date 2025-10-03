import { SearchInputTable, useDebounce } from '@/components/common'
import { useBoxShadow } from '@/core/utils'
import { Box, Button, MenuItem, Select, useTheme } from '@mui/material'

import { useEffect, useState } from 'react'

interface Props {
    onSave: () => void
    setSearch: any
    setCurrentPage: any
    text: string
    setPageSize: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
    setOrdering: React.Dispatch<React.SetStateAction<string>>
    ordering: string
}

export default function SearchClient({
    setOrdering,
    ordering,
    setPageSize,
    pageSize,
    onSave,
    setSearch,
    setCurrentPage,
    text,
}: Props) {
    const [inputText, setInputText] = useState('')
    const textFiler: string = useDebounce(inputText, 450)
    const { palette } = useTheme()
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
    const handleOrderingChange = (event: any) => {
        setOrdering(event.target.value as string)
        setCurrentPage(1)
    }
    return (
        <>
            <Box
                sx={{
                    background: palette.primary.contrastText,
                    boxShadow: useBoxShadow(true),
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '@media (max-width: 900px)': {
                        p: 0,
                        background: 'transparent',
                        flexDirection: 'column-reverse',
                        boxShadow: 'none',
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
                    <SearchInputTable
                        fullWidth
                        onChange={handleSearchChange}
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
                    <Select
                        value={ordering}
                        onChange={handleOrderingChange}
                        displayEmpty
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
                        <MenuItem value="">Sin orden</MenuItem>
                        <MenuItem value="-points_balance">Mayor puntos</MenuItem>
                        <MenuItem value="-level">Mayor nivel</MenuItem>
                        <MenuItem value="last_name">Apellido (A-Z)</MenuItem>
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
