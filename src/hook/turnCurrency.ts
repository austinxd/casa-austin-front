const turnCurrency = (e: string): string => {
    switch (e) {
        case 'sol':
            return 'Soles'
        case 'usd':
            return 'Dolares'
        default:
            return ''
    }
}

export default turnCurrency
