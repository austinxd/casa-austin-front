export interface IAdminChatSession {
    id: string
    title: string
    model_used: string
    total_tokens: number
    message_count: number
    created: string
    updated: string
    last_message_preview: {
        content: string
        role: string
        created: string
    } | null
}

export interface IAdminChatMessage {
    id: string
    created: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tool_calls: Array<{
        name: string
        arguments: Record<string, any>
        result_preview: string
    }>
    tokens_used: number
}

export interface IChatResponse {
    response: string
    message: IAdminChatMessage
    session: IAdminChatSession
}
