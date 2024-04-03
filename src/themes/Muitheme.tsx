'use client'

import { CssBaseline, ThemeProvider } from '@mui/material'
import React, { useState } from 'react'
import { lightTheme } from './light-theme'
import { darkTheme } from './dark-theme'

function getActiveTheme(themeMode: 'light' | 'dark') {
    return themeMode === 'light' ? lightTheme : darkTheme
}

function Muitheme({ children }: { children: React.ReactNode }) {
    const [selectedTheme] = useState<'light' | 'dark'>('light')

    const activeTheme = getActiveTheme(selectedTheme)

    return (
        <ThemeProvider key={selectedTheme} theme={activeTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default Muitheme
