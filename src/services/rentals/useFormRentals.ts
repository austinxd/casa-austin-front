import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
    reservationsForm,
    editReservationsForm,
    deleteRecipesForm,
    checkReservationDate,
} from './rental'
import { useGetCalenderListQuery } from './rentalService'
import { IRecipts, IRegisterRental, IRentalClient } from '@/interfaces/rental/registerRental'

export const useFormRentals = (dataEdit: IRentalClient | null, refetch: any, refetchEdit: any) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
    } = useForm<IRegisterRental>()

    const [imageReceived, setImageReceived] = useState<IRecipts[] | []>([])
    const [imageSend, setImageSend] = useState<File[] | []>([])
    const [reservCreate, setReservCreate] = useState<any>(null)
    const [successRegister, setSuccessRegister] = useState(false)
    const [successEdit, setSuccessEdit] = useState(false)
    const currentDates = new Date()
    const currentYear = currentDates.getFullYear()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [openErrorModal, setOpenErrorModal] = useState(false)
    const [dataRegisterAlert, setDataRegisterAlert] = useState<IRegisterRental>()
    const [idsDeleteImage, setIdsDeleteImage] = useState<{ id: string }[]>([])

    const [houseSelect, setHouseSeletc] = useState('')
    const [checkInSelect, setCheckInSelect] = useState('')
    const [checkOutSelect, setCheckOutSelect] = useState('')

    const [checkFullPayment, setCheckFullPayment] = useState(false)
    const [checkPool, setCheckPool] = useState(false)
    const [lateCheckOut, setLateCheckOut] = useState(false)

    const [phoneNumber, setPhoneNumber] = useState('')
    const [emailClient, setEmailClient] = useState('')

    const { refetch: refectchForCalender } = useGetCalenderListQuery({
        year: currentYear.toString(),
    })

    const handlePhoneNumberChange = (value: string) => {
        setValue('tel_contact_number', value)
        setPhoneNumber(value)
    }

    useEffect(() => {
        if (dataEdit?.id) {
            if (dataEdit?.client.email) {
                setEmailClient(dataEdit?.client.email)
            }
            return
            /*             const formDataCheck = new FormData()
            if (houseSelect && checkInSelect && checkOutSelect) {
                formDataCheck.append('property', houseSelect)
                formDataCheck.append('check_in_date', checkInSelect)
                formDataCheck.append('check_out_date', checkOutSelect)
                formDataCheck.append('reservation_id', dataEdit.id)
                const fetchData = async () => {
                    try {
                        const response = await checkEditReservationDate(formDataCheck)
                        if (response.status === 200) {
                        }
                    } catch (error: any) {
                        setErrorMessage(error.response.data)
                        setOpenErrorModal(true)
                    }
                }
                fetchData()
            } */
        } else {
            const formDataCheck = new FormData()
            if (houseSelect && checkInSelect && checkOutSelect) {
                formDataCheck.append('property', houseSelect)
                formDataCheck.append('check_in_date', checkInSelect)
                formDataCheck.append('check_out_date', checkOutSelect)
                const fetchData = async () => {
                    try {
                        const response = await checkReservationDate(formDataCheck)
                        if (response.status === 200) {
                        }
                    } catch (error: any) {
                        setErrorMessage(error.response.data)
                        setOpenErrorModal(true)
                    }
                }

                fetchData()
            }
        }
    }, [houseSelect, checkInSelect, checkOutSelect])

    const formData = new FormData()

    const onRegisterUser = async (data: any) => {
        try {
            setIsLoading(true)
            formData.append('property', data.property)
            formData.append('client', data.client)
            formData.append('check_in_date', dayjs(data.check_in_date).format('YYYY-MM-DD'))
            formData.append('check_out_date', dayjs(data.check_out_date).format('YYYY-MM-DD'))
            formData.append('guests', data.guests)
            formData.append('price_usd', data.price_usd)
            formData.append('price_sol', data.price_sol)
            formData.append('advance_payment', data.advance_payment ? data.advance_payment : '0')
            formData.append('advance_payment_currency', data.advance_payment_currency)
            formData.append('full_payment', checkFullPayment.toString())
            formData.append('temperature_pool', checkPool.toString())
            formData.append('late_checkout', lateCheckOut.toString())
            formData.append('tel_contact_number', phoneNumber)
            formData.append('comentarios_reservas', data.comentarios_reservas)
            formData.append('points_to_redeem', data.points_to_redeem)

            formData.append(
                'origin',
                dataEdit?.origin === 'man' ? 'man' : dataEdit?.origin === 'air' ? 'air' : 'aus'
            )
            if (imageSend.length > 0) {
                imageSend.forEach((image: File) => {
                    formData.append('file', image)
                })
            }

            if (dataEdit?.id) {
                formData.append('seller', dataEdit.seller.id)

                if (idsDeleteImage.length > 0) {
                    idsDeleteImage.forEach(async (idDeleteImage) => {
                        await deleteRecipesForm(idDeleteImage.id)
                    })
                }

                const response = await editReservationsForm(formData, dataEdit?.id)

                if (response.status === 200) {
                    setSuccessEdit(true)
                    refetchEdit()
                    refetch()
                    refectchForCalender()
                }
                return
            }

            const response = await reservationsForm(formData)
            setReservCreate(response.data)
            if (response.status === 201) {
                setDataRegisterAlert(data)
                setSuccessRegister(true)
                refetch()
                refectchForCalender()
            }
        } catch (error: any) {
            setErrorMessage(error.response.data)
            setOpenErrorModal(true)
        } finally {
            setIsLoading(false)
        }
    }
    return {
        register,
        control,
        handleSubmit: handleSubmit(onRegisterUser),
        errors,
        setImageSend,
        imageSend,
        isLoading,
        successRegister,
        successEdit,
        errorMessage,
        setValue,
        setIdsDeleteImage,
        imageReceived,
        setImageReceived,
        openErrorModal,
        setOpenErrorModal,
        setHouseSeletc,
        setCheckInSelect,
        setCheckOutSelect,
        phoneNumber,
        handlePhoneNumberChange,
        setPhoneNumber,
        emailClient,
        setEmailClient,
        checkInSelect,
        setCheckFullPayment,
        setCheckPool,
        checkFullPayment,
        checkPool,
        dataRegisterAlert,
        lateCheckOut,
        setLateCheckOut,
        reservCreate,
    }
}
