// Interfaces para estadísticas de Casa Austin

export interface StatsQueryParams {
    period?: 'day' | 'week' | 'month'
    days_back?: number
    include_anonymous?: boolean
    date_from?: string // YYYY-MM-DD
    date_to?: string   // YYYY-MM-DD
}

export interface PeriodInfo {
    period: string
    start_date: string
    end_date: string
    days_analyzed: number
}

export interface SearchByPeriod {
    period: string
    total_searches: number
    client_searches: number
    anonymous_searches: number
}

export interface UserTypeBreakdown {
    client_searches: number
    anonymous_searches: number
}

export interface PropertySearchCount {
    property__name: string
    search_count: number
}

export interface GuestCountPattern {
    guests: number
    count: number
}

export interface CheckinDate {
    weekday: string | null
    search_count: number
}

export interface TopSearchingClient {
    client__first_name: string
    client__last_name: string
    search_count: number
}

export interface SearchAnalytics {
    searches_by_period: SearchByPeriod[]
    user_type_breakdown: UserTypeBreakdown
    unique_anonymous_ips: number
    unique_searching_clients: number
    most_searched_properties: PropertySearchCount[]
    guest_count_patterns: GuestCountPattern[]
    popular_checkin_dates: CheckinDate[]
    top_searching_clients: TopSearchingClient[]
}

export interface ActivityByPeriod {
    period: string
    activity_count: number
}

export interface ActivityByType {
    activity_type: string
    count: number
}

export interface ActiveClient {
    client__first_name: string
    client__last_name: string
    activity_count: number
}

export interface ImportanceBreakdown {
    importance: string
    count: number
}

export interface ActivityAnalytics {
    activities_by_period: ActivityByPeriod[]
    activities_by_type: ActivityByType[]
    most_active_clients: ActiveClient[]
    importance_breakdown: ImportanceBreakdown[]
}

export interface NewClientsByPeriod {
    period: string
    new_clients: number
}

export interface TopClientByPoints {
    first_name: string
    last_name: string
    points_balance: number
}

export interface ClientAnalytics {
    new_clients_by_period: NewClientsByPeriod[]
    total_active_clients: number
    top_clients_by_points: TopClientByPoints[]
}

export interface PropertyMention {
    property_name: string
    mentions: number
}

export interface PropertyAnalytics {
    most_mentioned_properties: PropertyMention[]
}

export interface StatsSummary {
    total_searches: number
    total_activities: number
    unique_searchers: number
    new_clients: number
    top_activity_type: string | null
    most_searched_property: string
}

export interface StatsData {
    period_info: PeriodInfo
    search_analytics: SearchAnalytics
    activity_analytics: ActivityAnalytics
    client_analytics: ClientAnalytics
    property_analytics: PropertyAnalytics
    summary: StatsSummary
}

export interface StatsResponse {
    success: boolean
    stats: StatsData
    generated_at: string
}