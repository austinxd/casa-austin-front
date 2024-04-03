import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

interface Props {
    columns: any
    rows: any
    isLoading: boolean
}

export default function TableAustin({ columns, rows, isLoading }: Props) {
    return (
        <Box
            sx={{
                maxWidth: 1200,
                display: 'flex',
                width: '100%',
                minHeight: '100px',
                mx: 'auto',
                background: 'white',
                borderRadius: '0px',
                '@media (max-width: 1000px)': {
                    display: 'none',
                },
            }}
        >
            <DataGrid
                loading={isLoading}
                rows={rows}
                autoHeight
                columns={columns}
                disableColumnMenu
                columnHeaderHeight={50}
                rowHeight={42}
                localeText={{ noRowsLabel: 'No se encontraron resultados' }}
                hideFooterPagination
                hideFooterSelectedRowCount
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    '.MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    '&.MuiDataGrid-root': {
                        border: 'none',
                        px: 0,
                        borderRadius: 0,
                    },
                    '& .MuiDataGrid-cell': {
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 400,
                        opacity: 0.7,
                        borderBottom: '1px solid #E6E5E7',
                        color: '#2F2B3D',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        minHeight: '100px',
                    },
                    '& .MuiDataGrid-virtualScrollerContent': {
                        minHeight: '100px',
                    },
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-columnHeader:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-columnHeaderTitleContainer': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11.5px',
                        fontWeight: 300,
                        color: 'black',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 500,
                        color: 'black',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        minHeight: '0px',
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 15,
                        },
                    },
                }}
                pageSizeOptions={[15]}
            />
        </Box>
    )
}
