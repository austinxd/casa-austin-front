// Utility functions for safe number formatting and data normalization

export const safeNumber = (value: any, fallback: number = 0): number => {
    if (value === null || value === undefined || value === '') {
        return fallback
    }
    
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    return isNaN(num) ? fallback : num
}

export const formatNumber = (value: any, fallback: number = 0): string => {
    const num = safeNumber(value, fallback)
    return num.toLocaleString()
}

export const formatPercent = (value: any, decimals: number = 1, fallback: number = 0): string => {
    const num = safeNumber(value, fallback)
    return `${num.toFixed(decimals)}%`
}

export const formatDecimal = (value: any, decimals: number = 1, fallback: number = 0): string => {
    const num = safeNumber(value, fallback)
    return num.toFixed(decimals)
}

export const formatCurrency = (value: any, currency: string = 'PEN', fallback: number = 0): string => {
    const num = safeNumber(value, fallback)
    return `${currency} ${num.toLocaleString()}`
}

export const safeArray = <T>(value: any, fallback: T[] = []): T[] => {
    return Array.isArray(value) ? value : fallback
}

export const safeString = (value: any, fallback: string = ''): string => {
    if (value === null || value === undefined) {
        return fallback
    }
    return String(value)
}