import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../../common/useDebounce'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'

interface Props {
    onSave: () => void
    setSearch: React.Dispatch<React.SetStateAction<string>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    setFilterAirbnb: React.Dispatch<React.SetStateAction<string>>
    filterAirbnb: string
    setFilterToday: React.Dispatch<React.SetStateAction<string>>
    filterToday: string
}

export default function SearchRental({
    onSave,
    setSearch,
    setCurrentPage,
    setFilterAirbnb,
    filterAirbnb,
    filterToday,
    setFilterToday,
}: Props) {
    const [inputText, setInputText] = useState('')
    const textFiler: string = useDebounce(inputText, 400)

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
    const onCheckToday = () => {
        setFilterToday((prevState) => (prevState === '' ? 'today' : ''))
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
                    '@media (max-width: 1000px)': {
                        px: 0,
                        gap: 1,
                        border: 'none',
                        flexDirection: 'column-reverse',
                        alignItems: ' ',
                    },
                    '@media (max-width: 900px)': {
                        mt: 6,
                    },
                    '@media (max-width: 600px)': {
                        mt: 1,
                    },
                }}
            >
                <Box
                    sx={{
                        width: '240px',
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
                                width: '100%',
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
                </Box>

                <Box
                    gap={{ md: 1, sm: 0.5, xs: 0.3 }}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                        '@media (max-width: 1000px)': {
                            width: '100%',
                            justifyContent: 'space-between',
                            pl: 1,
                        },
                    }}
                >
                    <Box>
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
                            onClick={onCheckToday}
                            control={
                                <Checkbox
                                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                    checked={filterToday === 'today'}
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
                                    Check-in proximos
                                </Typography>
                            }
                        />
                    </Box>
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
                        Añadir Alquiler
                    </Button>
                </Box>
            </Box>
        </>
    )
}
