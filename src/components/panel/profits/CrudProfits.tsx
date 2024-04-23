import { Box, Typography } from '@mui/material'
import BarChartsVertical from '../../common/charts/BarChartVertical'
import TableAustin from '../../common/table/TableAustin'
import SearchProfits from './form/SearchProfits'
import { useEffect, useState } from 'react'
import PaginationAustin from '../../common/pagination/PaginationAustin'
import SelectInputPrimary from '../../common/input/SelectInputPrimary'
import CardResponsiveProfit from './card/CardResponsiveProfit'
import {
    useGetAllRentalsForEarningsQuery,
    useGetEarningsPerMonthQuery,
} from '../../../libs/services/rentals/rentalService'
import { IRentalClient } from '../../../interfaces/rental/registerRental'
import { useLocation } from 'react-router-dom'

type MonthNameToNumber = {
    [monthName: string]: number
}
export default function CrudProfits() {
    const params = useLocation()
    const currentYear = new Date().getFullYear()
    const currentMonthNumber = new Date().getMonth() + 1
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState<number>(10)
    const [month, setMonth] = useState<number>(currentMonthNumber)
    const [monthSelect, setMonthSelect] = useState('')
    const [meses, setMeses] = useState<string[]>()
    const [ganancias, setGanancias] = useState<string[]>()
    const [year, setYear] = useState<number>(currentYear)
    const [filterAirbnb, setFilterAirbnb] = useState('')
    const [filterAus, setFilterAus] = useState('')
    const [earningsMonth, setEarningsMonth] = useState('')
    const { data, isLoading, refetch } = useGetAllRentalsForEarningsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        month: month,
        year: year,
        type: filterAirbnb ? filterAirbnb : filterAus,
        exclude: 'man',
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

    const formattedRows = data?.results.map((rental: IRentalClient) => ({
        id: rental.id,
        first_name:
            rental.origin === 'air'
                ? rental.client.first_name != ''
                    ? rental.client.first_name
                    : 'Airbnb'
                : rental.client.first_name,
        number_doc: rental.client.number_doc ? rental.client.number_doc : '-',
        type_home: rental.property.name,
        check_in_date: rental.check_in_date,
        type_reservation:
            rental.origin === 'air'
                ? 'Reserva Airbnb'
                : rental.origin === 'man'
                  ? 'Mantenimiento'
                  : 'Reserva Local',
        price_sol: rental.price_sol,
        tel_number: rental.client.tel_number,
        type_document: rental.client.type_document,
        origin: rental.origin,
    }))
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
    const columns = [
        {
            field: 'first_name',
            headerName: 'NOMBRES',
            flex: 1,
            sortable: false,
            renderCell: (params: any) => {
                return (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'start',
                            padding: '0px 8px',
                            alignItems: 'center',
                        }}
                    >
                        {' '}
                        {params.row.origin === 'air' ? (
                            <img
                                src="../airbnb.png"
                                height={20}
                                style={{ borderRadius: '4px', marginRight: '4px' }}
                                width={20}
                            />
                        ) : (
                            <Box
                                sx={{
                                    borderRadius: '4px',
                                    marginRight: '4px',
                                    paddingTop: '2px',
                                    border: '1px solid #C6C6C6',
                                }}
                                height={20}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                width={20}
                                boxShadow="4px 4px 20px rgba(0, 0, 0, 0.3)"
                            >
                                {params.row.type_home.replace(/\D/g, '')}
                            </Box>
                        )}
                        {params.row.first_name}
                    </div>
                )
            },
        },
        { field: 'type_reservation', headerName: 'TIPO', flex: 1, sortable: false },
        { field: 'number_doc', headerName: 'DOCUMENTO', flex: 1, sortable: false },
        { field: 'type_home', headerName: 'CASA', flex: 1, sortable: false },
        { field: 'check_in_date', headerName: 'CHECK-IN', flex: 1, sortable: false },
        { field: 'price_sol', headerName: 'MONTO S/.', flex: 1, sortable: false },
    ]

    const options = []
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        options.push({ value: i.toString(), label: i.toString() })
    }

    return (
        <div>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Ingresos
            </Typography>
            <Box maxWidth={100}>
                <SelectInputPrimary
                    messageError=""
                    variant="outlined"
                    options={options}
                    label={'Año'}
                    onChange={handleYearChange}
                    defaultValue={currentYear.toString()}
                />
            </Box>
            <BarChartsVertical
                categories={meses}
                setMonthSelect={setMonthSelect}
                data={ganancias}
                isLoading={isLoadingChart}
                title={`El mes de ${monthSelect ? monthSelect.charAt(0).toUpperCase() + monthSelect.slice(1) : currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} ganaste S/. ${earningsMonth}`}
            />

            <SearchProfits
                setFilterAirbnb={setFilterAirbnb}
                setFilterAus={setFilterAus}
                filterAirbnb={filterAirbnb}
                filterAus={filterAus}
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
                    columns={columns}
                    rows={data?.results ? formattedRows : []}
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
                    {formattedRows?.map((item) => (
                        <CardResponsiveProfit
                            key={item.id}
                            check_in_date={item.check_in_date}
                            document_type={item.type_document}
                            number_doc={item.number_doc}
                            price_sol={item.price_sol}
                            tel_number={item.tel_number}
                            first_name={item.first_name}
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
    )
}
