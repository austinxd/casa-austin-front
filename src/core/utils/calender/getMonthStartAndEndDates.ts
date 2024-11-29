export const getMonthStartAndEndDates = (months: string[], currentYear: number) => {
    const monthStartDates = months.map((month) => `${currentYear}-${month}-01`)
    const monthEndDates = months.map((_month: string, index) => {
        const nextMonth = index === 11 ? '01' : months[index + 1]
        const nextYear = index === 11 ? currentYear + 1 : currentYear
        return `${nextYear}-${nextMonth}-01`
    })
    return { monthStartDates, monthEndDates }
}
