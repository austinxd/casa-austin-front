// Shared API response interface to avoid duplication across services
export interface ApiResponse<T> {
    data: T
    count: number
    next: string | null
    previous: string | null
}