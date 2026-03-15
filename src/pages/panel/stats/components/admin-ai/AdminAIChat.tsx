import { useState, useCallback } from 'react'
import { Box, Paper } from '@mui/material'
import {
    useGetSessionsQuery,
    useCreateSessionMutation,
    useDeleteSessionMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
} from '@/services/admin-ai/adminAiService'
import SessionSidebar from './SessionSidebar'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

export default function AdminAIChat() {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

    // Queries
    const { data: sessions = [], isLoading: sessionsLoading } = useGetSessionsQuery()
    const { data: messages = [], isLoading: messagesLoading } = useGetMessagesQuery(
        selectedSessionId!,
        { skip: !selectedSessionId }
    )

    // Mutations
    const [createSession, { isLoading: isCreating }] = useCreateSessionMutation()
    const [deleteSession] = useDeleteSessionMutation()
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

    const handleCreateSession = useCallback(async () => {
        try {
            const result = await createSession().unwrap()
            setSelectedSessionId(result.id)
        } catch {
            // Error handled by RTK Query
        }
    }, [createSession])

    const handleDeleteSession = useCallback(async (id: string) => {
        try {
            await deleteSession(id).unwrap()
            if (selectedSessionId === id) {
                setSelectedSessionId(null)
            }
        } catch {
            // Error handled by RTK Query
        }
    }, [deleteSession, selectedSessionId])

    const handleSendMessage = useCallback(async (message: string) => {
        if (!selectedSessionId) return
        try {
            await sendMessage({ sessionId: selectedSessionId, message }).unwrap()
        } catch {
            // Error handled by RTK Query
        }
    }, [sendMessage, selectedSessionId])

    return (
        <Paper
            sx={{
                display: 'flex',
                height: 'calc(100vh - 320px)',
                minHeight: 500,
                overflow: 'hidden',
                borderRadius: 2,
            }}
        >
            {/* Sidebar */}
            <SessionSidebar
                sessions={sessions}
                selectedId={selectedSessionId}
                onSelect={setSelectedSessionId}
                onCreate={handleCreateSession}
                onDelete={handleDeleteSession}
                isLoading={sessionsLoading}
                isCreating={isCreating}
            />

            {/* Chat area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                }}
            >
                {selectedSessionId ? (
                    <>
                        <ChatMessages
                            messages={messages}
                            isLoading={messagesLoading}
                            isSending={isSending}
                        />
                        <ChatInput
                            onSend={handleSendMessage}
                            disabled={isSending}
                        />
                    </>
                ) : (
                    <ChatMessages messages={[]} />
                )}
            </Box>
        </Paper>
    )
}
