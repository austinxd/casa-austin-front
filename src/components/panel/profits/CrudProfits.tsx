import { Box, Typography } from '@mui/material'
import BarChartsVertical from '../../common/charts/BarChartVertical'
import SearchProfits from './form/SearchProfits'
import { useEffect, useState } from 'react'
import PaginationAustin from '../../common/pagination/PaginationAustin'
import CardResponsiveProfit from './card/CardResponsiveProfit'
import {
    useGetAllRentalsForEarningsQuery,
    useGetEarningsPerMonthQuery,
} from '../../../libs/services/rentals/rentalService'
import { IRentalClient } from '../../../interfaces/rental/registerRental'
import { useLocation } from 'react-router-dom'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
import { SelectInputs, TableAustin } from '../../common'

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
    const reformDate = (dateString: string) => {
        const parts = dateString.split('-')
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`
        return formattedDate
    }
    const formattedRows = data?.results.map((rental: IRentalClient) => ({
        id: rental.id,
        first_name:
            rental.origin === 'air'
                ? rental.client.first_name != ''
                    ? rental.client.first_name
                    : 'Airbnb'
                : rental.client.first_name,
        last_name:
            rental.origin === 'air'
                ? rental.client.last_name != ''
                    ? rental.client.last_name
                    : ' '
                : rental.client.last_name,
        number_doc: rental.client.number_doc ? rental.client.number_doc : '-',
        type_home: rental.property.name,
        check_in_date: reformDate(rental.check_in_date),
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
            field: 'last_name',
            headerName: 'PROPIEDAD',
            flex: 0.5,
            sortable: false,
            renderCell: (params: any) => {
                let displayName = `${params.row.first_name} ${params.row.last_name}`
                if (displayName.length > 32) {
                    displayName = `${displayName.substring(0, 29)}...`
                }
                return (
                    <div>
                        {params.row.origin === 'air' ? (
                            <Box display={'flex'}>
                                <img
                                    src="../airbnb.png"
                                    height={20}
                                    style={{ borderRadius: '4px', marginRight: '4px' }}
                                    width={20}
                                />{' '}
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
                                    boxShadow="4px 4px 20px rgba(0, 0, 0, 0.2)"
                                >
                                    {params.row.type_home.replace(/\D/g, '')}
                                </Box>
                            </Box>
                        ) : (
                            <Box display={'flex'}>
                                <HouseRoundedIcon
                                    fontSize="small"
                                    sx={{
                                        marginRight: 0.5,
                                        color: 'white',
                                        borderRadius: '2px',
                                        p: 0.15,
                                        background: '#2C608D',
                                    }}
                                />
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
                            </Box>
                        )}
                    </div>
                )
            },
        },
        {
            field: 'first_name',
            headerName: 'NOMBRES',
            flex: 1,
            sortable: false,
            renderCell: (params: any) => {
                let displayName = `${params.row.first_name} ${params.row.last_name}`
                if (displayName.length > 32) {
                    displayName = `${displayName.substring(0, 29)}...`
                }
                return (
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'start',
                            padding: '0px 36px',
                            alignItems: 'center',
                        }}
                    >
                        {params.row.origin === 'air' ? (
                            <Box display={'flex'}>
                                {/*                                 <img
                                    src="../airbnb.png"
                                    height={20}
                                    style={{ borderRadius: '4px', marginRight: '4px' }}
                                    width={20}
                                /> */}
                                {displayName}
                            </Box>
                        ) : (
                            <Box display={'flex'}>{displayName}</Box>
                        )}
                    </div>
                )
            },
        },
        { field: 'number_doc', headerName: 'DOCUMENTO', flex: 0.7, sortable: false },
        { field: 'check_in_date', headerName: 'CHECK-IN', flex: 1, sortable: false },
        { field: 'price_sol', headerName: 'MONTO S/.', flex: 1, sortable: false },
    ]

    const options = []
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        options.push({ value: i.toString(), label: i.toString() })
    }

    return (
        <div>
            <Box mb={{ md: 3, sm: 1, xs: 1 }} display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h1">Ingresos</Typography>{' '}
                <Box maxWidth={100}>
                    <SelectInputs
                        messageError=""
                        variant="outlined"
                        options={options}
                        label={'Año'}
                        onChange={handleYearChange}
                        defaultValue={currentYear.toString()}
                    />
                </Box>
            </Box>

            <BarChartsVertical
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
    )
}
