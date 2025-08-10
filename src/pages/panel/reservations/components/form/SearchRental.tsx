import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    Typography,
    SelectChangeEvent,
    useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useBoxShadow } from '@/core/utils'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import { SearchInputTable, useDebounce } from '@/components/common'

interface Props {
    onSave: () => void
    setSearch: React.Dispatch<React.SetStateAction<string>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    setPageSize: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
    setFilterAirbnb: React.Dispatch<React.SetStateAction<string>>
    filterAirbnb: string
    setFilterToday: React.Dispatch<React.SetStateAction<string>>
    filterToday: string
    setFilterInProgress: React.Dispatch<React.SetStateAction<string>>
    filterInProgress: string
    setFilterStatus: React.Dispatch<React.SetStateAction<string>>
    filterStatus: string
}

export default function SearchRental({
    onSave,
    setSearch,
    setCurrentPage,
    setPageSize,
    pageSize,
    setFilterAirbnb,
    filterAirbnb,
    setFilterToday,
    filterToday,
    setFilterInProgress,
    filterInProgress,
    setFilterStatus,
    filterStatus,
}: Props) {
    const [inputText, setInputText] = useState('')
    const textFilter: string = useDebounce(inputText, 400)
    const { palette } = useTheme()
    useEffect(() => {
        setSearch(textFilter)
        setCurrentPage(1)
    }, [textFilter, setSearch, setCurrentPage])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value)
    }

    // Asegúrate de que esta es la única definición de handlePageSizeChange en este archivo
    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        setPageSize(Number(event.target.value))
    }

    const onCheckAirbnb = () => {
        setFilterAirbnb((prevState) => (prevState === '' ? 'air' : ''))
    }

    const onCheckToday = () => {
        setFilterToday((prevState) => (prevState === '' ? 'today' : ''))
    }

    const onCheckInProgress = () => {
        setFilterInProgress((prevState) => (prevState === '' ? 'in_progress' : ''))
    }

    const onCheckInStatus = () => {
        setFilterStatus((prevState) => (prevState === '' ? 'pending' : ''))
    }

    return (
        <>
            <Box
                sx={{
                    background: palette.primary.contrastText,
                    boxShadow: useBoxShadow(true),
                    border: `1px solid ${palette.background.paper}`,
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '@media (max-width: 1000px)': {
                        gap: 1,
                        boxShadow: 'none',
                        p: 0,
                        background: 'transparent',
                        border: 'none',
                        flexDirection: 'column-reverse',
                        alignItems: 'start',
                    },
                }}
            >
                <Box
                    display={'flex'}
                    sx={{
                        width: '280px',
                        '@media (max-width: 1000px)': {
                            width: '100%',
                        },
                    }}
                >
                    <SearchInputTable
                        fullWidth
                        value={inputText}
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
                </Box>

                <Box
                    gap={{ md: 1, sm: 0.5, xs: 1 }}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'start'}
                    flexDirection={{
                        lg: 'row',
                        md: 'column-reverse',
                        sm: 'column-reverse',
                        xs: 'column-reverse',
                    }}
                    sx={{
                        '@media (max-width: 1000px)': {
                            width: '100%',
                            justifyContent: 'space-between',
                        },
                    }}
                >
                    <Box>
                        <FormControlLabel
                            sx={{ mr: { md: 2, sm: 1.2, xs: 1.3 }, ml: -0.6 }}
                            onClick={onCheckAirbnb}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterAirbnb === 'air'}
                                    sx={{
                                        mr: -0.4,
                                        p: 0.5,
                                        color: '#EB4C60',
                                        '&.Mui-checked': {
                                            color: '#EB4C60',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: '#000F08',
                                        fontSize: { md: '15px', sm: '14px', xs: '13px' },
                                        fontWeight: 400,
                                        opacity: 0.8,
                                    }}
                                >
                                    Airbnb
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            sx={{ mr: { md: 2, sm: 1.2, xs: 1.3 } }}
                            onClick={onCheckToday}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterToday === 'today'}
                                    sx={{
                                        mr: -0.4,
                                        p: 0.5,
                                        color: '#0E6191',
                                        '&.Mui-checked': {
                                            color: '#0E6191',
                                        },
                                        '&.MuiFormControlLabel-label': {
                                            color: '#0E6191',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: '#000F08',
                                        fontSize: { md: '15px', sm: '14px', xs: '13px' },
                                        fontWeight: 400,
                                        opacity: 0.8,
                                    }}
                                >
                                    Futuras
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            sx={{ mr: { md: 2, sm: 1.2, xs: 1.3 } }}
                            onClick={onCheckInProgress}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterInProgress === 'in_progress'}
                                    sx={{
                                        mr: -0.4,
                                        p: 0.5,
                                        color: '#2F2B3D',
                                        '&.Mui-checked': {
                                            color: '#2F2B3D',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: '#000F08',
                                        fontSize: { md: '15px', sm: '14px', xs: '13px' },
                                        fontWeight: 400,
                                        opacity: 0.8,
                                    }}
                                >
                                    En curso
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            sx={{ mr: 1 }}
                            onClick={onCheckInStatus}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterStatus === 'pending'}
                                    sx={{
                                        mr: -0.4,
                                        p: 0.5,
                                        color: '#2F2B3D',
                                        '&.Mui-checked': {
                                            color: '#2F2B3D',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: '#000F08',
                                        fontSize: { md: '15px', sm: '14px', xs: '13px' },
                                        fontWeight: 400,
                                        opacity: 0.8,
                                    }}
                                >
                                    Pendientes{' '}
                                </Typography>
                            }
                        />
                    </Box>
                    <Button
                        sx={{
                            height: 38,
                            width: { lg: 170, sm: '100%', xs: '100%' },
                            color: 'white',
                            background: '#0E6191',
                            fontSize: '15px',
                            fontWeight: 400,
                            ':hover': {
                                background: '#0E6191',
                            },
                        }}
                        onClick={onSave}
                    >
                        Añadir Alquiler
                    </Button>
                </Box>
            </Box>
        </>
    )
}
