import { Autocomplete, Box, Grid, IconButton, TextField, Typography } from '@mui/material'
import SelectInputPrimary from '../../../common/input/SelectInputPrimary'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useRef, useState } from 'react'
import { SecondaryInput } from '../../../common/input/SecondaryInput'
import DeleteIcon from '../../../common/icons/DeleteIcon'
import { Controller } from 'react-hook-form'
import { useFormRentals } from '../../../../libs/services/rentals/useFormRentals'
import 'dayjs/locale/es'
import 'dayjs/locale/en'
import {
    useGetAllPropertiesQuery,
    useGetRentalsByIdQuery,
} from '../../../../libs/services/rentals/rentalService'
import { useGetAllClientsQuery } from '../../../../libs/services/clients/clientsService'
import ButtonPrimary from '../../../common/button/ButtonPrimary'
import SuccessCard from '../../clients/card/SuccessCard'
import SuccessEditIcon from '../../../common/icons/SucessEditIcon'
import SuccessIcon from '../../../common/icons/SuccessIcon'
import { IRentalClient } from '../../../../interfaces/rental/registerRental'
import dayjs from 'dayjs'
import SkeletonFormRental from './SkeletonFormRental'
import BasicModal from '../../../common/modal/BasicModal'
import ModalErrors from '../../../common/modal/ModalErrors'

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
    const { data: optionClients } = useGetAllClientsQuery({
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
    } = useFormRentals(data, refetch, refetchEdit)

    useEffect(() => {
        if (dataEdit?.id) {
            setValue('guests', dataEdit.guests)
            setValue('price_sol', dataEdit.price_sol)
            setValue('price_usd', dataEdit.price_usd)
            setValue('advance_payment', dataEdit.advance_payment)
            setValue('check_in_date', dayjs(dataEdit.check_in_date))
            setValue('check_out_date', dayjs(dataEdit.check_out_date))
            setValue('advance_payment_currency', dataEdit.advance_payment_currency)
            setValue('property', dataEdit.property.id)
            setValue('client', dataEdit.client.id)
            setImageReceived(dataEdit.recipts)
            setHouseSeletc(dataEdit.property.id)
            setCheckInSelect(dataEdit.check_in_date)
            setCheckOutSelect(dataEdit.check_out_date)
        }
    }, [isEditLoading, dataEdit])

    const fileInputRef = useRef<any>(null)

    const optionsHouse =
        optionProperty?.results.map((property) => ({
            value: property.id,
            label: property.name,
        })) || []

    const optionsClients =
        optionClients?.results.map((property) => ({
            value: property.id,
            label: property.first_name,
            email: property.email,
        })) || []

    const handleAddClick = () => {
        if (fileInputRef.current != null) {
            fileInputRef.current.click()
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
        setHouseSeletc(event.target.value)
    }
    const tomorrow = dayjs().add(1, 'day')
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
            {successRegister || successEdit ? (
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
                    {' '}
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
                                        rules={{ required: 'Elige un nombre' }}
                                        render={({ field }) => {
                                            const { onChange, value } = field

                                            return (
                                                <>
                                                    <Autocomplete
                                                        value={
                                                            value
                                                                ? optionsClients.find((option) => {
                                                                      return value === option.value
                                                                  }) ?? null
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
                                                        options={optionsClients}
                                                        onChange={(_event: any, newValue) => {
                                                            onChange(
                                                                newValue ? newValue.value : null
                                                            )
                                                        }}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                onChange={(e) => {
                                                                    setSearch(e.target.value)
                                                                }}
                                                                label="Elija un nombre o correo electrónico"
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
                                                    disablePast
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
                                                        // Convierte la fecha seleccionada a cadena en el formato deseado
                                                        const formattedDate = newDate
                                                            ? dayjs(newDate).format('YYYY-MM-DD')
                                                            : ''
                                                        setCheckInSelect(formattedDate)
                                                        // Pasa la fecha formateada al otro componente usando setValue
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
                                                    disablePast
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
                                                    minDate={tomorrow}
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
                                <Grid item md={12} xs={12}>
                                    <SecondaryInput
                                        {...register('guests', {
                                            required: 'El numero de huespedes es obligatorios',
                                        })}
                                        type="text"
                                        label={'Cantidad de huéspedes'}
                                        messageError={(errors.guests?.message ?? null) as string}
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
                                <Grid item md={6} xs={6}>
                                    <SecondaryInput
                                        {...register('advance_payment')}
                                        type="text"
                                        label={'Adelanto'}
                                        messageError={
                                            (errors.advance_payment?.message ?? null) as string
                                        }
                                    />
                                </Grid>
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
                                <Grid
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={1}
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
                            title="Ups! ocurrio un problema"
                            data={errorMessage}
                            onCancel={() => setOpenErrorModal(false)}
                        />
                    </BasicModal>
                </>
            )}
        </Box>
    )
}
