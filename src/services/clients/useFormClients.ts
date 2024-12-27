import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'

import { useEffect, useState } from 'react'
import { clientForm, editClientForm } from './client'
import { IRegisterClient } from '@/interfaces/clients/registerClients'

export const useFormClients = (dataEdit: IRegisterClient | null, refetch: any) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
    } = useForm<IRegisterClient>()

    const [selectedOption, setSelectedOption] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [openErrorModal, setOpenErrorModal] = useState(false)

    const [successRegister, setSuccessRegister] = useState(false)
    const [successEdit, setSuccessEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')

    const handlePhoneNumberChange = (value: string) => {
        setValue('tel_number', value)
        setPhoneNumber(value)
    }
    const formData = new FormData()

    useEffect(() => {
        if (dataEdit?.id) {
            setValue('document_type', dataEdit.document_type)
            setValue('number_doc', dataEdit.number_doc)
            setValue('date', dayjs(dataEdit.date))
            setValue('first_name', dataEdit.first_name)
            setValue('last_name', dataEdit.last_name)
            setValue('email', dataEdit.email)
            setValue('tel_number', dataEdit.tel_number)
            setValue('comentarios_clientes', dataEdit.comentarios_clientes)
            setValue('sex', dataEdit.sex.toLocaleLowerCase())
            setSelectedOption(dataEdit.sex)
            setPhoneNumber(dataEdit.tel_number)
        }
    }, [successEdit])

    const onCreateClient = async (data: IRegisterClient) => {
        try {
            setIsLoading(true)
            formData.append(
                'date',
                data.document_type === 'ruc' ? '' : dayjs(data.date).format('YYYY-MM-DD')
            )
            formData.append('sex', data.document_type === 'ruc' ? 'e' : data.sex[0].toLowerCase())
            formData.append('document_type', data.document_type)
            formData.append('number_doc', data.number_doc)
            formData.append('first_name', data.first_name)
            formData.append('last_name', data.last_name)
            formData.append('email', data.email)
            formData.append('tel_number', data.tel_number)
            formData.append('comentarios_clientes', data.comentarios_clientes)

            if (dataEdit?.id) {
                const response = await editClientForm(formData, dataEdit?.id)

                if (response.status === 200) {
                    setSuccessEdit(true)
                    refetch()
                }
                return
            }

            const response = await clientForm(formData)

            if (response.status === 201) {
                setSuccessRegister(true)
                refetch()
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
        handleSubmit: handleSubmit(onCreateClient),
        errors,
        setSelectedOption,
        selectedOption,
        isLoading,
        successRegister,
        errorMessage,
        successEdit,
        setValue,
        handlePhoneNumberChange,
        phoneNumber,
        setPhoneNumber,
        openErrorModal,
        setOpenErrorModal,
    }
}
