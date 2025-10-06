import { Box, IconButton, TextField, Typography, Alert } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import SuccessCard from '../card/SuccessCard'
import { IRegisterClient } from '@/interfaces/clients/registerClients'
import { useAdjustPoints } from '@/services/clients/useAdjustPoints'
import { ButtonPrimary, SuccessIcon } from '@/components/common'

interface Props {
    onCancel: () => void
    data: IRegisterClient
    refetch: any
}

export default function AdjustPoints({ onCancel, data, refetch }: Props) {
    const [points, setPoints] = useState<string>('')
    const [reason, setReason] = useState<string>('')
    const { isLoading, onAdjustPoints, successAdjust, errorMessage } = useAdjustPoints(
        data.id,
        refetch
    )

    const handleSubmit = () => {
        const pointsValue = parseFloat(points)
        if (!points || isNaN(pointsValue)) {
            return
        }
        if (!reason.trim()) {
            return
        }
        onAdjustPoints(pointsValue, reason)
    }

    const isValid = points && !isNaN(parseFloat(points)) && reason.trim()

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

            {successAdjust ? (
                <SuccessCard
                    title={'Puntos ajustados'}
                    icon={<SuccessIcon />}
                    onCancel={onCancel}
                    text={'Se ajustaron los puntos del cliente de forma exitosa'}
                />
            ) : (
                <div>
                    <Typography mb={2} fontSize={18} fontWeight={600}>
                        Ajustar puntos
                    </Typography>
                    <Typography variant="body2" fontSize={14} mb={3}>
                        Cliente: <strong>{data?.first_name} {data?.last_name}</strong>
                    </Typography>
                    <Typography variant="body2" fontSize={14} mb={1}>
                        Puntos actuales: <strong>{parseFloat(data?.points_balance || '0').toFixed(2)}</strong>
                    </Typography>

                    <TextField
                        fullWidth
                        label="Puntos"
                        placeholder="Ingrese cantidad (positivo para agregar, negativo para quitar)"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        type="number"
                        sx={{ mb: 2 }}
                        helperText="Ejemplo: 100 para agregar, -50 para quitar"
                    />

                    <TextField
                        fullWidth
                        label="Motivo"
                        placeholder="Ingrese el motivo del ajuste"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />

                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Box display={'flex'} gap={2} justifyContent={'center'}>
                        <ButtonPrimary
                            type="submit"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            disabled={!isValid}
                            style={{
                                background: '#2F2B3D',
                                color: 'white',
                                height: '48px',
                                fontWeight: 500,
                                width: '170px',
                                marginTop: '4px',
                                marginBottom: '4px',
                            }}
                        >
                            Ajustar puntos
                        </ButtonPrimary>
                    </Box>
                </div>
            )}
        </Box>
    )
}
