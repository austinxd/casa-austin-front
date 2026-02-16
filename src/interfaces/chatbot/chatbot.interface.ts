export interface IChatSession {
    id: string
    wa_id: string
    wa_profile_name: string | null
    channel: 'whatsapp' | 'instagram' | 'messenger'
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

export interface IChatMessage {
    id: string
    direction: 'inbound' | 'outbound_ai' | 'outbound_human' | 'system'
    message_type: string
    content: string
    wa_status: string | null
    intent_detected: string | null
    ai_model: string | null
    tokens_used: number
    sent_by_name: string | null
    created: string
}

export interface IChatSessionsResponse {
    count: number
    next: string | null
    previous: string | null
    results: IChatSession[]
    actual: number
    total_paginas: number
}

export interface IPropertyVisit {
    id: string
    created: string
    session: string
    property: string
    property_name: string
    client: string | null
    client_name: string | null
    session_wa_profile: string | null
    visit_date: string
    visit_time: string | null
    visitor_name: string
    visitor_phone: string
    guests_count: number
    notes: string
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
}

export interface IPropertyVisitsResponse {
    count: number
    next: string | null
    previous: string | null
    results: IPropertyVisit[]
    actual: number
    total_paginas: number
}

export interface IChatAnalysis {
    analysis: string
    sessions_analyzed: number
    tokens_used?: number
    model?: string
    analysis_prompt?: string
    chatbot_prompt?: string
    conversations_sent?: string
}

export interface IFollowupOpportunity {
    id: string
    wa_id: string
    name: string
    category: 'no_quote' | 'quoted' | 'followed_up'
    status: string
    ai_enabled: boolean
    total_messages: number
    quoted_at: string | null
    followup_count: number
    followup_sent_at: string | null
    last_customer_message_at: string | null
    hours_since_last_message: number | null
    wa_window_remaining_hours: number | null
    last_message_preview: string | null
}

export interface IFollowupResponse {
    no_quote_count: number
    quoted_count: number
    followed_up_count: number
    results: IFollowupOpportunity[]
}
