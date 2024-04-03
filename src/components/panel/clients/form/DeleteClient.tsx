import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IRegisterClient } from '../../../../interfaces/clients/registerClients'
import { useDeleteClient } from '../../../../libs/services/clients/useDeleteClient'
import ButtonPrimary from '../../../common/button/ButtonPrimary'
import SuccessCard from '../card/SuccessCard'
import SuccessDeletIcon from '../../../common/icons/SuccessDeletIcon'

interface Props {
    onCancel: () => void
    data: IRegisterClient
    refetch: any
}

export default function DeleteClient({ onCancel, data, refetch }: Props) {
    const { isLoading, onDeleteClient, successDelete } = useDeleteClient(data, refetch)

    return (
        <Box px={{ md: 4, sm: 4, xs: 0 }} position={'relative'}>
            <IconButton
                onClick={onCancel}
                sx={{
                    p: 0.8,
                    borderRadius: '8px',
                    position: 'absolute',
                    right: '-3px',
                    top: '-3px',
                    background: '#FF4C51',
                    color: 'white',
                    ':hover': {
                        background: '#FF4C51',
                    },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            {successDelete ? (
                <SuccessCard
                    title={'Cliente eliminado'}
                    icon={<SuccessDeletIcon />}
                    onCancel={onCancel}
                    text={'Se elimino los datos del cliente de forma exitosa'}
                />
            ) : (
                <div>
                    <Typography mb={3} fontSize={18}>
                        Eliminar cliente
                    </Typography>
                    <Typography variant="body2" fontSize={16} fontWeight={400} textAlign={'start'}>
                        Esta seguro que desea eliminar la informacion del cliente{' '}
                        <span style={{ fontWeight: 600 }}> {data?.first_name}</span>
                    </Typography>
                    <Box display={'flex'} mt={2} gap={2} justifyContent={'center'}>
                        <ButtonPrimary
                            type="submit"
                            onClick={onDeleteClient}
                            isLoading={isLoading}
                            style={{
                                background: '#FF4C51',
                                color: 'white',
                                height: '48px',
                                fontWeight: 500,
                                width: '170px',
                                marginTop: '4px',
                                marginBottom: '4px',
                            }}
                        >
                            Eliminar cliente
                        </ButtonPrimary>
                    </Box>
                </div>
            )}
        </Box>
    )
}
