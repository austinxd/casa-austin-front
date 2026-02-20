import { Box, Typography, Button, CircularProgress, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import DownloadIcon from '@mui/icons-material/Download'
import dayjs, { Dayjs } from 'dayjs'
import style from './rental.module.css'
import Card from './components/card/Card'
import FormRental from './components/form/FormRental'
import { useState } from 'react'
import DetailRental from './components/form/DetailRental'
import DeleteRental from './components/form/DeleteRental'
import { useGetAllRentalsQuery, useLazyGetAllRentalsForEarningsQuery } from '@/services/rentals/rentalService'
import SearchRental from './components/form/SearchRental'
import { BasicModal, PaginationAustin } from '@/components/common'
import { IRentalClient } from '@/interfaces/rental/registerRental'
import { downloadContractById } from '@/services/rentals/rental'
import ReservationSkeleton from './components/skeleton/ReservationSkeleton'
import { exportRentalsToExcel } from '@/services/rentals/exportRentals'

export default function CrudRentals() {
    const [open, setOpen] = useState(false)
    const [del, setDel] = useState(false)
    const [detail, setDetail] = useState(false)
    const [dataRental, setDataRental] = useState<IRentalClient | null>(null)
    const [title, setTitle] = useState('')
    const [btn, setBtn] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [search, setSearch] = useState('')
    const [filterAirbnb, setFilterAirbnb] = useState('')
    const [filterToday, setFilterToday] = useState('')
    const [filterInProgress, setFilterInProgress] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterInClient, setFilterClient] = useState('')
    const [filterCreatedToday, setFilterCreatedToday] = useState('')

    const [isLoadingContract, setIsLoadingContract] = useState(false)
    const [exportMonth, setExportMonth] = useState<Dayjs>(dayjs())
    const [isExporting, setIsExporting] = useState(false)
    const [triggerExportQuery] = useLazyGetAllRentalsForEarningsQuery()

    const { data, isLoading, refetch } = useGetAllRentalsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        from: filterInProgress || filterToday || filterStatus,
        type: filterAirbnb || filterInClient,
        created_today: filterCreatedToday,
    })

    const onSave = () => {
        setOpen(true)
        setTitle('Añadir Alquiler')
        setBtn('Guardar nuevo alquiler')
    }

    const onEdit = (item: IRentalClient) => {
        setOpen(true)
        setTitle('Editar alquiler')
        setBtn('Guardar cambios')
        setDataRental(item)
    }

    const onView = (item: IRentalClient) => {
        setDetail(true)
        setDataRental(item)
    }

    const onDelete = (item: IRentalClient) => {
        setDel(true)
        setDataRental(item)
    }

    const handleDownload = async (id: string, name: string, check_in: string) => {
        setIsLoadingContract(true)
        try {
            await downloadContractById(id, name, check_in)
            console.log('Download successful')
        } catch (error) {
            console.error('Download failed', error)
        } finally {
            setIsLoadingContract(false)
        }
    }
    const onContract = (item: IRentalClient) => {
        handleDownload(item.id.toString(), item.client.first_name, item.check_in_date)
    }

    const MONTH_NAMES = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ]

    const handleExportExcel = async () => {
        setIsExporting(true)
        try {
            const month = exportMonth.month() + 1
            const year = exportMonth.year()
            const result = await triggerExportQuery({
                month,
                year,
                page_size: 1000,
                page: 1,
                search: '',
                type: '',
                exclude: '',
                from_check_in: true,
            }).unwrap()

            if (!result.results || result.results.length === 0) {
                alert('No se encontraron reservas para el mes seleccionado')
                return
            }

            const monthLabel = `${MONTH_NAMES[month - 1]}_${year}`
            exportRentalsToExcel(result.results, monthLabel)
        } catch (error) {
            console.error('Error al exportar:', error)
            alert('Error al obtener las reservas. Intente nuevamente.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div>
            {isLoading ? (
                <ReservationSkeleton />
            ) : (
                <>
                    <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                        Alquileres
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <DatePicker
                            label="Mes a exportar"
                            views={['month', 'year']}
                            value={exportMonth}
                            onChange={(val) => val && setExportMonth(val)}
                            slotProps={{
                                textField: { size: 'small', sx: { width: 200 } },
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={isExporting ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
                            onClick={handleExportExcel}
                            disabled={isExporting}
                            size="medium"
                        >
                            {isExporting ? 'Exportando...' : 'Descargar Excel'}
                        </Button>
                    </Stack>

                    <SearchRental
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        setSearch={setSearch}
                        setCurrentPage={setCurrentPage}
                        onSave={onSave}
                        filterAirbnb={filterAirbnb}
                        setFilterAirbnb={setFilterAirbnb}
                        filterToday={filterToday}
                        setFilterToday={setFilterToday}
                        setFilterInProgress={setFilterInProgress}
                        filterInProgress={filterInProgress}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        filterInClient={filterInClient}
                        setFilterClient={setFilterClient}
                        filterCreatedToday={filterCreatedToday}
                        setFilterCreatedToday={setFilterCreatedToday}
                    />

                    <div style={{ marginTop: '16px' }}>
                        {data?.results && data.results.length > 0 ? (
                            <div className={style.container} style={{ marginTop: '12px' }}>
                                {data.results.map((item: any) => (
                                    <div key={item.id} className={style.item}>
                                        <Card
                                            isLoadingContract={isLoadingContract}
                                            item={item}
                                            handleDelete={() => onDelete(item)}
                                            handleEdit={() => onEdit(item)}
                                            handleView={() => onView(item)}
                                            handleContract={() => onContract(item)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Box
                                sx={{
                                    border: '1px solid #E6E6E8',
                                    borderRadius: 1,
                                    mt: 3,
                                    height: 200,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 3,
                                }}
                            >
                                <p>Sin información para mostrar</p>
                            </Box>
                        )}
                    </div>

                    {data && (
                        <PaginationAustin
                            pageSize={Number(pageSize)}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={data?.total_paginas}
                            dataCount={data.count}
                        />
                    )}
                </>
            )}

            <BasicModal open={open}>
                <FormRental
                    data={dataRental || null}
                    refetch={refetch}
                    btn={btn}
                    title={title}
                    onCancel={() => {
                        setOpen(false)
                        setDataRental(null)
                    }}
                />
            </BasicModal>

            <BasicModal open={del}>
                {dataRental && (
                    <DeleteRental
                        refetch={refetch}
                        data={dataRental}
                        onCancel={() => {
                            setDel(false)
                            setDataRental(null)
                        }}
                    />
                )}
            </BasicModal>

            <BasicModal open={detail}>
                {dataRental && (
                    <DetailRental
                        dataRental={dataRental}
                        onCancel={() => {
                            setDetail(false)
                            setDataRental(null)
                        }}
                    />
                )}
            </BasicModal>
        </div>
    )
}
