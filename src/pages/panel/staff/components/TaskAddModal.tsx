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
import { useCreateTaskMutation } from '@/services/tasks/tasksService'
import { useGetAllStaffQuery } from '@/services/staff/staffService'

interface TaskAddModalProps {
    open: boolean
    onClose: () => void
    onTaskAdded: () => void
}

interface TaskFormData {
    title: string
    description: string
    task_type: string
    priority: string
    status: string
    staff_member: string
    property_name: string
    scheduled_date: string
    estimated_duration: number
}

export default function TaskAddModal({ open, onClose, onTaskAdded }: TaskAddModalProps) {
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation()
    const { data: staffData } = useGetAllStaffQuery({ page: 1, page_size: 50 })

    const { control, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            task_type: 'checkout_cleaning',
            priority: 'medium',
            status: 'pending',
            staff_member: '',
            property_name: '',
            scheduled_date: '',
            estimated_duration: 60,
        }
    })

    const taskTypes = [
        { value: 'checkout_cleaning', label: 'Limpieza de Salida' },
        { value: 'checkin_preparation', label: 'Preparación de Entrada' },
        { value: 'maintenance', label: 'Mantenimiento' },
        { value: 'inspection', label: 'Inspección' },
    ]

    const priorities = [
        { value: 'low', label: 'Baja' },
        { value: 'medium', label: 'Media' },
        { value: 'high', label: 'Alta' },
        { value: 'urgent', label: 'Urgente' },
    ]

    const statuses = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'assigned', label: 'Asignada' },
    ]

    const properties = [
        { value: 'Casa Austin 1', label: 'Casa Austin 1' },
        { value: 'Casa Austin 2', label: 'Casa Austin 2' },
        { value: 'Casa Austin 3', label: 'Casa Austin 3' },
        { value: 'Casa Austin 4', label: 'Casa Austin 4' },
    ]

    const getTaskTypeIcon = (type: string) => {
        switch (type) {
            case 'checkout_cleaning': return '🧹'
            case 'maintenance': return '🔧'
            case 'inspection': return '🔍'
            case 'checkin_preparation': return '✨'
            default: return '📋'
        }
    }

    const onSubmit = async (data: TaskFormData) => {
        try {
            await createTask({
                title: data.title,
                description: data.description,
                task_type: data.task_type as any,
                priority: data.priority as any,
                status: data.status as any,
                staff_member: data.staff_member || null,
                property_name: data.property_name,
                scheduled_date: data.scheduled_date ? `${data.scheduled_date}T09:00:00Z` : null,
                estimated_duration: data.estimated_duration.toString(),
            }).unwrap()

            onTaskAdded()
            onClose()
            reset()
        } catch (error) {
            console.error('Error creating task:', error)
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
            fullScreen={false}
            PaperProps={{
                sx: { 
                    borderRadius: 2,
                    '@media (max-width: 600px)': {
                        margin: 1,
                        maxHeight: '90vh',
                    },
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        📋 Crear Nueva Tarea
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Completa la información para crear una nueva tarea
                </Typography>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={3}>
                        {/* Título */}
                        <Grid item xs={12}>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'El título es obligatorio' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Título de la Tarea"
                                        fullWidth
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                        placeholder="Ej: Limpieza completa Casa Austin 1"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Tipo de Tarea */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="task_type"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Tipo de Tarea"
                                        fullWidth
                                    >
                                        {taskTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {getTaskTypeIcon(type.value)} {type.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Prioridad */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Prioridad"
                                        fullWidth
                                    >
                                        {priorities.map((priority) => (
                                            <MenuItem key={priority.value} value={priority.value}>
                                                {priority.label}
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

                        {/* Empleado Asignado */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="staff_member"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Empleado Asignado"
                                        fullWidth
                                    >
                                        <MenuItem value="">Sin asignar</MenuItem>
                                        {staffData?.results?.map((staff) => (
                                            <MenuItem key={staff.id} value={staff.id}>
                                                {staff.full_name || `${staff.first_name} ${staff.last_name}` || 'Sin nombre'}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Propiedad */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="property_name"
                                control={control}
                                rules={{ required: 'La propiedad es obligatoria' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Propiedad"
                                        fullWidth
                                        error={!!errors.property_name}
                                        helperText={errors.property_name?.message}
                                    >
                                        {properties.map((property) => (
                                            <MenuItem key={property.value} value={property.value}>
                                                {property.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        {/* Fecha Programada */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="scheduled_date"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="date"
                                        label="Fecha Programada"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Duración Estimada */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="estimated_duration"
                                control={control}
                                rules={{ 
                                    required: 'La duración es obligatoria',
                                    min: { value: 15, message: 'Mínimo 15 minutos' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        label="Duración Estimada (minutos)"
                                        fullWidth
                                        error={!!errors.estimated_duration}
                                        helperText={errors.estimated_duration?.message}
                                        inputProps={{ min: 15, max: 480 }}
                                        placeholder="60"
                                    />
                                )}
                            />
                        </Grid>

                        {/* Descripción */}
                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Describe los detalles específicos de la tarea..."
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
                        {isCreating ? 'Creando...' : 'Crear Tarea'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}