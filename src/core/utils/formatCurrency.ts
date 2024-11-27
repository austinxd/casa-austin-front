const formatCurrency = (cuantity: number): string => {
    const cuantityNewFormat = cuantity.toLocaleString('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    return cuantityNewFormat
}

export default formatCurrency
