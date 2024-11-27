import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#000F08',
            light: '#F5F7FA',
            contrastText: '#FFF',
        },
        secondary: {
            main: '#3c3e94',
        },
        success: {
            main: '#0000ff',
        },
        error: {
            main: '#FF4C51',
        },
        background: {
            paper: '#FFFFFF',
            default: '#FCFBFB',
        },
        text: {
            primary: '#AFB0C0',
        },
    },
    typography: {
        allVariants: {
            fontFamily: 'Public Sans',
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    padding: '4px 15px',
                    boxShadow: 'none',
                    fontWeight: 800,
                    height: '45px',
                    fontSize: '16px',
                    textTransform: 'none',
                    '&.Mui-disabled': {
                        background: '#A2A2A2',
                        color: '#fff',
                    },
                    ':hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h1: {
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#0E6191',
                    '@media (max-width: 600px)': {
                        fontSize: 18,
                    },
                },
                h2: {
                    fontSize: 18,
                    fontWeight: 400,
                    color: '#444151',
                },
                h3: {
                    fontSize: 70,
                    fontWeight: 500,
                },
                h4: {
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#FFC41F',
                    '@media (max-width: 600px)': {
                        fontSize: 20,
                    },
                },
                h5: {
                    fontSize: 18,
                    fontWeight: 500,
                    '@media (max-width: 600px)': {
                        fontSize: 14,
                        fontWeight: 500,
                    },
                },
                subtitle1: {
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#444151',
                    '@media (max-width: 600px)': {
                        fontSize: 14,
                    },
                },
                subtitle2: {
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#444151',
                },
                body1: {
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#444151',
                },
                body2: {
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#000F08',
                    '@media (max-width: 600px)': {
                        fontSize: 13,
                    },
                },
            },
        },
    },
})
