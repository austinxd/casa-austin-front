import { useState } from 'react'
import { Box, useTheme } from '@mui/material'
import { BarCharts } from '@/components/common'
import { useBoxShadow } from '@/core/utils'
import SumaryCards from './components/summary-cards/SumaryCards'
import RankingSellers from './components/sellers/RankingSellers'
import { monthNames } from '@/core/utils/time-options'
import OptionTabs from './components/chart-dashboard/OptionTabs'
import DashboardHeader from './components/header/DashboardHeader'
import { useDashboardData } from '@/services/dashboard/useDashboardData'
import DashboardSkeleton from './skeletons/DashboardSkeleton'

export default function CrudDashboard() {
    const currentDate = new Date()
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
    const [selectedOption, setSelectedOption] = useState(1)
    const { palette } = useTheme()
    const { colorData, freeDaysData, sellsData, nightsBusyData, categoryData, isLoading, data } =
        useDashboardData(selectedMonth, currentYear)

    const handlePrevMonth = () => {
        if (selectedMonth > 1) setSelectedMonth(selectedMonth - 1)
        else {
            setSelectedMonth(12)
            setCurrentYear(currentYear - 1)
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth < 12) setSelectedMonth(selectedMonth + 1)
        else {
            setSelectedMonth(1)
            setCurrentYear(currentYear + 1)
        }
    }

    const handleYearChange = (event: any) => setCurrentYear(event.target.value)

    return (
        <>
            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    <DashboardHeader
                        selectedMonth={selectedMonth}
                        currentYear={currentYear}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        onYearChange={handleYearChange}
                    />

                    <SumaryCards data={data} />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            mt: 3,
                            '@media (max-width: 1100px)': {
                                flexDirection: 'column',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1.5,
                                background: palette.primary.contrastText,
                                height: 'fit-content',
                                borderRadius: 2,
                                boxShadow: useBoxShadow(true),
                            }}
                        >
                            <Box
                                display={'flex'}
                                px={3}
                                pt={3}
                                width={'100%'}
                                justifyContent={'space-between'}
                                flexDirection={{
                                    md: 'row',
                                    sm: 'column-reverse',
                                    xs: 'column-reverse',
                                }}
                            >
                                <OptionTabs
                                    options={['Ventas', 'Disponibilidad', 'Ocupación']}
                                    selectedOption={selectedOption}
                                    onSelect={setSelectedOption}
                                />
                            </Box>
                            {selectedOption === 1 ? (
                                <BarCharts
                                    selectedOption={selectedOption}
                                    isLoading={isLoading}
                                    colors={colorData}
                                    data={sellsData}
                                    categories={categoryData}
                                />
                            ) : null}
                            {selectedOption === 2 ? (
                                <BarCharts
                                    selectedOption={selectedOption}
                                    isLoading={isLoading}
                                    colors={colorData}
                                    data={freeDaysData}
                                    categories={categoryData}
                                />
                            ) : null}
                            {selectedOption === 3 ? (
                                <BarCharts
                                    selectedOption={selectedOption}
                                    isLoading={isLoading}
                                    colors={colorData}
                                    data={nightsBusyData}
                                    categories={categoryData}
                                />
                            ) : null}
                        </Box>
                        <RankingSellers
                            currentYear={currentYear}
                            data={data}
                            monthNames={monthNames}
                            selectedMonth={selectedMonth}
                        />
                    </Box>
                </>
            )}
        </>
    )
}
