import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import {
    SelectInputPrimary,
    SecondaryInput,
    DeleteIcon,
    ButtonPrimary,
    SuccessEditIcon,
    SuccessIcon,
    BasicModal,
    ModalErrors,
    SecondaryInputMulti,
} from '@/components/common'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

import 'dayjs/locale/es'
import 'dayjs/locale/en'

import dayjs from 'dayjs'
import SkeletonFormRental from './SkeletonFormRental'
import PhoneInput from 'react-phone-input-2'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import { IRentalClient } from '@/interfaces/rental/registerRental'
import { useGetAllPropertiesQuery, useGetRentalsByIdQuery } from '@/services/rentals/rentalService'
import { useGetAllClientsQuery } from '@/services/clients/clientsService'
import { useFormRentals } from '@/services/rentals/useFormRentals'
import { filterTextHouse, filterTextHouse2, turnCurrency } from '@/core/utils'
import SuccessCard from '@/pages/panel/clients/components/card/SuccessCard'

interface Props {
    onCancel: () => void
    title: string
    btn: string
    data: IRentalClient | null
    refetch: any
}

export default function FormRental({ onCancel, title, btn, data, refetch }: Props) {
    const { data: optionProperty } = useGetAllPropertiesQuery('')

    const [currentPage] = useState(1)
    const [pageSize] = useState<number>(10)
    const [search, setSearch] = useState('')
    const [getNumber, setGetNumber] = useState<string | undefined>('')
    const [getEmail, setGetEmail] = useState<string | undefined>('')
    const [getPoints, setGetPoints] = useState<string | undefined>('')
    const [pointsReserv, setPointsReserv] = useState('')

    const [nameClientAlert, setNameClientAlert] = useState<string | null>('')
    const [isCopyText, setIsCopyText] = useState(false)
    const [isCopyUrl, setIsCopyUrl] = useState(false)
    const [nameHouseAlert, setNameHouseAlert] = useState('')

    const { data: optionClientsData } = useGetAllClientsQuery({
        page: currentPage,
        page_size: pageSize,
        search: search,
    })

    const {
        data: dataEdit,
        isLoading: isEditLoading,
        refetch: refetchEdit,
    } = useGetRentalsByIdQuery(data?.id ? data.id : '', {
        skip: !data?.id,
    })

    const {
        register,
        handleSubmit,
        control,
        imageSend,
        setImageSend,
        errors,
        isLoading,
        successEdit,
        successRegister,
        dataRegisterAlert,
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
        checkPool,
        checkFullPayment,
        setCheckFullPayment,
        setCheckPool,
        lateCheckOut,
        setLateCheckOut,
        reservCreate,
    } = useFormRentals(data, refetch, refetchEdit)

    useEffect(() => {
        if (dataEdit?.id) {
            setValue('guests', dataEdit.guests)
            setValue('price_sol', dataEdit.price_sol)
            setValue('price_usd', dataEdit.price_usd)
            setValue('comentarios_reservas', dataEdit.comentarios_reservas)
            setValue('advance_payment', dataEdit.advance_payment)
            setValue('check_in_date', dayjs(dataEdit.check_in_date))
            setValue('check_out_date', dayjs(dataEdit.check_out_date))
            setValue('advance_payment_currency', dataEdit.advance_payment_currency)
            setValue('property', dataEdit.property.id)
            setValue('client', dataEdit.client.id)
            setValue('tel_contact_number', dataEdit.tel_contact_number)
            setValue('tel_contact_number', dataEdit.tel_contact_number)
            setValue('points_to_redeem', dataEdit.points_redeemed)
            setValue('status', dataEdit.status)

            setImageReceived(dataEdit.recipts)
            setHouseSeletc(dataEdit.property.id)
            setCheckInSelect(dataEdit.check_in_date)
            setCheckOutSelect(dataEdit.check_out_date)
            setPhoneNumber(dataEdit.tel_contact_number)
            setCheckFullPayment(dataEdit.full_payment)
            setCheckPool(dataEdit.temperature_pool)
            setLateCheckOut(dataEdit.late_checkout)
            setPointsReserv(dataEdit.points_redeemed)
        }
    }, [isEditLoading, dataEdit])

    const fileInputRef = useRef<any>(null)

    const optionsHouse =
        optionProperty?.results.map((property: any) => ({
            value: property.id,
            label: property.name,
            airbnb_url: property.location,
        })) || []

    const optionsClients =
        optionClientsData?.results.map((client: any) => ({
            value: client.id,
            label: client.first_name + ' ' + client.last_name,
            phone: client.tel_number,
            lastName: client.last_name,
            firstName: client.first_name,
            dni: client.number_doc,
            email: client.email,
            points_balance: client.points_balance,
        })) || []

    const optionsStatus = [
        {
            value: 'incomplete',
            label: 'Incompleto',
        },
        {
            value: 'pending',
            label: 'Pendiente',
        },
        {
            value: 'approved',
            label: 'Aprobado',
        },
        {
            value: 'under_review',
            label: 'En revision',
        },
    ]
    const optionsClientsEdit = {
        value: dataEdit?.client.id ? dataEdit?.client.id : '',
        label: dataEdit?.client.first_name + ' ' + dataEdit?.client.last_name,
        phone: dataEdit?.client.tel_number ? dataEdit?.client.tel_number : '',
        lastName: dataEdit?.client.last_name ? dataEdit?.client.last_name : '',
        firstName: dataEdit?.client.first_name ? dataEdit?.client.first_name : '',
        dni: dataEdit?.client.number_doc ? dataEdit?.client.number_doc : '',
        email: dataEdit?.client.email ? dataEdit?.client.email : '',
        points_balance: dataEdit?.client.points_balance ? dataEdit?.client.points_balance : '',
    }

    const handleAddClick = () => {
        if (fileInputRef.current != null) {
            fileInputRef.current.click()
        }
    }

    const messageRef = useRef<HTMLDivElement>(null)
    const copyMessage = () => {
        if (messageRef.current) {
            const message = messageRef.current.innerText
            navigator.clipboard
                .writeText(message)
                .then(() => {
                    setIsCopyText(true)
                    setTimeout(() => {
                        setIsCopyText(false)
                    }, 3000)
                })
                .catch((error) => {
                    console.error('Error al copiar el mensaje:', error)
                })
        } else {
            console.error('No se puede copiar el mensaje: el ref es nulo.')
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (imageSend.length > 2) {
                return
            }
            if (imageSend) {
                const newImages = Array.from(e.target.files)
                    .slice(0, 3 - imageSend?.length)
                    .map((file: File) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                setImageSend((prevImages) => [...prevImages, ...newImages])
            } else {
                const newImages = Array.from(e.target.files)

                setImageSend(newImages)
            }
        }
    }

    const handleDeleteImage = (index: number) => {
        if (imageSend) {
            const updatedImages = [...imageSend]
            updatedImages.splice(index, 1)

            setImageSend(updatedImages)
        }
    }

    const handleDeleteRecivedImage = (deletedId: string) => {
        setImageReceived((prevImages) => prevImages.filter((image) => image.id !== deletedId))

        setIdsDeleteImage((prevIds) => [...prevIds, { id: deletedId }])
    }

    const handleCancel = () => {
        onCancel()
    }

    const onSelectHouse = (event: any) => {
        const houseSelected = optionProperty?.results.find(
            (item: any) => item.id === event.target.value
        )
        setNameHouseAlert(houseSelected?.name ? houseSelected?.name : '')
        setHouseSeletc(event.target.value)
    }

    useEffect(() => {
        if (getNumber) {
            setPhoneNumber(getNumber)
            handlePhoneNumberChange(getNumber)
        }
    }, [getNumber])

    useEffect(() => {
        if (getEmail) {
            setEmailClient(getEmail)
        }
    }, [getEmail])

    const tomorrow = dayjs(checkInSelect).add(1, 'day')

    const copyMessageUrl = () => {
        const message = `https://casaaustin.pe/reserva.php?uuid=${reservCreate.id}`
        navigator.clipboard
            .writeText(message)
            .then(() => {
                setIsCopyUrl(true)
                setTimeout(() => {
                    setIsCopyUrl(false)
                }, 2000)
            })
            .catch((error) => {
                console.error('Error al copiar el mensaje:', error)
            })
    }
    const maxPoints = Number(getPoints) || 0
    return (
        <Box px={{ md: 8, sm: 4, xs: 0 }} position={'relative'}>
            <IconButton
                onClick={handleCancel}
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
            {successRegister ? (
                <Box>
                    <Typography mb={2}>Registro exitoso</Typography>
                    <SuccessEditIcon />
                    <Typography variant="subtitle2" mt={1}>
                        Confirmación de reserva:
                    </Typography>
                    <Box
                        sx={{
                            backgroundColor: 'rgba(0, 172, 238, 0.2)', // celeste opaco (transparente)
                            borderRadius: 4,
                            textAlign: 'center',
                            px: 2,
                        }}
                        onClick={copyMessageUrl}
                    >
                        <Typography
                            ref={messageRef}
                            variant="subtitle1"
                            sx={{
                                cursor: 'pointer',
                                ':hover': { opacity: 0.6 },
                            }}
                            fontSize={12}
                            py={0.6}
                        >
                            {isCopyUrl ? 'Enlace copiado' : 'Click aquí para copiar enlace'}
                        </Typography>
                    </Box>

                    <Typography variant="subtitle2" mt={2} ref={messageRef} textAlign={'left'}>
                        ¡<span>{nameClientAlert} </span> tu Reserva está Confirmada en{' '}
                        {filterTextHouse2(nameHouseAlert)}!
                        <br />
                        <br />
                        <span style={{ fontWeight: 700 }}>*Check-in:* </span>
                        {dayjs(dataRegisterAlert?.check_in_date).format('DD-MM-YYYY')} <br />
                        <span style={{ fontWeight: 700 }}>*Check-out:* </span>
                        {dayjs(dataRegisterAlert?.check_out_date).format('DD-MM-YYYY')} <br />
                        <span style={{ fontWeight: 700 }}>*Reserva para:* </span>
                        {dataRegisterAlert?.guests} personas <br />{' '}
                        <span style={{ fontWeight: 700 }}>*Precio total:* </span>$
                        {dataRegisterAlert?.price_usd} ó S/.{dataRegisterAlert?.price_sol} <br />
                        {checkFullPayment ? (
                            <>
                                <span style={{ fontWeight: 700 }}>*Adelanto:* </span> 100%
                                completado <br />
                            </>
                        ) : (
                            <>
                                <span style={{ fontWeight: 700 }}>*Adelanto:* </span>
                                {dataRegisterAlert?.advance_payment}{' '}
                                {turnCurrency(
                                    dataRegisterAlert?.advance_payment_currency
                                        ? dataRegisterAlert?.advance_payment_currency
                                        : ''
                                )}{' '}
                                <br />
                            </>
                        )}
                        <span style={{ fontWeight: 700 }}>*Ubicación:* </span>
                        {filterTextHouse(nameHouseAlert)} <br /> <br />
                        <span>
                            Al llegar comunicarse con Michael 946892171 , él te ayudará con el
                            ingreso.{' '}
                            {checkPool
                                ? ''
                                : 'La piscina ó Jacuzzi temperado se coordina con anticipación (costo adicional: 100 soles/noche).'}{' '}
                        </span>
                    </Typography>

                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Button
                            onClick={copyMessage}
                            sx={{
                                height: 38,
                                width: 167,
                                color: isCopyText ? 'grey' : '#0E6191',
                                background: 'white',
                                fontSize: '15px',
                                fontWeight: 400,
                                mt: 4,
                                ':hover': {
                                    background: 'white',
                                },
                            }}
                        >
                            {isCopyText ? 'Mensaje copiado' : ' Copiar mensaje'}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            sx={{
                                height: 38,
                                width: 167,
                                color: 'white',
                                background: '#0E6191',
                                fontSize: '15px',
                                fontWeight: 400,
                                mt: 4,
                                ':hover': {
                                    background: '#0E6191',
                                },
                            }}
                        >
                            Volver
                        </Button>
                    </Box>
                </Box>
            ) : successEdit ? (
                <SuccessCard
                    title={successEdit ? 'Cambios Realizados' : 'Registro exitoso'}
                    icon={successEdit ? <SuccessEditIcon /> : <SuccessIcon />}
                    onCancel={handleCancel}
                    text={
                        successEdit
                            ? 'La modificación de los datos del alquiler se ha realizado con éxito'
                            : 'El registro del alquiler se ha completado exitosamente'
                    }
                />
            ) : (
                <>
                    <Typography mb={2}>{title}</Typography>
                    {isEditLoading ? (
                        <SkeletonFormRental />
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Grid container columnSpacing={2}>
                                <Grid item md={12} xs={12}>
                                    <Controller
                                        name="property"
                                        defaultValue=""
                                        rules={{
                                            required: 'El tipo de casa es obligatoria',
                                        }}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <SelectInputPrimary
                                                variant="outlined"
                                                options={optionsHouse}
                                                label="Elija una casa"
                                                value={value}
                                                messageError={
                                                    (errors.property?.message ?? null) as string
                                                }
                                                onChange={(selectedValue) => {
                                                    onSelectHouse && onSelectHouse(selectedValue)
                                                    onChange(selectedValue)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Controller
                                        name="client"
                                        control={control}
                                        rules={{
                                            required:
                                                dataEdit?.origin === 'air'
                                                    ? false
                                                    : 'Elije un nombre',
                                        }}
                                        render={({ field }) => {
                                            const { onChange, value } = field
                                            return (
                                                <>
                                                    <Autocomplete
                                                        isOptionEqualToValue={(option, value) =>
                                                            option.value === value.value
                                                        }
                                                        value={
                                                            dataEdit?.id
                                                                ? value
                                                                    ? optionsClientsEdit
                                                                    : null
                                                                : value
                                                                  ? optionsClients.find(
                                                                        (option: any) => {
                                                                            return (
                                                                                value ===
                                                                                option.value
                                                                            )
                                                                        }
                                                                    ) ?? null
                                                                  : null
                                                        }
                                                        sx={{
                                                            '& .MuiPopper-root': {
                                                                background: 'red',
                                                                '& .MuiAutocomplete-popper': {},
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                height: '55px',
                                                                color: '#2F2B3D',

                                                                opacity: 0.9,
                                                                '& fieldset': {
                                                                    color: '#2F2B3D',
                                                                    opacity: 0.9,
                                                                    background: 'transparent',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #D1D0D4',
                                                                },
                                                                '&:hover fieldset': {
                                                                    border: '1px solid #D1D0D4',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    border: '1px solid #D1D0D4',
                                                                },
                                                            },

                                                            '& input': {
                                                                height: '24px',
                                                                color: '#2F2B3D',
                                                                opacity: 0.9,
                                                                fontSize: '16px',
                                                                fontWeight: 600,
                                                                backgroundColor: '#FFF',
                                                            },
                                                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                                                {
                                                                    display: 'none',
                                                                    color: '#2F2B3D',
                                                                    opacity: 0.9,
                                                                },
                                                            '& input:-webkit-autofill': {
                                                                webkitBoxShadow:
                                                                    '0 0 0px 1000px #F5F8FA inset' /* Resetear el borde */,
                                                                boxShadow:
                                                                    '0 0 0px 1000px #F5F8FA inset' /* Resetear el borde */,
                                                                color: '#2F2B3D',
                                                                opacity: 0.9,
                                                                fontWeight: 600,
                                                            },
                                                        }}
                                                        filterOptions={(options, { inputValue }) =>
                                                            options.filter((option) => {
                                                                const labelMatches = option.label
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        inputValue.toLowerCase()
                                                                    )
                                                                const lastNameMatches =
                                                                    option.lastName
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            inputValue.toLowerCase()
                                                                        )
                                                                const dniMatches = option.dni
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        inputValue.toLowerCase()
                                                                    )
                                                                const phoneMatches = option.phone
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        inputValue.toLowerCase()
                                                                    )
                                                                return (
                                                                    labelMatches ||
                                                                    lastNameMatches ||
                                                                    dniMatches ||
                                                                    phoneMatches
                                                                )
                                                            })
                                                        }
                                                        options={optionsClients}
                                                        onChange={(_event: any, newValue) => {
                                                            onChange(
                                                                newValue ? newValue.value : null
                                                            )
                                                            console.log(newValue)
                                                            setGetNumber(newValue?.phone)
                                                            setGetEmail(newValue?.email)
                                                            setGetPoints(newValue?.points_balance)
                                                            setNameClientAlert(
                                                                newValue?.firstName
                                                                    ? newValue?.firstName
                                                                    : ''
                                                            )
                                                        }}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                onChange={(e) => {
                                                                    setSearch(e.target.value)
                                                                }}
                                                                label="Buscar por nombre, apellido o documento"
                                                            />
                                                        )}
                                                    />
                                                </>
                                            )
                                        }}
                                    />
                                    <Typography
                                        color={'error'}
                                        fontSize={11}
                                        ml={1.5}
                                        mt={0.2}
                                        textAlign={'start'}
                                        variant="subtitle2"
                                        height={23}
                                    >
                                        {(errors.client?.message ?? null) as string}
                                    </Typography>
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    <Controller
                                        name="check_in_date"
                                        defaultValue={null}
                                        control={control}
                                        rules={{
                                            required: 'La fecha de ingreso es obligatoria',
                                        }}
                                        render={({ field }) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="es"
                                            >
                                                <DatePicker
                                                    slotProps={{
                                                        textField: {},
                                                        layout: {
                                                            sx: {
                                                                '.MuiDateCalendar-root': {
                                                                    color: '#0E6191',
                                                                    textTransform: 'capitalize',
                                                                    borderRadius: 0,
                                                                    borderWidth: 0,
                                                                    backgroundColor: 'white',
                                                                },
                                                                '.MuiDialogContent-root': {
                                                                    backgroundColor: 'white',
                                                                },
                                                                '& .MuiPickersDay-root': {
                                                                    color: '#5C5C5C',
                                                                    fontWeight: 600,
                                                                    '&.Mui-selected': {
                                                                        backgroundColor:
                                                                            '#0E6191 !important',
                                                                        color: 'white',
                                                                    },
                                                                },
                                                                '& .MuiButtonBase-root': {
                                                                    '&.MuiPickersDay-today': {
                                                                        border: '1px solid #0E6191 !important',
                                                                        background:
                                                                            'white !important',
                                                                        color: '#0E6191',
                                                                    },
                                                                },
                                                                '& .MuiPickersYear-yearButton': {
                                                                    background: 'red',
                                                                    '&.Mui-selected': {
                                                                        backgroundColor: '#0E6191',
                                                                        color: 'white',
                                                                        border: '1px solid blue',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                    disablePast={dataEdit?.id ? false : true}
                                                    label={'Fecha de ingreso'}
                                                    {...field}
                                                    sx={{
                                                        width: '100%',
                                                        '.MuiOutlinedInput-root': {
                                                            height: '55px',
                                                            color: '#2F2B3D',
                                                            opacity: 0.9,
                                                            '& fieldset': {
                                                                borderRadius: '8px',
                                                                border: '1px solid #D1D0D4',
                                                                background: 'transparent',
                                                            },
                                                            '&:hover fieldset': {
                                                                border: '1px solid #D1D0D4',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: '1px solid #D1D0D4',
                                                            },
                                                        },
                                                        '.MuiInputBase-input': {
                                                            color: '#2F2B3D',
                                                            fontSize: '16px',
                                                            fontWeight: 600,
                                                        },
                                                    }}
                                                    onChange={(newDate) => {
                                                        const formattedDate = newDate
                                                            ? dayjs(newDate).format('YYYY-MM-DD')
                                                            : ''
                                                        setCheckInSelect(formattedDate)
                                                        field.onChange(formattedDate)
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    <Typography
                                        color={'error'}
                                        fontSize={11}
                                        ml={1.5}
                                        mt={0.2}
                                        textAlign={'start'}
                                        variant="subtitle2"
                                        height={26}
                                    >
                                        {(errors.check_in_date?.message ?? null) as string}
                                    </Typography>
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    <Controller
                                        name="check_out_date"
                                        control={control}
                                        defaultValue={undefined}
                                        rules={{
                                            required: 'La fecha de salida es obligatoria',
                                        }}
                                        render={({ field }) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="es"
                                            >
                                                <DatePicker
                                                    disabled={checkInSelect ? false : true}
                                                    slotProps={{
                                                        textField: {},
                                                        layout: {
                                                            sx: {
                                                                '.MuiDateCalendar-root': {
                                                                    color: '#0E6191',
                                                                    textTransform: 'capitalize',
                                                                    borderRadius: 0,
                                                                    borderWidth: 0,
                                                                    backgroundColor: 'white',
                                                                },
                                                                '.MuiDialogContent-root': {
                                                                    backgroundColor: 'white',
                                                                },
                                                                '& .MuiPickersDay-root': {
                                                                    color: '#5C5C5C',
                                                                    fontWeight: 600,
                                                                    '&.Mui-selected': {
                                                                        backgroundColor:
                                                                            '#0E6191 !important',
                                                                        color: 'white',
                                                                    },
                                                                },
                                                                '& .MuiButtonBase-root': {
                                                                    '&.MuiPickersDay-today': {
                                                                        border: '1px solid #0E6191 !important',
                                                                        background:
                                                                            'white !important',
                                                                        color: '#0E6191',
                                                                    },
                                                                },
                                                                '& .MuiPickersYear-yearButton': {
                                                                    background: 'red',
                                                                    '&.Mui-selected': {
                                                                        backgroundColor: '#0E6191',
                                                                        color: 'white',
                                                                        border: '1px solid blue',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                    disablePast={dataEdit?.id ? false : true}
                                                    minDate={dataEdit?.id ? null : tomorrow}
                                                    label={'Fecha de salida'}
                                                    {...field}
                                                    sx={{
                                                        width: '100%',
                                                        '.MuiOutlinedInput-root': {
                                                            height: '55px',
                                                            color: '#2F2B3D',
                                                            opacity: 0.9,
                                                            '& fieldset': {
                                                                borderRadius: '8px',
                                                                border: '1px solid #D1D0D4',
                                                                background: 'transparent',
                                                            },
                                                            '&:hover fieldset': {
                                                                border: '1px solid #D1D0D4',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: '1px solid #D1D0D4',
                                                            },
                                                        },
                                                        '.MuiInputBase-input': {
                                                            color: '#2F2B3D',
                                                            fontSize: '16px',
                                                            fontWeight: 600,
                                                        },
                                                    }}
                                                    onChange={(newDate) => {
                                                        const formattedDate = newDate
                                                            ? dayjs(newDate).format('YYYY-MM-DD')
                                                            : ''
                                                        setCheckOutSelect(formattedDate)
                                                        field.onChange(formattedDate)
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    <Typography
                                        color={'error'}
                                        fontSize={11}
                                        ml={1.5}
                                        mt={0.2}
                                        textAlign={'start'}
                                        variant="subtitle2"
                                        height={26}
                                    >
                                        {(errors.check_out_date?.message ?? null) as string}
                                    </Typography>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <SecondaryInput
                                        {...register('guests', {
                                            required: 'El numero de huéspedes es obligatorios',
                                        })}
                                        type="text"
                                        label={'Cantidad de huéspedes'}
                                        messageError={(errors.guests?.message ?? null) as string}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                    sx={{ marginBottom: { md: '0px', xs: '20px' } }}
                                >
                                    <PhoneInput
                                        {...register('tel_contact_number', {
                                            required:
                                                dataEdit?.origin === 'air'
                                                    ? false
                                                    : 'El celular es obligatorios',
                                        })}
                                        value={phoneNumber ? phoneNumber : '51'}
                                        specialLabel={phoneNumber ? 'Número telefónico' : ''}
                                        country={'pe'}
                                        buttonStyle={{
                                            backgroundColor: '#FAFAFA',
                                            borderTopLeftRadius: '10px',
                                            borderBottomLeftRadius: '10px',
                                        }}
                                        dropdownStyle={{
                                            textAlign: 'start',
                                            color: 'black',
                                        }}
                                        placeholder="Número telefónico"
                                        inputStyle={{
                                            border: '1px solid #D1D0D4',
                                            borderRadius: '8px',
                                            color: '#2F2B3D',
                                            height: '55px',
                                            outline: 'none',
                                            width: '100%',
                                            fontFamily: 'Public Sans',
                                            fontWeight: 600,
                                        }}
                                        inputProps={{ className: 'input-phone-number' }}
                                        onChange={handlePhoneNumberChange}
                                    />
                                    <Typography
                                        color={'error'}
                                        fontSize={11}
                                        ml={1.5}
                                        mt={0.2}
                                        textAlign={'start'}
                                        variant="subtitle2"
                                    >
                                        {(errors.tel_contact_number?.message ?? null) as string}
                                    </Typography>
                                </Grid>{' '}
                                {data?.id ? (
                                    <Grid item md={6} xs={12}>
                                        <SecondaryInput
                                            value={emailClient ? emailClient : 'Sin correo'}
                                            type="text"
                                            label={'Correo electrónico'}
                                        />
                                    </Grid>
                                ) : (
                                    <Grid item md={6} xs={12}>
                                        <SecondaryInput
                                            value={getEmail ? getEmail : 'Sin correo'}
                                            type="text"
                                            label={'Correo electrónico'}
                                        />
                                    </Grid>
                                )}
                                <Grid item md={6} xs={12}>
                                    <Controller
                                        name="status"
                                        defaultValue=""
                                        rules={{
                                            required: 'El tipo de estado es obligatoria',
                                        }}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <SelectInputPrimary
                                                variant="outlined"
                                                options={optionsStatus}
                                                label="Elija un estado"
                                                value={value}
                                                messageError={
                                                    (errors.status?.message ?? null) as string
                                                }
                                                onChange={(selectedValue) => {
                                                    onChange(selectedValue)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    <SecondaryInput
                                        {...register('price_usd', {
                                            required: 'El precio es obligatorio',
                                        })}
                                        type="text"
                                        label={'Precio en dólares'}
                                        messageError={(errors.price_usd?.message ?? null) as string}
                                    />
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    <SecondaryInput
                                        {...register('price_sol', {
                                            required: 'El precio es obligatorio',
                                        })}
                                        type="text"
                                        label={'Precio en soles'}
                                        messageError={(errors.price_sol?.message ?? null) as string}
                                    />
                                </Grid>
                                {pointsReserv && (
                                    <Grid item md={12} xs={12} display={'flex'} gap={1}>
                                        <SecondaryInput
                                            value={pointsReserv}
                                            fullWidth
                                            inputProps={{
                                                step: 'any',
                                            }}
                                            defaultValue={0}
                                            type="number"
                                            label={`Puntos usados`}
                                            messageError={
                                                (errors.points_to_redeem?.message ?? null) as string
                                            }
                                        />
                                    </Grid>
                                )}
                                {getPoints && (
                                    <Grid item md={12} xs={12} display={'flex'} gap={1}>
                                        <Box
                                            sx={{
                                                border: '1px solid #D1D0D4',
                                                display: 'flex',
                                                width: 120,
                                                px: 1.2,
                                                borderRadius: 2,

                                                height: 56,
                                                alignItems: 'start',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="body1" fontSize={12}>
                                                Puntos
                                            </Typography>
                                            <Typography variant="body2" fontSize={13}>
                                                {getPoints} pts
                                            </Typography>
                                        </Box>
                                        <SecondaryInput
                                            {...register('points_to_redeem', {
                                                required: 'El punto es obligatorio',
                                                valueAsNumber: true,
                                                min: {
                                                    value: 0,
                                                    message: 'Debe ser mayor o igual a 0',
                                                },
                                                max: {
                                                    value: maxPoints,
                                                    message: `No puede superar ${maxPoints} puntos`,
                                                },
                                            })}
                                            fullWidth
                                            inputProps={{
                                                step: 'any',
                                            }}
                                            defaultValue={0}
                                            type="number"
                                            label={`Escribe un máximo de ${maxPoints} pts`}
                                            messageError={
                                                (errors.points_to_redeem?.message ?? null) as string
                                            }
                                        />
                                    </Grid>
                                )}
                                <Grid item md={6} xs={6}>
                                    <Controller
                                        name="advance_payment_currency"
                                        defaultValue=""
                                        control={control}
                                        rules={{
                                            required: 'El tipo de moneda es obligatorio',
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <SelectInputPrimary
                                                variant="outlined"
                                                options={[
                                                    { value: 'sol', label: 'Soles' },
                                                    { value: 'usd', label: 'Dolares' },
                                                ]}
                                                label="Moneda"
                                                value={value}
                                                onChange={onChange}
                                                messageError={
                                                    (errors.advance_payment_currency?.message ??
                                                        null) as string
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    {!checkFullPayment && (
                                        <SecondaryInput
                                            {...register('advance_payment')}
                                            type="text"
                                            label={'Adelanto'}
                                            messageError={
                                                (errors.advance_payment?.message ?? null) as string
                                            }
                                        />
                                    )}
                                </Grid>
                                <Grid mb={2} item md={12} xs={12}>
                                    <SecondaryInputMulti
                                        {...register('comentarios_reservas', {
                                            maxLength: {
                                                value: 200,
                                                message:
                                                    'El comentario no puede exceder los 200 caracteres',
                                            },
                                        })}
                                        type="text"
                                        label={'Comentario'}
                                    />
                                </Grid>
                                <Grid item md={6} xs={6} display={'flex'} justifyContent={'start'}>
                                    <FormControlLabel
                                        sx={{ ml: 0.1 }}
                                        onClick={() => {
                                            setCheckPool(!checkPool)
                                        }}
                                        control={
                                            <Checkbox
                                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                                checkedIcon={
                                                    <RadioButtonCheckedIcon fontSize="small" />
                                                }
                                                checked={checkPool}
                                                sx={{
                                                    mr: 0,
                                                    p: 0.5,
                                                    color: '#EB4C60',
                                                    '&.Mui-checked': {
                                                        color: '#EB4C60',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    color: '#000F08',
                                                    fontSize: {
                                                        md: '15px',
                                                        sm: '14px',
                                                        xs: '13px',
                                                    },
                                                    fontWeight: 400,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                Piscina temperada
                                            </Typography>
                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={6}
                                    display={'flex'}
                                    justifyContent={'start'}
                                    alignItems={'start'}
                                >
                                    <FormControlLabel
                                        sx={{ ml: 0.1 }}
                                        onClick={() => {
                                            setCheckFullPayment(!checkFullPayment)
                                        }}
                                        control={
                                            <Checkbox
                                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                                checkedIcon={
                                                    <RadioButtonCheckedIcon fontSize="small" />
                                                }
                                                checked={checkFullPayment}
                                                sx={{
                                                    mr: 0,
                                                    p: 0.5,
                                                    color: '#0E6191',
                                                    '&.Mui-checked': {
                                                        color: '#0E6191',
                                                    },
                                                    '&.MuiFormControlLabel-label': {
                                                        color: '#0E6191',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    color: '#000F08',
                                                    fontSize: {
                                                        md: '15px',
                                                        sm: '14px',
                                                        xs: '13px',
                                                    },
                                                    fontWeight: 400,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                Pago completo
                                            </Typography>
                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={6}
                                    display={'flex'}
                                    justifyContent={'start'}
                                    alignItems={'start'}
                                >
                                    <FormControlLabel
                                        sx={{ ml: 0.1, mt: 3 }}
                                        onClick={() => {
                                            setLateCheckOut(!lateCheckOut)
                                        }}
                                        control={
                                            <Checkbox
                                                icon={<RadioButtonUncheckedIcon fontSize="small" />}
                                                checkedIcon={
                                                    <RadioButtonCheckedIcon fontSize="small" />
                                                }
                                                checked={lateCheckOut}
                                                sx={{
                                                    mr: 0,
                                                    p: 0.5,
                                                    color: '#0E6191',
                                                    '&.Mui-checked': {
                                                        color: '#0E6191',
                                                    },
                                                    '&.MuiFormControlLabel-label': {
                                                        color: '#0E6191',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    color: '#000F08',
                                                    fontSize: {
                                                        md: '15px',
                                                        sm: '14px',
                                                        xs: '13px',
                                                    },
                                                    fontWeight: 400,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                Late Checkout
                                            </Typography>
                                        }
                                    />
                                </Grid>
                                <Grid
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={1}
                                    style={{ marginTop: '20px', marginBottom: '12px' }}
                                    item
                                    md={12}
                                    xs={12}
                                >
                                    {imageReceived &&
                                        imageReceived.map((image) => (
                                            <Box
                                                key={image.id}
                                                sx={{
                                                    border: '2px solid #C9CED6',
                                                    height: '80px',
                                                    width: '80px',
                                                    borderRadius: '10px',
                                                    position: 'relative',
                                                    marginRight: '10px',
                                                }}
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        handleDeleteRecivedImage(image.id)
                                                    }
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -20,
                                                        right: -20,
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <img
                                                    src={image.file}
                                                    alt={`Image ${image.id}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '10px',
                                                    }}
                                                />
                                            </Box>
                                        ))}

                                    {imageSend && imageSend.length > 0
                                        ? imageSend.map((image: any, index) => (
                                              <Box
                                                  key={index}
                                                  sx={{
                                                      border: '2px solid #C9CED6',
                                                      height: '80px',
                                                      width: '80px',
                                                      borderRadius: '10px',
                                                      position: 'relative',
                                                      marginRight: '10px',
                                                  }}
                                              >
                                                  <IconButton
                                                      onClick={() => handleDeleteImage(index)}
                                                      sx={{
                                                          position: 'absolute',
                                                          top: -20,
                                                          right: -20,
                                                      }}
                                                  >
                                                      <DeleteIcon />
                                                  </IconButton>
                                                  <img
                                                      src={image.preview}
                                                      alt={`Image ${index}`}
                                                      style={{
                                                          width: '100%',
                                                          height: '100%',
                                                          borderRadius: '10px',
                                                      }}
                                                  />
                                              </Box>
                                          ))
                                        : null}

                                    {imageSend?.length > 2 ? null : (
                                        <>
                                            <Typography
                                                onClick={handleAddClick}
                                                sx={{
                                                    ':hover': { cursor: 'pointer' },
                                                    fontWeight: 400,
                                                    m: 0,
                                                    p: 0,
                                                    textAlign: 'start',
                                                }}
                                            >
                                                + Agregar comprobante
                                            </Typography>
                                            <input
                                                {...register('file')}
                                                ref={fileInputRef}
                                                type="file"
                                                hidden
                                                onChange={handleImageChange}
                                                multiple
                                            />
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <ButtonPrimary
                                type="submit"
                                isLoading={isLoading}
                                style={{
                                    background: '#0E6191',
                                    color: 'white',
                                    height: '48px',
                                    fontWeight: 500,
                                    width: '100%',
                                    marginTop: '16px',
                                    marginBottom: '4px',
                                }}
                            >
                                {btn}
                            </ButtonPrimary>
                        </form>
                    )}
                    <BasicModal open={openErrorModal}>
                        <ModalErrors
                            title="Ups! ocurrió un problema"
                            data={errorMessage}
                            onCancel={() => setOpenErrorModal(false)}
                        />
                    </BasicModal>
                </>
            )}
        </Box>
    )
}
