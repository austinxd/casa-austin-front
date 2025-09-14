export interface StaffMember {
    id: string
    full_name: string
    first_name: string
    last_name: string
    phone: string
    email: string
    staff_type: 'cleaner' | 'maintenance' | 'supervisor' | 'admin'
    status: 'active' | 'inactive' | 'on_leave'
    photo?: string
    hire_date: string
    daily_rate: number
    can_work_weekends: boolean
    max_properties_per_day: number
    tasks_today: number
}

export interface WorkTask {
    id: string
    staff_member: string
    staff_member_name: string
    building_property: string
    property_name: string
    reservation?: string
    task_type: 'checkout_cleaning' | 'maintenance' | 'inspection' | 'checkin_preparation'
    title: string
    description: string
    scheduled_date: string
    estimated_duration: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
    actual_start_time?: string
    actual_end_time?: string
    actual_duration_display?: string
    requires_photo_evidence: boolean
    completion_notes?: string
    supervisor_approved: boolean
    photos: TaskPhoto[]
}

export interface TaskPhoto {
    id: string
    photo: string
    description?: string
    uploaded_at: string
}

export interface TimeTracking {
    id: string
    staff_member: string
    staff_member_name: string
    building_property: string
    property_name: string
    work_task?: string
    action_type: 'check_in' | 'check_out' | 'break_start' | 'break_end'
    timestamp: string
    latitude?: number
    longitude?: number
    location_verified: boolean
    photo?: string
    notes?: string
}

export interface Schedule {
    id: string
    staff_member: string
    staff_member_name: string
    building_property: string
    property_name: string
    scheduled_date: string
    start_time: string
    end_time: string
    task_type: string
    notes?: string
}

export interface StaffDashboard {
    total_staff: number
    active_staff: number
    tasks_today: number
    completed_tasks: number
    pending_tasks: number
    staff_on_leave: number
}

export interface PropertySummary {
    building_property: string
    property_name: string
    pending_tasks: number
    completed_tasks: number
    total_tasks: number
    assigned_staff: string[]
}

// Query parameters interfaces
export interface StaffQueryParams {
    page?: number
    page_size?: number
    search?: string
    staff_type?: string
    status?: string
}

export interface TaskQueryParams {
    page?: number
    page_size?: number
    search?: string
    staff_member?: string
    building_property?: string
    status?: string
    task_type?: string
    scheduled_date?: string
}

export interface TimeTrackingQueryParams {
    page?: number
    page_size?: number
    staff_member?: string
    start_date?: string
    end_date?: string
    action_type?: string
}

export interface ScheduleQueryParams {
    page?: number
    page_size?: number
    staff_member?: string
    building_property?: string
    month?: number
    year?: number
}

// Form data interfaces
export interface CreateStaffRequest {
    first_name: string
    last_name: string
    phone: string
    email: string
    staff_type: 'cleaner' | 'maintenance' | 'supervisor' | 'admin'
    daily_rate: number
    can_work_weekends: boolean
    max_properties_per_day: number
    photo?: File
}

export interface CreateTaskRequest {
    staff_member: string
    building_property: string
    reservation?: string
    task_type: 'checkout_cleaning' | 'maintenance' | 'inspection' | 'checkin_preparation'
    title: string
    description: string
    scheduled_date: string
    estimated_duration: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    requires_photo_evidence: boolean
}

export interface StartWorkRequest {
    latitude?: number
    longitude?: number
    notes?: string
}

export interface CompleteWorkRequest {
    latitude?: number
    longitude?: number
    completion_notes?: string
    photos?: File[]
}

export interface CreateTimeTrackingRequest {
    staff_member: string
    building_property: string
    work_task?: string
    action_type: 'check_in' | 'check_out' | 'break_start' | 'break_end'
    latitude?: number
    longitude?: number
    notes?: string
    photo?: File
}

export interface CreateScheduleRequest {
    staff_member: string
    building_property: string
    scheduled_date: string
    start_time: string
    end_time: string
    task_type: string
    notes?: string
}