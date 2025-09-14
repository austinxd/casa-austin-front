// Shared API response interface to avoid duplication across services
export interface ApiResponse<T> {
    data: T
    count: number
    next: string | null
    previous: string | null
}

// Interface for paginated responses that match real API format
export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
    actual: number
    total_paginas: number
}