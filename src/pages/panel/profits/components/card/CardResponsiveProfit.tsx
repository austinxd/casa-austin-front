import { Box, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'
interface Props {
    first_name: any
    tel_number: string
    number_doc: string
    document_type: string
    check_in_date: string
    price_sol: number
    origin: string
    type_home: string
}

export default function CardResponsiveProfit({
    number_doc,
    check_in_date,
    price_sol,
    first_name,
    tel_number,
    document_type,
    origin,
    type_home,
}: Props) {
    const getTypeDocument = (id: string) => {
        switch (id) {
            case 'dni':
                return 'DNI'
            case 'cex':
                return 'Carnet de Extranjeria'
            case 'pas':
                return 'Pasaporte'
            default:
                return 'Documento: '
        }
    }
    const handlePhoneClick = () => {
        const formattedPhoneNumber = tel_number.replace(/\D/g, '')
        window.open(`https://wa.me/${formattedPhoneNumber}?text=`, '_blank')
    }

    return (
        <div>
            <Box
                display={'flex'}
                width={'100%'}
                position={'relative'}
                flexDirection={'column'}
                border={'1px solid #D1D0D4'}
                borderRadius={'8px'}
                px={'12px'}
                py={'12px'}
            >
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="subtitle1">{first_name}</Typography>
                    <Typography variant="subtitle1">
                        <span style={{ color: '#2F2B3D', opacity: 0.6 }}> Monto: </span> S/.
                        {price_sol}
                    </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} mt={0.5}>
                    <Typography variant="subtitle1" sx={{ color: '#2F2B3D', opacity: 0.9 }}>
                        <span style={{ opacity: 0.7 }}> Check-in:</span>{' '}
                        {check_in_date ? check_in_date : '-'}
                    </Typography>
                    {tel_number && (
                        <Box
                            display={'flex'}
                            sx={{ cursor: 'pointer' }}
                            onClick={handlePhoneClick}
                            alignItems={'center'}
                            gap={0.2}
                        >
                            <LocalPhoneOutlinedIcon fontSize="small" />
                            <WhatsAppIcon fontSize="small" />
                            {/*                         <Typography variant="subtitle1" sx={{ color: '#2F2B3D', opacity: 0.7 }}>
                            {tel_number}
                        </Typography> */}
                        </Box>
                    )}
                </Box>
                <Box
                    display={'flex'}
                    mt={0.5}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <Typography variant="subtitle1" sx={{ color: '#2F2B3D', opacity: 0.9 }}>
                        <span style={{ opacity: 0.7 }}>{getTypeDocument(document_type)}</span>
                        {number_doc}
                    </Typography>
                    {origin === 'air' ? (
                        <Box display={'flex'}>
                            <img
                                src="../airbnb.png"
                                height={20}
                                style={{ borderRadius: '4px', marginRight: '4px' }}
                                width={20}
                            />
                            <Box
                                sx={{
                                    borderRadius: '4px',
                                    marginRight: '4px',
                                    paddingTop: '2px',
                                    border: '1px solid #C6C6C6',
                                    color: '#2F2B3D',
                                    opacity: 0.9,
                                }}
                                height={20}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                width={20}
                                boxShadow="4px 4px 20px rgba(0, 0, 0, 0.2)"
                            >
                                {type_home.replace(/\D/g, '')}
                            </Box>
                        </Box>
                    ) : (
                        <Box display={'flex'}>
                            <HouseRoundedIcon
                                fontSize="small"
                                sx={{
                                    marginRight: 0.5,
                                    color: 'white',
                                    borderRadius: '2px',
                                    p: 0.15,
                                    background: '#2C608D',
                                }}
                            />
                            <Box
                                sx={{
                                    borderRadius: '4px',
                                    marginRight: '4px',
                                    paddingTop: '2px',
                                    border: '1px solid #C6C6C6',
                                    color: '#2F2B3D',
                                    opacity: 0.9,
                                }}
                                height={20}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                width={20}
                                boxShadow="4px 4px 20px rgba(0, 0, 0, 0.3)"
                            >
                                {type_home.replace(/\D/g, '')}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    )
}
