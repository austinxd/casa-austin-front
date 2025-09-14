import { useEffect } from 'react'
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
import { useUpdateTaskMutation } from '@/services/tasks/tasksService'
import { useGetAllStaffQuery } from '@/services/staff/staffService'
import { WorkTask } from '@/interfaces/staff.interface'

interface TaskEditModalProps {
    open: boolean
    onClose: () => void
    task: WorkTask | null
    onTaskUpdated: () => void
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
    notes: string
}

export default function TaskEditModal({ open, onClose, task, onTaskUpdated }: TaskEditModalProps) {
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
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
            notes: '',
        }
    })

    useEffect(() => {
        if (task && open) {
            reset({
                title: task.title || '',
                description: task.description || '',
                task_type: task.task_type || 'checkout_cleaning',
                priority: task.priority || 'medium',
                status: task.status || 'pending',
                staff_member: task.staff_member || '',
                property_name: task.property_name || '',
                scheduled_date: task.scheduled_date ? task.scheduled_date.split('T')[0] : '',
                estimated_duration: task.estimated_duration ? Number(task.estimated_duration) : 60,
                notes: task.completion_notes || '',
            })
        }
    }, [task, open, reset])

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
        { value: 'in_progress', label: 'En Progreso' },
        { value: 'completed', label: 'Completada' },
        { value: 'cancelled', label: 'Cancelada' },
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
        if (!task) return

        try {
            await updateTask({
                id: task.id,
                data: {
                    title: data.title,
                    description: data.description,
                    task_type: data.task_type as any,
                    priority: data.priority as any,
                    status: data.status as any,
                    staff_member: data.staff_member,
                    property_name: data.property_name,
                    scheduled_date: data.scheduled_date ? `${data.scheduled_date}T09:00:00Z` : undefined,
                    estimated_duration: data.estimated_duration.toString(),
                    completion_notes: data.notes,
                }
            }).unwrap()

            onTaskUpdated()
            onClose()
        } catch (error) {
            console.error('Error updating task:', error)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!task) return null

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
                        {getTaskTypeIcon(task.task_type)} Editar Tarea
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    ID: {task.id}
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
                                                {staff.full_name || staff.first_name || 'Sin nombre'}
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
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Propiedad"
                                        fullWidth
                                        placeholder="Ej: Casa Austin 1"
                                    />
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
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        label="Duración Estimada (minutos)"
                                        fullWidth
                                        inputProps={{ min: 15, max: 480 }}
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

                        {/* Notas */}
                        <Grid item xs={12}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Notas Adicionales"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Información adicional, instrucciones especiales..."
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
                        disabled={isUpdating}
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}