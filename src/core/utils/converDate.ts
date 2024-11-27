const ConverDate = (date: string) => {
    const months = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
    ]
    const dateObj = new Date(`${date}T00:00:00`)
    const day = dateObj.toLocaleString('es-ES', { day: '2-digit' })
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()

    return `${day} ${month} ${year}`
}

export default ConverDate
