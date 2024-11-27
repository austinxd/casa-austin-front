import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import SearchProfits from './components/filter/SearchProfits'
import CardResponsiveProfit from './components/card/CardResponsiveProfit'
import { useLocation } from 'react-router-dom'
import {
    useGetAllRentalsForEarningsQuery,
    useGetEarningsPerMonthQuery,
} from '@/services/rentals/rentalService'
import { BarChartsProfits, PaginationAustin, SelectInputs, TableAustin } from '@/components/common'
import { yearOptions } from '@/core/utils/time-options'
import ColumTableProfits from './components/table/ColumTableProfits'
import formatRowsProfits from '@/services/profits/formatRowsProfits'
import ProfitsSkeleton from './components/skeleton/ProfitsSkeleton'

type MonthNameToNumber = {
    [monthName: string]: number
}
export default function CrudProfits() {
    const params = useLocation()
    const currentYear = new Date().getFullYear()
    const currentMonthNumber = new Date().getMonth() + 1
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [month, setMonth] = useState<number>(currentMonthNumber)
    const [monthSelect, setMonthSelect] = useState('')
    const [meses, setMeses] = useState<string[]>(['1'])
    const [ganancias, setGanancias] = useState<string[]>(['2'])
    const [year, setYear] = useState<number>(currentYear)
    const [typeRent, setTypeRent] = useState('')

    const [earningsMonth, setEarningsMonth] = useState('')

    const { data, isLoading, refetch } = useGetAllRentalsForEarningsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        month: month,
        year: year,
        type: typeRent,
        exclude: 'man',
        from_check_in: true,
    })
    const {
        data: dataForChart,
        isLoading: isLoadingChart,
        refetch: refetchChart,
    } = useGetEarningsPerMonthQuery({
        year: year,
    })

    useEffect(() => {
        const currentDate = new Date()
        const currentMonth = currentDate.toLocaleString('es', { month: 'long' })
        const getEarningsForSelectedMonth = (selectedMonth: string) => {
            if (dataForChart) {
                if (selectedMonth === '') {
                    setEarningsMonth(dataForChart[currentMonth.toLocaleLowerCase()])
                } else {
                    setEarningsMonth(dataForChart[selectedMonth.toLocaleLowerCase()])
                }
            }
        }
        getEarningsForSelectedMonth(monthSelect)
    }, [monthSelect, dataForChart])

    useEffect(() => {
        refetch()
        refetchChart()
    }, [params.pathname])

    useEffect(() => {
        const separateChartData = (data: any) => {
            const months = Object.keys(data).map(
                (monthName) => monthName.charAt(0).toUpperCase() + monthName.slice(1)
            )
            const values = Object.values(data).map(String)

            return { months, values }
        }
        if (dataForChart) {
            const { months, values } = separateChartData(dataForChart)
            setGanancias(values)
            setMeses(months)
        }
    }, [dataForChart])

    const monthNameToNumber: MonthNameToNumber = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Setiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12,
    }
    useEffect(() => {
        if (monthSelect !== '') {
            const selectedMonthNumber = monthNameToNumber[monthSelect]
            setMonth(selectedMonthNumber)
        }
    }, [monthSelect])
    const handleYearChange = (newYear: any) => {
        setYear(newYear.target.value)
    }
    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleString('es', { month: 'long' })

    return (
        <>
            {isLoading || isLoadingChart ? (
                <ProfitsSkeleton />
            ) : (
                <div>
                    <Box
                        mb={{ md: 3, sm: 1, xs: 1 }}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Typography variant="h1">Ingresos</Typography>
                        <Box maxWidth={100}>
                            <SelectInputs
                                messageError=""
                                variant="outlined"
                                options={yearOptions}
                                label={'Año'}
                                onChange={handleYearChange}
                                defaultValue={currentYear.toString()}
                            />
                        </Box>
                    </Box>

                    <BarChartsProfits
                        categories={meses}
                        setMonthSelect={setMonthSelect}
                        data={ganancias}
                        isLoading={isLoadingChart}
                        month={
                            monthSelect
                                ? monthSelect.charAt(0).toUpperCase() + monthSelect.slice(1)
                                : currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)
                        }
                        earningsMonth={earningsMonth}
                        title={`El mes de ${monthSelect ? monthSelect.charAt(0).toUpperCase() + monthSelect.slice(1) : currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ganaste S/. ${earningsMonth}`}
                    />

                    <SearchProfits
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        setTypeRent={setTypeRent}
                        typeRent={typeRent}
                        setCurrentPage={setCurrentPage}
                        setSearch={setSearch}
                    />
                    <Box
                        sx={{
                            pb: 1.5,
                            background: 'white',
                            borderEndEndRadius: '8px',
                            borderEndStartRadius: '8px',
                            borderBottom: '1px solid #E6E5E7',
                            borderLeft: '1px solid #E6E5E7',
                            borderRight: '1px solid #E6E5E7',
                            '@media (max-width: 1000px)': {
                                borderBottom: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                            },
                        }}
                    >
                        <TableAustin
                            columns={ColumTableProfits}
                            rows={data?.results ? formatRowsProfits({ data }) : []}
                            isLoading={isLoading}
                        />
                        <Box
                            sx={{
                                display: 'none',
                                mt: 1,
                                '@media (max-width: 1000px)': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                },
                            }}
                        >
                            {formatRowsProfits({ data })?.map((item) => (
                                <CardResponsiveProfit
                                    key={item.id}
                                    check_in_date={item.check_in_date}
                                    document_type={item.type_document}
                                    number_doc={item.number_doc}
                                    price_sol={item.price_sol}
                                    tel_number={item.tel_number}
                                    first_name={item.first_name}
                                    origin={item.origin}
                                    type_home={item.type_home}
                                />
                            ))}
                        </Box>
                        {data && (
                            <Box px={1}>
                                <PaginationAustin
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPages={data?.total_paginas}
                                    dataCount={data.count}
                                />
                            </Box>
                        )}
                    </Box>
                </div>
            )}
        </>
    )
}
