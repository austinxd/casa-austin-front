import { Box } from '@mui/material'

import HouseRoundedIcon from '@mui/icons-material/HouseRounded'

const ColumTableProfits = [
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

export default ColumTableProfits
