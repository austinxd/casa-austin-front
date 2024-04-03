import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1F283E',
        },
        secondary: {
            main: '#FFD700',
        },
        success: {
            main: '#08AE6E',
        },
        error: {
            main: '#DD6158',
        },
        background: {
            paper: '#1F283E',
        },
    },
    typography: {
        allVariants: {
            fontFamily: 'Montserrat',
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '14px 38px',
                    boxShadow: 'none',
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    '&.Mui-disabled': {
                        background: '#A2A2A2',
                        color: '#fff',
                    },
                    '&:hover': {
                        opacity: 1,
                        boxShadow: 'none',
                    },
                    '@media (max-width: 600px)': {
                        fontSize: 12,
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h1: {
                    fontSize: 28,
                    fontWeight: 500,
                },
                h2: {
                    fontSize: 13.5,
                    fontWeight: 400,
                },
                h3: {
                    fontSize: 70,
                    fontWeight: 500,
                },
                h4: {
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#FFD700',
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
                    fontSize: 14,
                    fontWeight: 300,
                },
                subtitle2: {
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#fffff',
                },
                body1: {
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#FFFFFF',
                },
                body2: {
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#FFFFFF',
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: '6px', boxShadow: '4px 4px 10px 0px rgba(0, 0, 0, 0.10)' },
            },
        },
    },
})
