import { useState } from 'react'
import { adjustClientPoints } from './client'

export const useAdjustPoints = (clientId: string, refetch: any) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [successAdjust, setSuccessAdjust] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onAdjustPoints = async (points: number, reason: string) => {
        try {
            setIsLoading(true)
            setErrorMessage('')

            const response = await adjustClientPoints(clientId, points, reason)

            if (response.status === 200 || response.status === 201) {
                setSuccessAdjust(true)
                refetch()
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Hubo un error al ajustar los puntos'
            setErrorMessage(message)
            setTimeout(() => {
                setErrorMessage('')
            }, 4000)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        onAdjustPoints,
        successAdjust,
        isLoading,
        errorMessage,
    }
}
