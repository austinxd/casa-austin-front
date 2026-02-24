export interface ClientProfileParams {
    month?: number
    year?: number
}

export interface DistributionItem {
    label: string
    value: string
    count: number
    percentage: number
    avg_spend: number
    total_spend: number
}

export interface AgeDistributionItem {
    range: string
    count: number
    percentage: number
    avg_spend: number
    total_spend: number
}

export interface GuestDistributionItem {
    guests: number
    count: number
    percentage: number
    avg_spend: number
    total_spend: number
}

export interface TopClient {
    rank: number
    client_id: string
    name: string
    document: string
    document_type: string
    sex: string | null
    age: number | null
    total_spent: number
    reservation_count: number
}

export interface IdealProfileSegment {
    label?: string
    range?: string
    guests?: number
    avg_spend: number
}

export interface IdealProfile {
    top_gender: IdealProfileSegment | null
    top_age_range: IdealProfileSegment | null
    top_document_type: IdealProfileSegment | null
    top_origin: IdealProfileSegment | null
    top_guest_count: IdealProfileSegment | null
    description: string
}

export interface ClientProfileData {
    period_info: {
        month: number
        year: number
        month_name: string
    }
    summary: {
        total_clients: number
        total_reservations: number
        total_revenue: number
        avg_spend: number
        avg_nights: number
        avg_guests: number
        new_clients: number
        returning_clients: number
        new_clients_percentage: number
        returning_clients_percentage: number
    }
    gender_distribution: DistributionItem[]
    age_distribution: AgeDistributionItem[]
    document_type_distribution: DistributionItem[]
    origin_distribution: DistributionItem[]
    guest_distribution: GuestDistributionItem[]
    top_clients: TopClient[]
    ideal_profile: IdealProfile
}

export interface ClientProfileResponse {
    success: boolean
    data: ClientProfileData
}
