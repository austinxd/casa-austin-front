import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IRentalClient } from '@/interfaces/rental/registerRental'
import { useDeleteRental } from '@/services/rentals/useDeleteRental'
import { BasicModal, ButtonPrimary, ModalErrors, SuccessDeletIcon } from '@/components/common'
import SuccessCard from '@/pages/panel/clients/components/card/SuccessCard'

interface Props {
    onCancel: () => void
    data: IRentalClient
    refetch: any
}
export default function DeleteRental({ onCancel, data, refetch }: Props) {
    const {
        isLoading,
        onDeleteRental,
        successDelete,
        errorMessage,
        setOpenErrorModal,
        openErrorModal,
    } = useDeleteRental(data, refetch)
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
                <>
                    <Typography mb={3} fontSize={18}>
                        Eliminar informacion
                    </Typography>
                    <Typography variant="body2" fontSize={16} fontWeight={400} textAlign={'start'}>
                        Esta seguro que desea eliminar la informacion del cliente{' '}
                        <span style={{ fontWeight: 600 }}>
                            {data.client.first_name} {data.client.last_name}
                        </span>
                    </Typography>
                    <Box display={'flex'} mt={2} gap={2} justifyContent={'center'}>
                        <ButtonPrimary
                            type="submit"
                            onClick={onDeleteRental}
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
                            Eliminar alquiler
                        </ButtonPrimary>
                    </Box>
                </>
            )}

            <BasicModal open={openErrorModal}>
                <ModalErrors
                    title="Ups! ocurrio un problema"
                    data={errorMessage}
                    onCancel={() => setOpenErrorModal(false)}
                />
            </BasicModal>
        </Box>
    )
}
