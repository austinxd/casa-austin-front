import { useState } from 'react'
import { deleteReservationsForm } from './rental'
import { IRentalClient } from '@/interfaces/rental/registerRental'

export const useDeleteRental = (data: IRentalClient, refetch: any) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [openErrorModal, setOpenErrorModal] = useState(false)
    const [successDelete, setSuccessDelete] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const onDeleteRental = async () => {
        try {
            setIsLoading(true)

            if (data?.id) {
                const response = await deleteReservationsForm(data.id)

                if (response.status === 204) {
                    setSuccessDelete(true)
                    refetch()
                }
                return
            }
        } catch (error: any) {
            setErrorMessage(error.response.data)
            setOpenErrorModal(true)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        onDeleteRental,
        successDelete,
        isLoading,
        errorMessage,
        openErrorModal,
        setOpenErrorModal,
    }
}
