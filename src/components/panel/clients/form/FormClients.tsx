import { Box, Checkbox, FormControlLabel, Grid, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SelectInputPrimary from '../../../common/input/SelectInputPrimary'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SecondaryInput } from '../../../common/input/SecondaryInput'
import 'dayjs/locale/es'
import 'dayjs/locale/en'
import CheckBoxSelected from '../../../common/icons/CheckBoxSelected'
import CheckBoxIcon from '../../../common/icons/CheckBoxIcon'
import { Controller } from 'react-hook-form'
import { useFormClients } from '../../../../libs/services/clients/useFormClients'
import ButtonPrimary from '../../../common/button/ButtonPrimary'
import SuccessIcon from '../../../common/icons/SuccessIcon'

import { IRegisterClient } from '../../../../interfaces/clients/registerClients'
import SuccessCard from '../card/SuccessCard'
import SuccessEditIcon from '../../../common/icons/SucessEditIcon'
import { useEffect, useState } from 'react'
import { useGetClientsByBDQuery } from '../../../../libs/services/clients/clientesofBdService'

interface Props {
    onCancel: () => void
    title: string
    btn: string
    data: IRegisterClient | null
    refetch: any
}

export default function FormClients({ onCancel, title, btn, data, refetch }: Props) {
    const {
        register,
        isLoading,
        handleSubmit,
        control,
        setSelectedOption,
        selectedOption,
        errors,
        successRegister,
        errorMessage,
        successEdit,
    } = useFormClients(data, refetch)

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value)
    }

    const [typeDocument, setTypeDocument] = useState('')
    const [numberDocument, setNumberDocument] = useState('')
    const { data: ClientBD } = useGetClientsByBDQuery({
        numberDocument: numberDocument,
        typeDocument: typeDocument,
        token: '20483ac1-702f-41c7-80f2-f98205acd11a',
    })
    const onDocumentNumber = (event: any) => {
        console.log(event.target.value)
        setNumberDocument(event.target.value)
    }

    const onSelectDocument = (event: any) => {
        console.log(event.target.value)
        setTypeDocument(event.target.value)
    }
    useEffect(() => {
        console.log(ClientBD)
    })
    return (
        <div>
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
                {successRegister || successEdit ? (
                    <SuccessCard
                        title={successEdit ? 'Cambios Realizados' : 'Registro exitoso'}
                        icon={successEdit ? <SuccessEditIcon /> : <SuccessIcon />}
                        onCancel={onCancel}
                        text={
                            successEdit
                                ? 'Los datos del cliente han sido actualizados exitosamente'
                                : 'El registro del cliente se ha completado satisfactoriamente'
                        }
                    />
                ) : (
                    <div>
                        <Typography mb={2}>{title}</Typography>

                        <form onSubmit={handleSubmit}>
                            <Grid container columnSpacing={2}>
                                <Grid item md={6} xs={12}>
                                    <Controller
                                        name="document_type"
                                        defaultValue=""
                                        rules={{
                                            required: 'El tipo de documento es obligatorio',
                                        }}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <SelectInputPrimary
                                                variant="outlined"
                                                options={[
                                                    { value: 'dni', label: 'DNI' },
                                                    {
                                                        value: 'cex',
                                                        label: 'Carnet de extranjeria',
                                                    },
                                                    { value: 'pas', label: 'Pasaporte' },
                                                    { value: 'ruc', label: 'RUC' },
                                                ]}
                                                label="Elija tipo de documento"
                                                value={value}
                                                onChange={(selectedValue) => {
                                                    onSelectDocument &&
                                                        onSelectDocument(selectedValue)
                                                    onChange(selectedValue)
                                                }}
                                                messageError={
                                                    (errors.document_type?.message ??
                                                        null) as string
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <SecondaryInput
                                        {...register('number_doc', {
                                            required: 'Numbero de documento obligatorio',
                                        })}
                                        type="number"
                                        onChange={onDocumentNumber}
                                        label={'Número de documento'}
                                        messageError={
                                            (errors.number_doc?.message ?? null) as string
                                        }
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Controller
                                        name="date"
                                        defaultValue={null}
                                        control={control}
                                        rules={{ required: 'La fecha es obligatoria' }}
                                        render={({ field }) => (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="es"
                                            >
                                                <DatePicker
                                                    label={'Elija una fecha'}
                                                    {...field}
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
                                                                    '&.Mui-selected': {
                                                                        backgroundColor: '#0E6191',
                                                                        color: 'white',
                                                                    },
                                                                },
                                                                '& .MuiPickersYear-yearButton': {
                                                                    '&.Mui-selected': {
                                                                        backgroundColor: '#0E6191',
                                                                        color: 'white',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
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
                                        {(errors.date?.message ?? null) as string}
                                    </Typography>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <SecondaryInput
                                        {...register('first_name', {
                                            required: 'El nombre es obligatorio',
                                        })}
                                        type="text"
                                        label={'Nombres'}
                                        messageError={
                                            (errors.first_name?.message ?? null) as string
                                        }
                                    />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <SecondaryInput
                                        {...register('last_name', {
                                            required: 'El apellido es obligatorio',
                                        })}
                                        type="text"
                                        label={'Apellidos'}
                                        messageError={(errors.last_name?.message ?? null) as string}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <SecondaryInput
                                        {...register('email', {
                                            required: 'El correo es obligatorio',
                                            pattern: {
                                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                                                message: 'El correo no es valido    ',
                                            },
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    'El correo electrónico debe tener como máximo 100 caracteres',
                                            },
                                        })}
                                        type="text"
                                        label={'Correo electrónico'}
                                        messageError={(errors.email?.message ?? null) as string}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <SecondaryInput
                                        {...register('tel_number', {
                                            required: 'El celular es obligatorio',
                                        })}
                                        type="number"
                                        label={'Número de teléfono'}
                                        messageError={
                                            (errors.tel_number?.message ?? null) as string
                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    display={'flex'}
                                    alignItems={'start'}
                                    flexDirection={'column'}
                                >
                                    <Box>
                                        <FormControlLabel
                                            sx={{
                                                '& .MuiTypography-body1': {
                                                    color: '#2F2B3D',
                                                    opacity: 0.9,
                                                    fontSize: '16px',
                                                    fontWeight: 500,
                                                    mr: 2,
                                                },
                                            }}
                                            control={
                                                <Checkbox
                                                    {...register('sex', {
                                                        required: 'El genero es obligatorio',
                                                    })}
                                                    checked={selectedOption === 'm'}
                                                    onChange={handleOptionChange}
                                                    value="m"
                                                    icon={<CheckBoxIcon />}
                                                    checkedIcon={<CheckBoxSelected />}
                                                />
                                            }
                                            label="Masculino"
                                        />
                                        <FormControlLabel
                                            sx={{
                                                '& .MuiTypography-body1': {
                                                    color: '#2F2B3D',
                                                    opacity: 0.9,
                                                    fontSize: '16px',
                                                    fontWeight: 500,
                                                    mr: 2,
                                                },
                                            }}
                                            control={
                                                <Checkbox
                                                    {...register('sex', {
                                                        required: 'El genero es obligatorio',
                                                    })}
                                                    checked={selectedOption === 'f'}
                                                    onChange={handleOptionChange}
                                                    value="f"
                                                    icon={<CheckBoxIcon />}
                                                    checkedIcon={<CheckBoxSelected />}
                                                />
                                            }
                                            label="Femenino"
                                        />
                                    </Box>
                                    <Typography
                                        color={'error'}
                                        fontSize={11}
                                        ml={1.5}
                                        mt={-2.2}
                                        textAlign={'start'}
                                        variant="subtitle2"
                                        height={21}
                                    >
                                        {errors.sex && <p>{errors.sex.message}</p>}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box>
                                <Typography
                                    color={'error'}
                                    fontSize={13}
                                    textAlign={'center'}
                                    variant="subtitle2"
                                    height={24}
                                    mt={0.5}
                                >
                                    {errorMessage}
                                </Typography>
                            </Box>
                            <ButtonPrimary
                                type="submit"
                                isLoading={isLoading}
                                style={{
                                    background: '#0E6191',
                                    color: 'white',
                                    height: '48px',
                                    fontWeight: 500,
                                    width: '100%',
                                    marginTop: '4px',
                                    marginBottom: '4px',
                                }}
                            >
                                {btn}
                            </ButtonPrimary>
                        </form>
                    </div>
                )}
            </Box>
        </div>
    )
}
