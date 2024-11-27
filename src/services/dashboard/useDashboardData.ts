import { useEffect, useState } from 'react'
import { useGetDashboardQuery } from '@/services/dashboard/dashboardSlice'

export const useDashboardData = (month: number, year: number) => {
    const { data, isLoading } = useGetDashboardQuery({
        month: month.toString(),
        year: year.toString(),
    })

    const [colorData, setColorData] = useState<string[]>([])
    const [freeDaysData, setFreeDaysData] = useState<number[]>([])
    const [sellsData, setSellsData] = useState<number[]>([])
    const [nightsBusyData, setNightsBusyData] = useState<number[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])

    useEffect(() => {
        if (data) {
            const sortedData = [...data.free_days_per_house].sort((a, b) => {
                const numA = parseInt(a.casa.match(/\d+/)?.[0] || '0')
                const numB = parseInt(b.casa.match(/\d+/)?.[0] || '0')
                return numA - numB
            })

            setColorData(sortedData.map((item) => item.property__background_color))
            setFreeDaysData(sortedData.map((item) => parseFloat(item.dias_libres.toFixed(1))))
            setSellsData(sortedData.map((item) => parseFloat(item.dinero_facturado.toFixed(1))))
            setNightsBusyData(sortedData.map((item) => parseFloat(item.dias_ocupada.toFixed(1))))
            setCategoryData(sortedData.map((item) => item.casa.match(/\d+/)?.[0]?.toString() || ''))
        }
    }, [data])

    return {
        colorData,
        freeDaysData,
        sellsData,
        nightsBusyData,
        categoryData,
        isLoading,
        data,
    }
}
