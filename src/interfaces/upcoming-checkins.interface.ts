// Interfaces para el endpoint /api/v1/upcoming-checkins/

export interface UpcomingCheckinsQueryParams {
    days_ahead?: number
    limit?: number
    include_anonymous?: boolean
}

export interface PeriodInfo {
    analysis_from: string // "2025-09-21"
    analysis_to: string   // "2025-11-20"
    days_ahead: number    // 60
}

export interface SearchingClient {
    client_id: number
    client_name: string      // "María L." (enmascarado)
    client_email: string     // "mar***@gmail.com"
    checkout_date: string    // "2025-10-18"
    guests: number           // 4
    property: string         // "Casa Principal"
}

export interface SearchingIp {
    ip_address: string       // "192.168.1.xxx"
    searches_count: number   // 3 búsquedas
    checkout_dates: string[] // ["2025-10-18", "2025-10-20"]
    guests_counts: number[]  // [2, 4] huéspedes buscados
    properties: string[]     // ["Casa A", "Casa B"]
}

export interface UpcomingCheckin {
    checkin_date: string           // "2025-10-15"
    weekday: string               // "Wednesday"
    days_until_checkin: number    // 24
    total_searches: number        // 8
    client_searches: number       // 3 (registrados)
    anonymous_searches: number    // 5 (anónimos)
    avg_stay_duration: number     // 3.5 días promedio
    unique_clients_count: number  // Clientes únicos
    unique_ips_count: number      // IPs únicas
    searching_clients: SearchingClient[]
    searching_ips: SearchingIp[]
}

export interface SummaryMetrics {
    total_upcoming_searches: number      // 45
    unique_dates_searched: number        // 12
    unique_clients_searching: number     // 8
    unique_anonymous_ips: number         // 15
    avg_searches_per_date: number        // 3.75
}

export interface UpcomingCheckinsResponse {
    success: boolean
    period_info: PeriodInfo
    top_upcoming_checkins: UpcomingCheckin[]
    summary_metrics: SummaryMetrics
    generated_at: string
}

// Interfaces adicionales para análisis
export interface HighDemandDate {
    date: string
    searches: number
    potential_clients: number
    anonymous_interest: number
}

export interface RepeatedSearchClient {
    client_id: number
    client_name: string
    search_count: number
    dates_searched: string[]
}

export interface WeekdayPreference {
    weekday: string
    total_searches: number
    percentage: number
}