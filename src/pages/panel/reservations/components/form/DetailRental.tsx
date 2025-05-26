import { Box, Divider, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useGetRentalsByIdQuery } from '@/services/rentals/rentalService'
import { IRentalClient } from '@/interfaces/rental/registerRental'

interface Props {
    onCancel: () => void
    dataRental: IRentalClient
}

export default function DetailRental({ onCancel, dataRental }: Props) {
    const [imageExpanded, setImageExpanded] = useState(false)
    const [imageSelect, setImageSelect] = useState<string>()

    const { data, isLoading } = useGetRentalsByIdQuery(dataRental?.id || '', {
        skip: !dataRental?.id,
    })

    const handleSelectImage = (id: string) => {
        const selectedImage = data?.recipts.find((image: any) => image.id === id)
        if (selectedImage) {
            setImageSelect(selectedImage.file)
            setImageExpanded(true)
        }
    }
    const showEmail = !!dataRental.client.email

    const LABELS = [
        'Casa',
        'Nombre',
        'Fecha de ingreso',
        'Fecha de salida',
        'Cantidad de huéspedes',
        'Precio en dólares',
        'Precio en soles',
        'Adelanto',
        'Moneda',
        ...(showEmail ? ['Correo'] : []),
    ]

    const formatCurrency = (currency: string) => {
        const currencies: Record<string, string> = {
            sol: 'Soles',
            dol: 'Dólares',
        }
        return currencies[currency] || '-'
    }

    const truncateText = (text: string, maxLength = 30) =>
        text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text

    const rentalValues = [
        dataRental.property.name || '-',
        truncateText(dataRental.client.first_name || '-'),
        dataRental.check_in_date || '-',
        dataRental.check_out_date || '-',
        dataRental.guests?.toString() || '-',
        `$ ${dataRental.price_usd || '-'}`,
        `S/ ${dataRental.price_sol || '-'}`,
        dataRental.advance_payment?.toString() || '-',
        formatCurrency(dataRental.advance_payment_currency),
        ...(showEmail ? [dataRental.client.email!] : []),
    ]

    const renderImageGrid = () => {
        if (isLoading) {
            return (
                <Stack direction="row" gap={2}>
                    {Array(2)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rounded"
                                width={80}
                                height={80}
                                sx={{ bgcolor: '#DADADA' }}
                            />
                        ))}
                </Stack>
            )
        }

        if (data?.recipts?.length) {
            return data.recipts.map((image: any) => (
                <img
                    key={image.id}
                    src={image.file}
                    alt={`Imagen ${image.id}`}
                    style={{
                        border: '1px solid #C9CED6',
                        borderRadius: '5px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        objectFit: 'contain',
                    }}
                    height={80}
                    width={80}
                    onClick={() => handleSelectImage(image.id)}
                />
            ))
        }

        return <Typography variant="body1">Sin comprobantes de pago</Typography>
    }

    return (
        <Box px={{ md: 8, sm: 4, xs: 0 }} position="relative">
            <IconButton
                onClick={imageExpanded ? () => setImageExpanded(false) : onCancel}
                sx={{
                    p: 0.8,
                    zIndex: 100,
                    borderRadius: '8px',
                    position: 'absolute',
                    right: '-3px',
                    top: '-3px',
                    background: '#DD6158',
                    color: 'white',
                    ':hover': { background: '#DD6158' },
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            {!imageExpanded ? (
                <>
                    <Typography mb={2}>Añadir Alquiler</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Box
                            width="50%"
                            textAlign="right"
                            display="flex"
                            flexDirection="column"
                            gap={1}
                        >
                            {LABELS.map((label) => (
                                <Typography key={label} variant="body2">
                                    {label}:
                                </Typography>
                            ))}
                        </Box>
                        <Box
                            width="50%"
                            textAlign="start"
                            ml={1}
                            display="flex"
                            flexDirection="column"
                            gap={1}
                        >
                            {rentalValues.map((value, index) => (
                                <Typography key={index} variant="body2" fontWeight={400}>
                                    {value}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                    {dataRental.comentarios_reservas &&
                        dataRental.comentarios_reservas !== 'null' && (
                            <Box my={2}>
                                <Typography variant="body2">Comentario:</Typography>
                                <Typography variant="body2" fontWeight={400}>
                                    {dataRental.comentarios_reservas}
                                </Typography>
                            </Box>
                        )}
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="start" alignItems="center" gap={2} py={2}>
                        {renderImageGrid()}
                    </Box>
                </>
            ) : (
                <Box height={450} position="relative">
                    <img
                        src={imageSelect}
                        alt="Imagen Ampliada"
                        style={{ maxWidth: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </Box>
            )}
        </Box>
    )
}
