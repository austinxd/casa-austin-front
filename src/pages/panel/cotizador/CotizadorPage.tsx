import { Container } from '@mui/material'
import CotizadorCenter from '../stats/components/cotizador/CotizadorCenter'

export default function CotizadorPage() {
    return (
        <Container maxWidth={false} sx={{ py: 3 }}>
            <CotizadorCenter />
        </Container>
    )
}
