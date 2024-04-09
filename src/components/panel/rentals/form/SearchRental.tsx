import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../../common/useDebounce'

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
        // Cambia el estado de filterAirbnb a 'air' si actualmente está vacío o a '', si ya tiene el valor 'air'
        setFilterAirbnb((prevState) => (prevState === '' ? 'air' : ''))
    }
    const onCheckToday = () => {
        // Cambia el estado de filterAirbnb a 'air' si actualmente está vacío o a '', si ya tiene el valor 'air'
        setFilterToday((prevState) => (prevState === '' ? 'today' : ''))
    }

    return (
        <>
            <Box
                sx={{
                    border: '1px solid #E6E6E8',
                    borderRadius: 1,
                    height: { md: 88, sm: 54, xs: 54 },
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    '@media (max-width: 900px)': {
                        px: 0,
                        border: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        '@media (max-width: 700px)': {
                            width: 180,
                        },
                    }}
                >
                    <TextField
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
                </Box>

                <Box gap={1} display={'flex'}>
                    <Box>
                        <FormControlLabel
                            onClick={onCheckAirbnb}
                            control={
                                <Checkbox
                                    checked={filterAirbnb === 'air'}
                                    sx={{
                                        mr: 0,
                                        p: 0.5,

                                        color: 'red',
                                        '&.Mui-checked': {
                                            color: 'blue',
                                        },
                                        '&.MuiFormControlLabel-label': {
                                            color: 'red',
                                        },
                                    }}
                                />
                            }
                            label="Airbnb"
                        />
                        <FormControlLabel
                            onClick={onCheckToday}
                            control={
                                <Checkbox
                                    checked={filterToday === 'today'}
                                    sx={{ mr: 0, p: 0.5 }}
                                />
                            }
                            label="Check in hoy"
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
