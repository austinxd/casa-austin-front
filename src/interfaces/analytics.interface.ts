// Interfaces para los nuevos endpoints de Analytics Casa Austin

// ========================================
// 1. ENDPOINT: /api/v1/stats/search-tracking/
// ========================================

export interface SearchTrackingParams {
    date_from?: string // YYYY-MM-DD
    date_to?: string   // YYYY-MM-DD
    include_clients?: boolean
    include_anonymous?: boolean
}

export interface PeriodInfo {
    date_from: string
    date_to: string
    total_days: number
}

export interface SearchSummary {
    total_searches: number
    unique_clients_searching: number
    anonymous_searches: number
    conversion_rate: number
    avg_searches_per_day: number
}

export interface SearchByWeekday {
    weekday: string
    searches_count: number
    percentage: number
}

export interface TopSearchedProperty {
    property_name: string
    search_count: number
    percentage: number
}

export interface TopSearchingClient {
    client_name: string
    client_email: string
    search_count: number
    last_search_date: string
}

export interface AnonymousIpAnalysis {
    ip_last_4: string
    search_count: number
    unique_dates: number
    most_searched_property: string
}

export interface SearchTrackingData {
    period_info: PeriodInfo
    search_summary: SearchSummary
    searches_by_weekday: SearchByWeekday[]
    top_searched_properties: TopSearchedProperty[]
    top_searching_clients: TopSearchingClient[]
    anonymous_ips_analysis: AnonymousIpAnalysis[]
}

export interface SearchTrackingResponse {
    success: boolean
    data: SearchTrackingData
}

// ========================================
// 2. ENDPOINT: /api/v1/stats/ingresos/
// ========================================

export interface IngresosParams {
    date_from?: string // YYYY-MM-DD
    date_to?: string   // YYYY-MM-DD
    period?: 'day' | 'week' | 'month'
    currency?: 'PEN' | 'USD'
}

export interface RevenueSummary {
    total_revenue: number
    total_nights: number
    total_reservations: number
    avg_revenue_per_reservation: number
    revenue_per_night: number
    avg_revenue_per_day: number
}

export interface RevenueByPeriod {
    period: string
    revenue: number
    nights: number
    reservations: number
}

export interface PaymentDistribution {
    payment_method: string
    amount: number
    percentage: number
    count: number
}

export interface PriceAnalysis {
    min_price: number
    max_price: number
    avg_price: number
    median_price: number
    price_ranges: {
        range: string
        count: number
        percentage: number
    }[]
}

export interface GrowthMetrics {
    revenue_growth: number
    reservations_growth: number
    avg_price_growth: number
    comparison_period: string
}

export interface IngresosData {
    period_info: PeriodInfo
    revenue_summary: RevenueSummary
    revenue_by_period: RevenueByPeriod[]
    payment_distribution: PaymentDistribution[]
    price_analysis: PriceAnalysis
    growth_metrics: GrowthMetrics
}

export interface IngresosResponse {
    success: boolean
    data: IngresosData
}

// ========================================
// 3. ENDPOINT: /api/v1/upcoming-checkins/
// ========================================

export interface UpcomingCheckinsParams {
    days_ahead?: number
    limit?: number
    include_anonymous?: boolean
}

export interface TopUpcomingCheckin {
    checkin_date: string
    searches_count: number
    unique_searchers: number
    most_searched_property: string
    popularity_score: number
}

export interface SummaryMetrics {
    total_upcoming_dates: number
    avg_searches_per_date: number
    most_popular_checkin: string
    peak_demand_day: string
}

export interface UpcomingCheckinsData {
    period_info: {
        date_from: string
        date_to: string
        days_ahead: number
    }
    top_upcoming_checkins: TopUpcomingCheckin[]
    summary_metrics: SummaryMetrics
}

export interface UpcomingCheckinsResponse {
    success: boolean
    data: UpcomingCheckinsData
}

// ========================================
// INTERFACES COMUNES
// ========================================

export interface DateRange {
    date_from: string
    date_to: string
}

export interface FilterPreset {
    label: string
    days: number
    value: string
}

export interface GlobalFilters {
    dateRange: DateRange
    preset: string
    includeClients: boolean
    includeAnonymous: boolean
    period: 'day' | 'week' | 'month'
    currency: 'PEN' | 'USD'
    limit: number
    daysAhead: number
}