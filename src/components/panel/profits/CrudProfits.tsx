import { Box, Typography } from '@mui/material'
import BarChartsVertical from '../../common/charts/BarChartVertical'
import TableAustin from '../../common/table/TableAustin'
import SearchProfits from './form/SearchProfits'
import { useState } from 'react'
import PaginationAustin from '../../common/pagination/PaginationAustin'
import SelectInputPrimary from '../../common/input/SelectInputPrimary'
import CardResponsiveProfit from './card/CardResponsiveProfit'

export default function CrudProfits() {
    const [setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState<number>(10)

    const rows = [
        {
            id: 1,
            first_name: 'John',
            number_doc: '12345678',
            type_home: 'Apartamento',
            check_in_date: '2024-04-01',
            price_sol: '470',
            tel_number: '123456789',
            type_document: 'dni',
        },
        {
            id: 2,
            first_name: 'Jane',
            number_doc: '87654321',
            type_home: 'Casa',
            check_in_date: '2024-04-05',
            price_sol: '540',
            tel_number: '987654321',
            type_document: 'dni',
        },
        {
            id: 3,
            first_name: 'Alice',
            number_doc: '13579246',
            type_home: 'Apartamento',
            check_in_date: '2024-04-10',
            price_sol: '580',
            tel_number: '246813579',
            type_document: 'dni',
        },
        {
            id: 4,
            first_name: 'Bob',
            number_doc: '56789123',
            type_home: 'Casa',
            check_in_date: '2024-04-15',
            price_sol: '690',
            tel_number: '789123456',
            type_document: 'dni',
        },
        {
            id: 5,
            first_name: 'Eve',
            number_doc: '24681357',
            type_home: 'Apartamento',
            check_in_date: '2024-04-20',
            price_sol: '1100',
            tel_number: '357246813',
            type_document: 'dni',
        },
        {
            id: 6,
            first_name: 'Michael',
            number_doc: '98765432',
            type_home: 'Casa',
            check_in_date: '2024-04-25',
            price_sol: '1200',
            tel_number: '654321987',
            type_document: 'dni',
        },
        {
            id: 7,
            first_name: 'Sarah',
            number_doc: '31415926',
            type_home: 'Apartamento',
            check_in_date: '2024-04-30',
            price_sol: '1380',
            tel_number: '159265358',
            type_document: 'dni',
        },
        {
            id: 8,
            first_name: 'David',
            number_doc: '11111111',
            type_home: 'Casa',
            check_in_date: '2024-05-01',
            price_sol: '0',
            tel_number: '222222222',
            type_document: 'dni',
        },
        {
            id: 9,
            first_name: 'Emily',
            number_doc: '22222222',
            type_home: 'Casa',
            check_in_date: '2024-05-05',
            price_sol: '0',
            tel_number: '333333333',
            type_document: 'dni',
        },
        {
            id: 10,
            first_name: 'James',
            number_doc: '33333333',
            type_home: 'Apartamento',
            check_in_date: '2024-05-10',
            price_sol: '0',
            tel_number: '444444444',
            type_document: 'dni',
        },
    ]

    const columns = [
        { field: 'first_name', headerName: 'NOMBRES', flex: 1, sortable: false },
        { field: 'number_doc', headerName: 'DOCUMENTO', flex: 1, sortable: false },
        { field: 'type_home', headerName: 'CASA', flex: 1, sortable: false },
        { field: 'check_in_date', headerName: 'CHECK-IN', flex: 1, sortable: false },
        { field: 'price_sol', headerName: 'MONTO S/.', flex: 1, sortable: false },
        /*         {
            field: 'tel_number',
            headerName: 'NÚMERO DE TELÉFONO',
            flex: 1,
            sortable: false,
            valueGetter: (params: any) => {
                const phoneNumber = params.value
                if (phoneNumber) {
                    const formattedPhoneNumber = `+${phoneNumber}`
                    return formattedPhoneNumber
                } else {
                    return '-'
                }
            },
        }, */
    ]

    return (
        <div>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Ingresos
            </Typography>
            <Box maxWidth={100}>
                <SelectInputPrimary
                    messageError=""
                    variant="outlined"
                    options={[
                        { value: '2024', label: '2024' },
                        { value: '2023', label: '2023' },
                        { value: '2022', label: '2022' },
                        { value: '2021', label: '2021' },
                    ]}
                    label={'Año'}
                />
            </Box>
            <BarChartsVertical
                categories={[
                    'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Setiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre',
                ]}
                data={[0, 0, 0, 470, 540, 580, 690, 1100, 1200, 1380, 0, 0]}
                isLoading={false}
                title="Ingresos del 2024"
            />

            <SearchProfits setCurrentPage={setCurrentPage} setSearch={setSearch} />
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
                <TableAustin columns={columns} rows={rows} isLoading={false} />
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
                    {rows.map((item) => (
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
                <Box px={1}>
                    <PaginationAustin
                        pageSize={pageSize}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={3}
                        dataCount={1}
                    />
                </Box>
            </Box>
        </div>
    )
}
