import { Box, Checkbox, FormControlLabel, MenuItem, Select, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import { SearchInputTable, useDebounce } from '@/components/common'

interface Props {
    setSearch: any
    setCurrentPage: any
    typeRent: string
    setTypeRent: React.Dispatch<React.SetStateAction<string>>
    setPageSize: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
}

export default function SearchProfits({
    setSearch,
    setPageSize,
    pageSize,
    setCurrentPage,
    typeRent,
    setTypeRent,
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

    const toggleFilter = (
        filterSetter: React.Dispatch<React.SetStateAction<string>>,
        value: string
    ) => {
        filterSetter((prev) => (prev === '' ? (value === 'air' ? 'air' : 'aus') : ''))
    }

    const commonCheckboxStyles = {
        mr: 0,
        p: 0.5,
    }

    const labelTypographyStyles = {
        color: '#000F08',
        fontSize: { md: '15px', sm: '14px', xs: '13px' },
        fontWeight: 400,
        opacity: 0.8,
    }
    return (
        <>
            <Box
                sx={{
                    mt: 3,
                    border: '1px solid #E6E6E8',
                    borderRadius: 1,
                    px: 2,
                    pt: 2,
                    pb: { md: 2, sm: 2, xs: 1 },
                    gap: 1,
                    display: 'flex',
                    flexDirection: { md: 'row', sm: 'row', xs: 'column' },
                    alignItems: { md: 'center', sm: 'center', xs: 'end' },
                    justifyContent: 'space-between',
                }}
            >
                <Box display={'flex'} width={'100%'} maxWidth={370}>
                    <SearchInputTable placeholder="Buscar" onChange={handleSearchChange} />
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
                    <FormControlLabel
                        onClick={() => toggleFilter(setTypeRent, 'air')}
                        control={
                            <Checkbox
                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                checked={typeRent === 'air'}
                                sx={{
                                    ...commonCheckboxStyles,
                                    color: '#EB4C60',
                                    '&.Mui-checked': { color: '#EB4C60' },
                                }}
                            />
                        }
                        label={<Typography sx={labelTypographyStyles}>Airbnb</Typography>}
                    />
                    <FormControlLabel
                        sx={{ mr: 0 }}
                        onClick={() => toggleFilter(setTypeRent, 'aus')}
                        control={
                            <Checkbox
                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                checked={typeRent === 'aus'}
                                sx={{
                                    ...commonCheckboxStyles,
                                    color: '#0E6191',
                                    '&.Mui-checked': { color: '#0E6191' },
                                }}
                            />
                        }
                        label={<Typography sx={labelTypographyStyles}>Casa Austin</Typography>}
                    />
                </Box>
            </Box>
        </>
    )
}
