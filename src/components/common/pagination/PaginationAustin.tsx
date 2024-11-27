import { Box, Pagination, PaginationItem, Typography } from '@mui/material'

interface Props {
    totalPages: number
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    dataCount: number
    pageSize: number
}
export default function PaginationAustin({
    totalPages,
    currentPage,
    setCurrentPage,
    dataCount,
    pageSize,
}: Props) {
    const handlePageChange = (_event: any, newPage: any) => {
        setCurrentPage(newPage)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1)
        }
    }
    const handleNextPage = () => {
        if (totalPages) {
            if (currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1)
            }
        }
    }
    return (
        <div>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{
                    mt: 2,
                    background: 'transparent',
                    borderEndEndRadius: '8px',
                    borderEndStartRadius: '8px',
                    '@media (max-width: 1000px)': {
                        px: 0,
                        display: 'flex',
                        justifyContent: 'end',
                    },
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontSize={13}
                    sx={{
                        ml: 1,
                        '@media (max-width: 1000px)': {
                            display: 'none',
                        },
                    }}
                >
                    {currentPage === totalPages
                        ? `${(currentPage - 1) * pageSize + 1} a ${dataCount} de ${dataCount} clientes`
                        : `${(currentPage - 1) * pageSize + 1} a ${Math.min(currentPage * pageSize, dataCount)} de ${dataCount} clientes`}
                </Typography>
                <Pagination
                    page={currentPage}
                    count={totalPages}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            marginRight: '2px',
                            color: '#5B586C',
                            background: '#EFEEF0',
                            outline: 'none',
                            fontWeight: 400,
                            border: 'none',
                            '&.Mui-selected': {
                                color: 'white',
                                background: '#0E6191',
                            },
                        },
                    }}
                    renderItem={(item) => (
                        <PaginationItem
                            {...item}
                            selected={item.page === currentPage}
                            className={item.page === currentPage ? 'pagination-item-selected' : ''} // Aplicar la clase de estilos específica si el elemento está seleccionado
                            onClick={(e) => {
                                if (item.type === 'previous') {
                                    handlePreviousPage()
                                } else if (item.type === 'next') {
                                    handleNextPage()
                                } else {
                                    handlePageChange(e, item.page)
                                }
                            }}
                        />
                    )}
                />
            </Box>
        </div>
    )
}
