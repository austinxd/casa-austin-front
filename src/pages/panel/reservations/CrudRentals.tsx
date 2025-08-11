import { Box, Typography } from '@mui/material'
import style from './rental.module.css'
import Card from './components/card/Card'
import FormRental from './components/form/FormRental'
import { useState } from 'react'
import DetailRental from './components/form/DetailRental'
import DeleteRental from './components/form/DeleteRental'
import { useGetAllRentalsQuery } from '@/services/rentals/rentalService'
import SearchRental from './components/form/SearchRental'
import { BasicModal, PaginationAustin } from '@/components/common'
import { IRentalClient } from '@/interfaces/rental/registerRental'
import { downloadContractById } from '@/services/rentals/rental'
import ReservationSkeleton from './components/skeleton/ReservationSkeleton'

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

    const [isLoadingContract, setIsLoadingContract] = useState(false)

    const { data, isLoading, refetch } = useGetAllRentalsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        from: filterInProgress || filterToday || filterStatus || filterInClient,
        type: filterAirbnb,
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

    return (
        <div>
            {isLoading ? (
                <ReservationSkeleton />
            ) : (
                <>
                    <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                        Alquileres
                    </Typography>
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
