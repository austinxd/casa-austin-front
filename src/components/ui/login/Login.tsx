import { Box, Typography } from '@mui/material'
import { InputPrimary } from '../../common/input/InputPrimary'
import ButtonPrimary from '../../common/button/ButtonPrimary'
import style from './login.module.css'
import { InputPrimaryPassword } from '../../common/input/InputPrimaryPassword'
import { useLoginForm } from '../../../libs/services/auth/useLoginForm'

export default function Login() {
    const { errors, register, isLoading, handleSubmit, errorMessage } = useLoginForm()

    return (
        <Box
            minHeight={'100vh'}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Box
                sx={{
                    padding: '47px 111px',
                    background: '#0E6191',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: '20px',
                    '@media (max-width: 1000px)': {
                        padding: '32px 70px',
                    },
                    '@media (max-width: 700px)': {
                        padding: '32px 40px',
                    },
                }}
            >
                <img src="../../../../public/img/icons/logo.svg" className={style.imgLogo} />
                <form onSubmit={handleSubmit}>
                    <InputPrimary
                        color="secondary"
                        {...register('email', {
                            required: 'El correo es obligatorio',
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                                message: 'Digitar un correo valido',
                            },
                        })}
                        placeholder="Nombre de usuario"
                        label={'Nombre de usuario (correo electrónico)'}
                        messageError={(errors.email?.message ?? null) as string}
                    />

                    <InputPrimaryPassword
                        color="secondary"
                        {...register('password', {
                            required: 'La contraseña es obligatoria',
                        })}
                        label={'Contraseña'}
                        messageError={(errors.password?.message ?? null) as string}
                        placeholder="********"
                    />
                    {errorMessage && (
                        <Typography mb={2} textAlign={'center'} color={'error'}>
                            {errorMessage}
                        </Typography>
                    )}
                    <ButtonPrimary
                        type="submit"
                        isLoading={isLoading}
                        style={{
                            background: 'white',
                            color: '#0E6191',
                            height: '55px',
                            width: '100%',
                        }}
                    >
                        Acceder
                    </ButtonPrimary>
                </form>
            </Box>
        </Box>
    )
}
