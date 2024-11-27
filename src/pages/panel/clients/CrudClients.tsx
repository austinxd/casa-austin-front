import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CommentIcon from '@mui/icons-material/Comment'
import CloseIcon from '@mui/icons-material/Close'
import FormClients from './components/form/FormClients'
import DeleteClient from './components/form/DeleteClient'
import CardResponsive from './components/card/CardResponsive'
import SearchClient from './components/form/SearchClient'
import { useGetAllClientsQuery } from '@/services/clients/clientsService'
import { IRegisterClient } from '@/interfaces/clients/registerClients'
import { BasicModal, PaginationAustin, TableAustin } from '@/components/common'

export default function CrudClients() {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const { palette } = useTheme()
    const [search, setSearch] = useState('')
    const { data, isLoading, refetch } = useGetAllClientsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
    })

    const [openForm, setOpenForm] = useState(false)
    const [openComment, setOpenComment] = useState(false)
    const [dataClient, setDataClient] = useState<IRegisterClient | null>(null)
    const [del, setDel] = useState(false)
    const [clienById, setClienById] = useState<IRegisterClient | null>(null)
    const [title, setTitle] = useState('')
    const [btn, setBtn] = useState('')

    const handleMenuOpen = (id: string) => {
        setOpenMenus((prevOpenMenus) => ({
            ...prevOpenMenus,
            [id]: true,
        }))
    }

    const handleMenuClose = (id: string) => {
        setOpenMenus((prevOpenMenus) => ({
            ...prevOpenMenus,
            [id]: false,
        }))
    }

    const handleComment = (data: IRegisterClient) => {
        setDataClient(data)
        setOpenComment(true)
    }
    const columns = [
        {
            field: 'first_name',
            headerName: 'NOMBRES',
            flex: 1,
            sortable: false,
            renderCell: (params: { row: IRegisterClient }) => (
                <Box display={'flex'} alignItems={'center'}>
                    <Typography letterSpacing={0}>{params.row.first_name}</Typography>
                    {params.row.comentarios_clientes && (
                        <IconButton sx={{ p: 0.4 }} onClick={() => handleComment(params.row)}>
                            <CommentIcon
                                sx={{ color: palette.primary.main, opacity: 0.6, fontSize: '16px' }}
                            />
                        </IconButton>
                    )}
                </Box>
            ),
        },
        {
            field: 'last_name',
            headerName: 'APELLIDOS',
            flex: 1,
            valueGetter: (params: any) => {
                if (params.value === '') {
                    return '-'
                } else {
                    return params.value
                }
            },
            sortable: false,
        },
        {
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
        },
        {
            field: 'document_type',
            headerName: 'TIPO DE DOCUMENTO',
            flex: 1,
            sortable: false,
            valueGetter: (params: any) => {
                switch (params.value) {
                    case 'dni':
                        return 'DNI'
                    case 'cex':
                        return 'Carnet de Extranjeria'
                    case 'pas':
                        return 'Pasaporte'
                    default:
                        return params.value
                }
            },
        },
        { field: 'number_doc', headerName: 'DOCUMENTO', flex: 1, sortable: false },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            flex: 1,
            sortable: false,
            renderCell: (params: { row: IRegisterClient }) => (
                <>
                    <IconButton
                        id={`menu-button-${params.row.id}`} // ID único para el botón de cada fila
                        size="small"
                        aria-controls={`menu-${params.row.id}`} // ID único para el menú de cada fila
                        aria-haspopup="true"
                        onClick={() => handleMenuOpen(params.row.id)} // Abrir el menú correspondiente
                    >
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                        anchorEl={document.getElementById(`menu-button-${params.row.id}`)}
                        id={`menu-${params.row.id}`}
                        sx={{ position: 'absolute', zIndex: 2 }}
                        open={Boolean(openMenus[params.row.id])}
                        onClose={() => handleMenuClose(params.row.id)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        slotProps={{
                            paper: {
                                style: {
                                    background: 'white',
                                    boxShadow: '3px 7px 20px 0px rgba(0,0,0,0.04)',
                                    padding: '4px',
                                    border: '1px solid #EAEAEA',
                                },
                            },
                        }}
                    >
                        <MenuItem sx={{ color: '#000F08' }} onClick={() => onEdit(params.row)}>
                            Editar
                        </MenuItem>
                        <MenuItem sx={{ color: '#FF4C51' }} onClick={() => onDelete(params.row)}>
                            Eliminar
                        </MenuItem>
                    </Menu>
                </>
            ),
        },
    ]

    const onCreate = () => {
        setOpenForm(true)
        setTitle('Añadir Cliente')
        setBtn('Agregar')
    }

    const onEdit = (data: IRegisterClient) => {
        setClienById(data)
        setOpenForm(true)
        setTitle('Editar cliente')
        setBtn('Guardar cambios')
    }
    const onDelete = (data: IRegisterClient) => {
        setClienById(data)
        setDel(true)
    }

    return (
        <div>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Clientes
            </Typography>
            <SearchClient
                pageSize={pageSize}
                setPageSize={setPageSize}
                text={'Añadir Clientes'}
                onSave={onCreate}
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
                    isLoading={isLoading}
                    rows={data?.results ? data?.results : []}
                    columns={columns}
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
                    {!isLoading &&
                        data?.results?.map((item: IRegisterClient) => (
                            <CardResponsive
                                handleComment={() => handleComment(item)}
                                key={item.id}
                                id={item.id}
                                first_name={item.first_name}
                                tel_number={item.tel_number}
                                number_doc={item.number_doc}
                                document_type={item.document_type}
                                email={item.email}
                                comment={item.comentarios_clientes}
                                handleEdit={() => onEdit(item)}
                                handleDelete={() => onDelete(item)}
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

            <BasicModal open={del}>
                {clienById && (
                    <DeleteClient
                        data={clienById}
                        refetch={refetch}
                        onCancel={() => {
                            setDel(false)
                            setClienById(null)
                        }}
                    />
                )}
            </BasicModal>

            <BasicModal open={openForm}>
                <FormClients
                    refetch={refetch}
                    data={clienById || null}
                    btn={btn}
                    title={title}
                    onCancel={() => {
                        setOpenForm(false)
                        setClienById(null)
                    }}
                />
            </BasicModal>

            <BasicModal open={openComment}>
                {dataClient && (
                    <Box position={'relative'}>
                        <IconButton
                            onClick={() => setOpenComment(false)}
                            sx={{
                                p: 0.8,
                                borderRadius: '8px',
                                position: 'absolute',
                                right: '-3px',
                                top: '-3px',
                                background: '#DD6158',
                                color: 'white',
                                ':hover': {
                                    background: '#DD6158',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                        <Typography mb={2}>Comentario de {dataClient.first_name}</Typography>
                        <Typography variant="body1">{dataClient.comentarios_clientes} </Typography>
                    </Box>
                )}
            </BasicModal>
        </div>
    )
}
