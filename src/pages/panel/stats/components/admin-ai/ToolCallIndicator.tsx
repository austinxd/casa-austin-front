import { Chip, Stack } from '@mui/material'
import { Build as BuildIcon } from '@mui/icons-material'

interface ToolCall {
    name: string
    arguments: Record<string, any>
    result_preview: string
}

const TOOL_LABELS: Record<string, string> = {
    get_revenue_summary: 'Ingresos',
    get_occupancy_rates: 'Ocupación',
    get_reservation_stats: 'Reservas',
    get_pricing_overview: 'Precios',
    get_property_details: 'Propiedades',
    get_financial_projections: 'Proyecciones',
    get_client_analytics: 'Clientes',
    get_chatbot_performance: 'Chatbot',
}

interface Props {
    toolCalls: ToolCall[]
}

export default function ToolCallIndicator({ toolCalls }: Props) {
    if (!toolCalls || toolCalls.length === 0) return null

    return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
            {toolCalls.map((tc, idx) => (
                <Chip
                    key={idx}
                    icon={<BuildIcon sx={{ fontSize: 14 }} />}
                    label={TOOL_LABELS[tc.name] || tc.name}
                    size="small"
                    variant="outlined"
                    sx={{
                        height: 22,
                        fontSize: 11,
                        color: '#666',
                        borderColor: '#ddd',
                    }}
                />
            ))}
        </Stack>
    )
}
