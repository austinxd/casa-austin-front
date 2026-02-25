import {
    Box,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    useTheme,
} from '@mui/material'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { IRentalClient } from '@/interfaces/rental/registerRental'
import { StatusIcon } from '@/components/common'
import ConverDate from '@/core/utils/converDate'
import { useBoxShadow } from '@/core/utils'
import OriginBadge from '../common/OriginBadge'

interface Props {
    isLoadingContract: boolean
    isLoadingSignedContract: boolean
    handleView: () => void
    handleEdit: () => void
    handleContract: () => void
    handleSignedContract: () => void
    handleDelete: (e: string) => void
    item: IRentalClient
}

export default function Card({
    isLoadingContract,
    isLoadingSignedContract: _isLoadingSignedContract,
    handleContract,
    handleSignedContract: _handleSignedContract,
    handleView,
    handleEdit,
    handleDelete,
    item,
}: Props) {
    const { palette } = useTheme()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handlePhoneClick = () => {
        const formattedPhoneNumber = item.client.tel_number.replace(/\D/g, '')
        window.open(`https://wa.me/${formattedPhoneNumber}?text=`, '_blank')
    }
    return (
        <Box
            display={'flex'}
            position={'relative'}
            justifyContent={'space-between'}
            sx={{
                borderRadius: 2,
                background: palette.primary.contrastText,
                boxShadow: useBoxShadow(true),
                /*   border: `8px solid ${item.property.background_color}`, */
                pl: '16px',
                pr: '40px',
                pt: 5,
                pb: 3,
                '@media (max-width: 1400px)': {
                    flexDirection: 'column',
                    pr: '12px',
                },
                position: 'relative',
            }}
        >
            <Box sx={{ position: 'absolute', top: 0, left: 0, display: 'flex' }}>
                <Box
                    sx={{
                        background: item.property.background_color,
                        borderRadius: 2,
                        borderBottomRightRadius: item.late_checkout ? 0 : 8,
                        borderBottomLeftRadius: 0,
                        borderTopRightRadius: 0,
                        px: 1.5,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <StatusIcon size={17} status={item.status} />
                    <Typography sx={{ color: 'white' }}> {item.property.name}</Typography>
                    <Box
                        height={'25px'}
                        width={'1px'}
                        sx={{ ml: 0.8, background: palette.divider }}
                    />
                    <OriginBadge origin={item.origin} guests={item.guests} onClick={handleView} />
                </Box>
                {item.late_checkout && (
                    <>
                        <Box
                            height={'25px'}
                            width={'1px'}
                            sx={{ ml: -0.3, background: palette.divider }}
                        />
                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            sx={{
                                p: 1,
                                background: '#656565',
                                borderRadius: 2,
                                borderTopRightRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderTopLeftRadius: 0,
                            }}
                            height={33}
                            width={35}
                        >
                            <ExitToAppIcon
                                sx={{
                                    color: 'white',
                                    fontSize: '22px',
                                }}
                            />
                        </Box>
                    </>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Box display={'flex'}>
                    <Box>
                        <Typography
                            style={{ marginTop: '4px', fontSize: '17.3px', fontWeight: 600 }}
                        >
                            {item?.client?.first_name.length > 20
                                ? `${item.client.first_name.slice(0, 20)}...`
                                : item.client.first_name}
                        </Typography>
                        <Typography lineHeight={1}>
                            {item.origin === 'man' ? '' : item.client.last_name}
                        </Typography>
                    </Box>

                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        gap={1}
                        ml={1.5}
                        mb={0.5}
                    >
                        {item.client.tel_number && (
                            <IconButton
                                sx={{
                                    padding: 0.5,
                                    borderRadius: '4px',
                                    mb: 0.5,
                                }}
                                onClick={handlePhoneClick}
                            >
                                <WhatsAppIcon
                                    fontSize="small"
                                    sx={{ fontSize: '20px', color: '#65D072' }}
                                />
                            </IconButton>
                        )}
                    </Box>
                </Box>
                {item.origin === 'man' ? (
                    <Box
                        sx={{
                            background: palette.divider,
                            py: 1,
                            my: 0.65,
                            px: 1.2,
                            borderRadius: 2,
                            borderTopRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            width: 'fit-content',
                        }}
                    >
                        <Typography variant="body1">
                            {`${item.property.name}`} en mantenimiento
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        display={'flex'}
                        gap={2}
                        mt={2.5}
                        sx={{
                            '@media (max-width: 1400px)': {
                                mt: 1.5,
                            },
                        }}
                    >
                        <Typography
                            fontSize={13}
                            sx={{
                                background: '#F2F2F2',
                                color: '#0E6191',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '4px',
                                fontWeight: 400,
                            }}
                        >
                            $ {item.price_usd}
                        </Typography>
                        <Typography
                            fontSize={13}
                            sx={{
                                background: '#F2F2F2',
                                color: '#7367F0',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '4px',
                                fontWeight: 400,
                            }}
                        >
                            S./ {item.price_sol}
                        </Typography>
                        {item.full_payment ? (
                            <Typography
                                fontSize={13}
                                sx={{
                                    background: '#F2F2F2',
                                    color: 'red',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '4px',
                                    fontWeight: 400,
                                }}
                            >
                                S./ 0
                            </Typography>
                        ) : (
                            <Typography
                                fontSize={13}
                                sx={{
                                    background: '#F2F2F2',
                                    color: 'red',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '4px',
                                    fontWeight: 400,
                                }}
                            >
                                S./ {item.resta_pagar}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>

            <Box
                display={'flex'}
                sx={{
                    '@media (max-width: 1400px)': {
                        justifyContent: 'start',
                        mt: 1.5,
                    },
                }}
            >
                <Box
                    sx={{
                        height: '90px',
                        width: '1px',
                        mr: 2,
                        background: '#ECECEC',
                        my: 'auto',
                        '@media (max-width: 1400px)': {
                            display: 'none',
                        },
                    }}
                ></Box>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={3}
                    sx={{
                        '@media (max-width: 1400px)': {
                            flexDirection: 'row',
                        },
                    }}
                >
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Box
                            sx={{
                                background: '#F2F2F2',
                                borderRadius: '6px',
                                p: 0.6,
                                height: 36,
                                mr: { md: 2, xs: 0.5 },
                            }}
                        >
                            <DateRangeOutlinedIcon sx={{ color: '#C3C3C3' }} />
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant="subtitle1">
                                {ConverDate(item.check_in_date)}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                lineHeight={0.5}
                                sx={{
                                    opacity: 0.7,
                                    fontSize: { md: '14px', sm: '12px', xs: '12px' },
                                }}
                            >
                                Fecha de ingreso
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
                        <Box
                            sx={{
                                background: '#F2F2F2',
                                borderRadius: '6px',
                                p: 0.6,
                                height: 36,
                                mr: { md: 2, xs: 0.5 },
                            }}
                        >
                            <DateRangeOutlinedIcon sx={{ color: '#C3C3C3' }} />
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant="subtitle1">
                                {item.late_checkout
                                    ? ConverDate(item.late_check_out_date)
                                    : ConverDate(item.check_out_date)}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                lineHeight={0.5}
                                sx={{
                                    opacity: 0.7,
                                    fontSize: { md: '14px', sm: '12px', xs: '12px' },
                                }}
                            >
                                Fecha de salida
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <IconButton
                id="basic-button"
                size="small"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{ position: 'absolute', top: 6, right: 3 }}
            >
                <MoreVertIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{ paper: { style: { padding: '4px 8px' } } }}
            >
                <MenuItem onClick={handleView} sx={{ color: '#000F08' }}>
                    Ver
                </MenuItem>
                <MenuItem onClick={handleEdit} sx={{ color: '#000F08' }}>
                    Editar
                </MenuItem>
                <MenuItem onClick={handleContract} sx={{ color: '#000F08' }}>
                    {isLoadingContract ? (
                        <CircularProgress size={24} sx={{ mx: 'auto' }} />
                    ) : (
                        'Contrato'
                    )}
                </MenuItem>
                {/* TODO: Contrato Firmado - temporalmente oculto */}
                <MenuItem
                    onClick={() => handleDelete('Reyes Sanchez Jesus Alexander')}
                    sx={{ color: '#FF4C51' }}
                >
                    Eliminar
                </MenuItem>
            </Menu>
        </Box>
    )
}
