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
    period_grouping?: string
    currency?: string
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
    day_number: number
    searches_count: number
    percentage: number
    avg_guests_searched: number
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

export interface AnonymousIpAnalysisItem {
    ip_last_4: string
    search_count: number
    unique_dates: number
    most_searched_property: string
}

export interface AnonymousIpAnalysis {
    top_searching_ips: AnonymousIpAnalysisItem[]
    total_anonymous_ips: number
}

// New interfaces for additional fields
export interface SearchByHour {
    hour: number
    hour_label: string
    period: string
    searches_count: number
    percentage: number
}

export interface DailySearchActivity {
    date: string
    searches_count: number
    unique_users: number
    searches_per_user: number
}

export interface PopularCheckinDate {
    checkin_date: string
    searches_count: number
    unique_searchers: number
    avg_stay_duration: number
}

export interface StayDurationAnalysis {
    duration_days: number
    duration_label: string
    searches_count: number
    percentage: number
    avg_guests: number
}

export interface GuestCountAnalysis {
    guest_count: number
    guest_range: string
    searches_count: number
    percentage: number
    avg_stay_duration: number
}

export interface SearchPerClient {
    client_id: string
    client_name: string
    client_email: string
    searches_count: number
    last_search_date: string
    avg_guests_searched: number
}

export interface SearchTrackingData {
    period_info: PeriodInfo
    search_summary: SearchSummary
    searches_by_weekday: SearchByWeekday[]
    searches_by_hour: SearchByHour[]
    daily_search_activity: DailySearchActivity[]
    popular_checkin_dates: PopularCheckinDate[]
    stay_duration_analysis: StayDurationAnalysis[]
    guest_count_analysis: GuestCountAnalysis[]
    top_searched_properties: TopSearchedProperty[]
    top_searching_clients: TopSearchingClient[]
    searches_per_client: SearchPerClient[]
    anonymous_ips_analysis: AnonymousIpAnalysis
}

export interface SearchTrackingResponse {
    success: boolean
    data: SearchTrackingData
    generated_at: string
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
    period_label: string
    revenue: number
    reservations_count: number
    nights_count: number
    avg_revenue_per_reservation: number
    revenue_per_night: number
}

export interface PaymentDistribution {
    payment_method: string
    reservations_count: number
    total_revenue: number
    percentage: number
}

export interface PriceDistributionItem {
    price_range: string
    reservations_count: number
    percentage: number
}

export interface PriceAnalysis {
    avg_total_cost: number
    min_total_cost: number
    max_total_cost: number
    avg_price_per_night: number
    avg_nights_per_reservation: number
    price_distribution: PriceDistributionItem[]
}

export interface GrowthMetrics {
    revenue_growth_percentage: number
    reservations_growth_percentage: number
    current_period_revenue: number
    previous_period_revenue: number
    current_period_reservations: number
    previous_period_reservations: number
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
    generated_at: string
}

// ========================================
// 3. ENDPOINT: /api/v1/upcoming-checkins/
// ========================================

export interface UpcomingCheckinsParams {
    days_ahead?: number
    limit?: number
    include_anonymous?: boolean
}

export interface SearchingClient {
    client_id: string
    client_name: string
    client_email: string
    checkout_date: string
    guests: number
    property: string | null
}

export interface SearchingIp {
    ip_address: string
    searches_count: number
    checkout_dates: string[]
    guests_counts: number[]
    properties: string[]
}

export interface TopUpcomingCheckin {
    checkin_date: string
    weekday: string
    days_until_checkin: number
    total_searches: number
    client_searches: number
    anonymous_searches: number
    avg_stay_duration: number
    searching_clients: SearchingClient[]
    searching_ips?: SearchingIp[]
}

// SummaryMetrics interface removed as it's not present in the actual API response

export interface UpcomingCheckinsPeriodInfo {
    analysis_from: string
    analysis_to: string
    days_ahead: number
}

export interface UpcomingCheckinsData {
    period_info: UpcomingCheckinsPeriodInfo
    top_upcoming_checkins: TopUpcomingCheckin[]
}

export interface UpcomingCheckinsResponse {
    success: boolean
    data: UpcomingCheckinsData
    generated_at: string
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