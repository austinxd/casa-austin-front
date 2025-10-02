export interface Property {
    property_id: string
    property_name: string
    property_slug: string
    base_price_usd: number
    base_price_sol: number
    extra_person_price_per_night_usd: number
    extra_person_price_per_night_sol: number
    extra_person_total_usd: number
    extra_person_total_sol: number
    total_nights: number
    total_guests: number
    extra_guests: number
    subtotal_usd: number
    subtotal_sol: number
    final_price_usd: number
    final_price_sol: number
    available: boolean
    availability_message: string
    additional_services: any[]
    selected_additional_services: any[]
    selected_services_total_usd: number
    selected_services_total_sol: number
    final_price_with_services_usd: number
    final_price_with_services_sol: number
    services_applied_count: number
    cancellation_policy: string | null
    recommendations: string[]
}

export interface PricingData {
    totalCasasDisponibles: number
    check_in_date: string
    check_out_date: string
    guests: number
    total_nights: number
    exchange_rate: number
    properties: Property[]
    general_recommendations: string[]
    message1: string
    message2: string
}

export interface PricingCalculationResponse {
    success: boolean
    error: number
    data: PricingData
    message: string
}

export interface PricingCalculationParams {
    check_in_date: string
    check_out_date: string
    guests: number
    client_id?: string
}

export interface LateCheckoutParams {
    property_id: string
    checkout_date: string
    guests: number
}

export interface LateCheckoutData {
    property_id: string
    property_name: string
    late_checkout_available: boolean
    late_checkout_price_usd: number
    late_checkout_price_sol: number
    message: string
}

export interface LateCheckoutResponse {
    success: boolean
    error: number
    data: LateCheckoutData
    message: string
}
