import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Box,
    Typography,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useCreateStaffMutation } from '@/services/staff/staffService'

interface StaffAddModalProps {
    open: boolean
    onClose: () => void
    onStaffAdded: () => void
}

interface StaffFormData {
    first_name: string
    last_name: string
    email: string
    phone: string
    staff_type: string
    status: string
    daily_rate: number
}

export default function StaffAddModal({ open, onClose, onStaffAdded }: StaffAddModalProps) {
    const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation()

    const { control, handleSubmit, reset, formState: { errors } } = useForm<StaffFormData>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            staff_type: 'cleaning',
            status: 'active',
            daily_rate: 50,
        }
    })

    const staffTypes = [
        { value: 'cleaning', label: 'Limpieza' },
        { value: 'maintenance', label: 'Mantenimiento' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'admin', label: 'Administrador' },
        { value: 'both', label: 'Ambos' },
    ]

    const statuses = [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' },
        { value: 'on_leave', label: 'En vacaciones' },
    ]

    const getStaffTypeIcon = (type: string) => {
        switch (type) {
            case 'cleaning': return '🧹'
            case 'maintenance': return '🔧'
            case 'supervisor': return '👨‍💼'
            case 'admin': return '⚙️'
            case 'both': return '🔄'
            default: return '👤'
        }
    }

    const onSubmit = async (data: StaffFormData) => {
        try {
            const formData = new FormData()
            formData.append('first_name', data.first_name)
            formData.append('last_name', data.last_name)
            formData.append('email', data.email)
            formData.append('phone', data.phone)
            formData.append('staff_type', data.staff_type)
            formData.append('daily_rate', data.daily_rate.toString())
            formData.append('can_work_weekends', 'true')
            formData.append('max_properties_per_day', '2')

            await createStaff(formData).unwrap()

            onStaffAdded()
            onClose()
            reset()
        } catch (error) {
            console.error('Error creating staff:', error)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        👤 Agregar Nuevo Empleado
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Completa la información del nuevo miembro del personal
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={3}>
                        {/* Nombre */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="first_name"
                                control={control}
                                rules={{ required: 'El nombre es obligatorio' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre"
                                        fullWidth
                                        error={!!errors.first_name}
                                        helperText={errors.first_name?.message}
                                        placeholder="Ej: Luis"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Apellido */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="last_name"
                                control={control}
                                rules={{ required: 'El apellido es obligatorio' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Apellido"
                                        fullWidth
                                        error={!!errors.last_name}
                                        helperText={errors.last_name?.message}
                                        placeholder="Ej: Gutierrez"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ 
                                    required: 'El email es obligatorio',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Email inválido'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        placeholder="Ej: luis@casaaustin.pe"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Teléfono */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{ required: 'El teléfono es obligatorio' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Teléfono"
                                        fullWidth
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        placeholder="Ej: +51 999 123 456"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Tipo de Personal */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="staff_type"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Tipo de Personal"
                                        fullWidth
                                    >
                                        {staffTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {getStaffTypeIcon(type.value)} {type.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Estado */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Estado"
                                        fullWidth
                                    >
                                        {statuses.map((status) => (
                                            <MenuItem key={status.value} value={status.value}>
                                                {status.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Tarifa Diaria */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="daily_rate"
                                control={control}
                                rules={{ 
                                    required: 'La tarifa diaria es obligatoria',
                                    min: { value: 1, message: 'La tarifa debe ser mayor a 0' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        label="Tarifa Diaria (S/)"
                                        fullWidth
                                        error={!!errors.daily_rate}
                                        helperText={errors.daily_rate?.message}
                                        inputProps={{ min: 1 }}
                                        placeholder="50"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleClose}
                        sx={{ mr: 1 }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained"
                        disabled={isCreating}
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {isCreating ? 'Agregando...' : 'Agregar Empleado'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}