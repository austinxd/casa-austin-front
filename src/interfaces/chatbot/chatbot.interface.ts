export interface IChatSession {
    id: string
    wa_id: string
    wa_profile_name: string | null
    client: string | null
    client_name: string | null
    status: 'active' | 'ai_paused' | 'closed' | 'escalated'
    ai_enabled: boolean
    current_intent: string | null
    total_messages: number
    ai_messages: number
    human_messages: number
    last_message_at: string | null
    last_customer_message_at: string | null
    last_message_preview: {
        content: string
        direction: string
        created: string
    } | null
    unread_count: number
    created: string
}

export interface IChatAnalytics {
    id: string
    date: string
    total_sessions: number
    new_sessions: number
    total_messages_in: number
    total_messages_out_ai: number
    total_messages_out_human: number
    escalations: number
    intents_breakdown: Record<string, number>
    total_tokens_input: number
    total_tokens_output: number
    estimated_cost_usd: string
    reservations_created: number
    clients_identified: number
}

export interface IChatSessionsResponse {
    count: number
    next: string | null
    previous: string | null
    results: IChatSession[]
    actual: number
    total_paginas: number
}
