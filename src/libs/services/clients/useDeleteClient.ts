import { IRegisterClient } from '../../../interfaces/clients/registerClients'
import { useState } from 'react'
import { deleteClienForm } from './client'

export const useDeleteClient = (data: IRegisterClient, refetch: any) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [successDelete, setSuccessDelete] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const onDeleteClient = async () => {
        try {
            setIsLoading(true)

            if (data?.id) {
                const response = await deleteClienForm(data.id)

                if (response.status === 204) {
                    setSuccessDelete(true)
                    refetch()
                }
                return
            }
        } catch (error: any) {
            setErrorMessage('Hubo un error')
            setTimeout(() => {
                setErrorMessage('')
            }, 4000)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        onDeleteClient,
        successDelete,
        isLoading,
        errorMessage,
    }
}
