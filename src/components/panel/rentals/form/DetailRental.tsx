import { Box, Divider, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { IRentalClient } from '../../../../interfaces/rental/registerRental'
import { useGetRentalsByIdQuery } from '../../../../libs/services/rentals/rentalService'

interface Props {
    onCancel: () => void
    dataRental: IRentalClient
}

export default function DetailRental({ onCancel, dataRental }: Props) {
    const [imageExpanded, setImageExpanded] = useState(false)
    const [imageSelect, setImageSelect] = useState<string>()

    const { data, isLoading } = useGetRentalsByIdQuery(dataRental?.id ? dataRental.id : '', {
        skip: !dataRental?.id,
    })
    const selectImg = (id: string) => {
        const findImg = data?.recipts.find((image) => image.id === id)

        if (findImg) {
            setImageSelect(findImg.file)
            setImageExpanded(true)
        }
    }

    const onTypeMoney = (money: string) => {
        switch (money) {
            case 'sol':
                return 'Soles'
            case 'dol':
                return 'Dolares'
            default:
                return '-'
        }
    }
    const toggleImageExpanded = () => {
        setImageExpanded((prevState) => !prevState)
        setImageSelect('')
    }
    const truncateName = (name: string) => {
        if (name.length > 30) {
            return name.slice(0, 27) + '...'
        } else {
            return name
        }
    }

    return (
        <div>
            {!imageExpanded && (
                <Box px={{ md: 8, sm: 4, xs: 0 }} position={'relative'}>
                    <IconButton
                        onClick={onCancel}
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
                    <Typography mb={2}>Añadir Alquiler</Typography>
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Box
                            width={'50%'}
                            display={'flex'}
                            textAlign={'end'}
                            flexDirection={'column'}
                            gap={1}
                            height={'100%'}
                            alignItems={'flex-end'}
                        >
                            <Typography variant="body2">Casa:</Typography>
                            <Typography variant="body2">Nombre :</Typography>
                            <Typography variant="body2">Fecha de ingreso:</Typography>
                            <Typography variant="body2">Fecha de salida:</Typography>
                            <Typography variant="body2">Cantidad de huéspedes:</Typography>
                            <Typography variant="body2">Precio en dólares:</Typography>
                            <Typography variant="body2">Precio en soles:</Typography>
                            <Typography variant="body2">Adelanto:</Typography>
                            <Typography variant="body2">Moneda:</Typography>
                        </Box>
                        <Box
                            height={'100%'}
                            width={'50%'}
                            display={'flex'}
                            textAlign={'start'}
                            ml={1}
                            flexDirection={'column'}
                            gap={1}
                        >
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.property.name ? dataRental.property.name : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {truncateName(
                                    dataRental.client.first_name
                                        ? dataRental.client.first_name
                                        : '-'
                                )}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.check_in_date ? dataRental.check_in_date : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.check_out_date ? dataRental.check_out_date : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.guests ? dataRental.guests : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.price_usd ? dataRental.price_usd : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.price_sol ? dataRental.price_sol : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.advance_payment ? dataRental.advance_payment : '-'}
                            </Typography>
                            <Typography variant="body2" fontWeight={400}>
                                {onTypeMoney(dataRental.advance_payment_currency)
                                    ? onTypeMoney(dataRental.advance_payment_currency)
                                    : '-'}
                            </Typography>
                        </Box>
                    </Box>
                    {dataRental.comentarios_reservas && (
                        <Box my={2}>
                            <Typography variant="body2">Comentario:</Typography>{' '}
                            <Typography variant="body2" fontWeight={400}>
                                {dataRental.comentarios_reservas
                                    ? dataRental.comentarios_reservas
                                    : '-'}
                            </Typography>
                        </Box>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Box
                        display="flex"
                        justifyContent="start"
                        width="100%"
                        alignItems="center"
                        gap={2}
                        py={2}
                    >
                        {data?.recipts && data.recipts.length > 0 ? (
                            data.recipts.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.file}
                                    style={{
                                        border: '1px solid #C9CED6',
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        objectFit: 'contain',
                                    }}
                                    height={80}
                                    width={80}
                                    alt={`Imagen ${image.id}`}
                                    onClick={() => selectImg(image.id)}
                                />
                            ))
                        ) : isLoading ? (
                            <Stack>
                                <Box display={'flex'} gap={2}>
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ width: 80, bgcolor: '#DADADA' }}
                                        height={80}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        sx={{ width: 80, bgcolor: '#DADADA' }}
                                        height={80}
                                    />
                                </Box>
                            </Stack>
                        ) : (
                            <Typography variant="body1">Sin comprobantes de pago</Typography>
                        )}
                    </Box>
                </Box>
            )}
            {imageExpanded && (
                <div>
                    <Box height={450} position={'relative'}>
                        <IconButton
                            onClick={toggleImageExpanded}
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
                        <img
                            src={imageSelect}
                            style={{ maxWidth: '450px' }}
                            height={'100%'}
                            alt="Imagen Ampliada"
                        />
                    </Box>
                </div>
            )}
        </div>
    )
}
