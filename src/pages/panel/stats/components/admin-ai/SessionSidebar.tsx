import {
    Box,
    List,
    ListItemButton,
    ListItemText,
    Button,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material'
import { IAdminChatSession } from '@/interfaces/admin-ai.interface'

function formatTimeAgo(dateStr: string): string {
    const now = new Date()
    const d = new Date(dateStr)
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'ahora'
    if (diffMin < 60) return `${diffMin}m`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `${diffHrs}h`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays}d`
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
}

interface Props {
    sessions: IAdminChatSession[]
    selectedId: string | null
    onSelect: (id: string) => void
    onCreate: () => void
    onDelete: (id: string) => void
    isLoading?: boolean
    isCreating?: boolean
}

export default function SessionSidebar({
    sessions,
    selectedId,
    onSelect,
    onCreate,
    onDelete,
    isLoading,
    isCreating,
}: Props) {
    return (
        <Box
            sx={{
                width: 280,
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fafafa',
            }}
        >
            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={isCreating ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                    onClick={onCreate}
                    disabled={isCreating}
                    sx={{
                        backgroundColor: '#0E6191',
                        '&:hover': { backgroundColor: '#0a4d73' },
                        textTransform: 'none',
                    }}
                >
                    Nueva conversaci&oacute;n
                </Button>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : sessions.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 3, px: 2 }}
                    >
                        No hay conversaciones a&uacute;n
                    </Typography>
                ) : (
                    <List disablePadding>
                        {sessions.map((session) => (
                            <ListItemButton
                                key={session.id}
                                selected={session.id === selectedId}
                                onClick={() => onSelect(session.id)}
                                sx={{
                                    py: 1,
                                    px: 1.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&.Mui-selected': { backgroundColor: '#E3F2FD' },
                                }}
                            >
                                <ListItemText
                                    primary={session.title}
                                    secondary={formatTimeAgo(session.updated)}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        fontWeight: session.id === selectedId ? 600 : 400,
                                        noWrap: true,
                                        sx: { fontSize: 13 },
                                    }}
                                    secondaryTypographyProps={{
                                        variant: 'caption',
                                        sx: { fontSize: 11 },
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(session.id)
                                    }}
                                    sx={{
                                        opacity: 0.4,
                                        '&:hover': { opacity: 1, color: '#d32f2f' },
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    )
}
