import { Container, Typography, Box } from '@mui/material'
import CotizadorCenter from '../stats/components/cotizador/CotizadorCenter'

export default function CotizadorPage() {
    return (
        <Container maxWidth={false} sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    💰 Cotizador de Propiedades
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Calcula precios de reserva para las propiedades Casa Austin
                </Typography>
            </Box>
            
            <CotizadorCenter />
        </Container>
    )
}
