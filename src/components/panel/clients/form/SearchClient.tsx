import { Box, Button, TextField } from '@mui/material'
import { useDebounce } from '../../../common/useDebounce'
import { useEffect, useState } from 'react'

interface Props {
    onSave: () => void
    setSearch: any
    setCurrentPage: any
    text: string
}

export default function SearchClient({ onSave, setSearch, setCurrentPage, text }: Props) {
    const [inputText, setInputText] = useState('')
    const textFiler: string = useDebounce(inputText, 450)

    useEffect(() => {
        setSearch(textFiler)
        setCurrentPage(1)
    }, [textFiler])

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value)
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
