import { Box, Typography } from '@mui/material'
import style from './rental.module.css'
import Card from './card/Card'
import BasicModal from '../../common/modal/BasicModal'
import FormRental from './form/FormRental'
import { useEffect, useState } from 'react'
import DetailRental from './form/DetailRental'
import DeleteRental from './form/DeleteRental'
import { useGetAllRentalsQuery } from '../../../libs/services/rentals/rentalService'
import { IRentalClient } from '../../../interfaces/rental/registerRental'
import SkeletonCard from './card/SkeletonCard'
import PaginationAustin from '../../common/pagination/PaginationAustin'
import SearchRental from './form/SearchRental'

export default function CrudRentals() {
    const [open, setOpen] = useState(false)
    const [del, setDel] = useState(false)
    const [detail, setDetail] = useState(false)
    const [dataRental, setDataRental] = useState<IRentalClient | null>(null)
    const [title, setTitle] = useState('')
    const [btn, setBtn] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState<number | string>(8)
    const [search, setSearch] = useState('')
    const [filterAirbnb, setFilterAirbnb] = useState('')
    const [filterToday, setFilterToday] = useState('')
    const { data, isLoading, refetch } = useGetAllRentalsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        from: filterToday,
        type: filterAirbnb,
    })

    const onSave = () => {
        setOpen(true)
        setTitle('Añadir Alquiler')
        setBtn('Guardar nuevo alquiler')
    }

    useEffect(() => {
        console.log(data, 'ffffffff')
    }, [data])
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

    return (
        <div>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Alquileres
            </Typography>
            <SearchRental
                setSearch={setSearch}
                setCurrentPage={setCurrentPage}
                onSave={onSave}
                filterAirbnb={filterAirbnb}
                setFilterAirbnb={setFilterAirbnb}
                setFilterToday={setFilterToday}
                filterToday={filterToday}
            />

            {isLoading ? (
                <SkeletonCard />
            ) : (
                <div>
                    {data?.results && data.results.length > 0 ? (
                        <div className={style.container} style={{ marginTop: '12px' }}>
                            {data.results.map((item) => (
                                <div key={item.id} className={style.item}>
                                    <Card
                                        item={item}
                                        handleDelete={() => onDelete(item)}
                                        handleEdit={() => onEdit(item)}
                                        handleView={() => onView(item)}
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
                            <p>Sin informacion para mostrar</p>
                        </Box>
                    )}
                </div>
            )}

            <div className={style.container} style={{ marginTop: '12px' }}></div>
            {data && (
                <PaginationAustin
                    pageSize={Number(pageSize)}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={data?.total_paginas}
                    dataCount={data.count}
                />
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
