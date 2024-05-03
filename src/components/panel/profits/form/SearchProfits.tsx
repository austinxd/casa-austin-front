import {
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { useDebounce } from '../../../common/useDebounce'
import { useEffect, useState } from 'react'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'

interface Props {
    setSearch: any
    setCurrentPage: any
    filterAirbnb: string
    filterAus: string
    setFilterAirbnb: React.Dispatch<React.SetStateAction<string>>
    setFilterAus: React.Dispatch<React.SetStateAction<string>>
    setPageSize: React.Dispatch<React.SetStateAction<number>>
    pageSize: number
}

export default function SearchProfits({
    setSearch,
    setPageSize,
    pageSize,
    setCurrentPage,
    setFilterAus,
    filterAirbnb,
    filterAus,
    setFilterAirbnb,
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

    const onCheckAirbnb = () => {
        setFilterAirbnb((prevState) => (prevState === '' ? 'air' : ''))
    }
    const onCheckAus = () => {
        setFilterAus((prevState) => (prevState === '' ? 'aus' : ''))
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
                    mt: 3,
                    height: { md: 88, sm: 54, xs: 54 },
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    '@media (max-width: 1000px)': {
                        px: 0,
                        border: 'none',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 80,
                    },
                }}
            >
                <Box
                    display={'flex'}
                    sx={{
                        '@media (max-width: 1000px)': {
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

                <Box
                    gap={{ md: 1, sm: 0.5, xs: 0.3 }}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                        '@media (max-width: 1000px)': {
                            width: '100%',
                            justifyContent: 'start',
                            pl: 1,
                        },
                    }}
                >
                    <Box mt={{ xs: 1 }}>
                        <FormControlLabel
                            onClick={onCheckAirbnb}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterAirbnb === 'air'}
                                    sx={{
                                        mr: 0,
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
                            sx={{
                                '@media (max-width: 1000px)': {
                                    mr: 0.4,
                                },
                            }}
                            onClick={onCheckAus}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterAus === 'aus'}
                                    sx={{
                                        mr: 0,
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
                                    Casa Austin
                                </Typography>
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}
