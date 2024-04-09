import { Typography } from '@mui/material'
import style from './rental.module.css'
import Card from './card/Card'
import BasicModal from '../../common/modal/BasicModal'
import FormRental from './form/FormRental'
import { useState } from 'react'
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

    const { data, isLoading, refetch } = useGetAllRentalsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
        from: 'air',
    })

    const fuc = () => {}

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

    return (
        <div>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Alquileres
            </Typography>
            <SearchRental
                onClick={fuc}
                setSearch={setSearch}
                setCurrentPage={setCurrentPage}
                onSave={onSave}
            />

            {isLoading ? (
                <SkeletonCard />
            ) : (
                <div className={style.container} style={{ marginTop: '12px' }}>
                    {data?.results?.map((item) => (
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
