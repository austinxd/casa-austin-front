import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IRentalClient } from '../../../../interfaces/rental/registerRental'
import AirbnbIcon from '../../../common/icons/AitbnbIcon'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

interface Props {
    handleView: () => void
    handleEdit: () => void
    handleDelete: (e: string) => void
    item: IRentalClient
}

export default function Card({ handleView, handleEdit, handleDelete, item }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const convertDate = (date: string) => {
        const months = [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
        ]
        const dateObj = new Date(`${date}T00:00:00`)
        const day = dateObj.toLocaleString('es-ES', { day: '2-digit' })
        const month = months[dateObj.getMonth()]
        const year = dateObj.getFullYear()

        return `${day} ${month} ${year}`
    }

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
        <div>
            <Box
                display={'flex'}
                width={'100%'}
                position={'relative'}
                justifyContent={'space-between'}
                border={'1px solid #D1D0D4'}
                borderRadius={'8px'}
                sx={{
                    borderLeft: `24px solid ${item.property.background_color}`,
                    pl: '16px',
                    pr: '40px',
                    py: 1.4,
                    '@media (max-width: 1400px)': {
                        flexDirection: 'column',
                        borderLeft: `16px solid ${item.property.background_color}`,
                        pr: '10px',
                        pl: '10px',
                        py: 2,
                        pb: '6px',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Box display={'flex'}>
                        <Typography
                            variant="subtitle1"
                            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}
                        >
                            <span style={{ marginTop: '4px', fontSize: '17px', fontWeight: 600 }}>
                                {item.client.first_name ? item.client.first_name + ' ' : ''}
                                {item.client.last_name ? item.client.last_name : 'Airbnb'}
                            </span>
                            {/*                             <span
                                style={{
                                    fontSize: '13px',
                                    marginTop: '2px',
                                    opacity: 0.7,
                                    lineHeight: '14px',
                                }}
                            >
                                {'Celular: ' + item.client.tel_number}
                            </span> */}
                        </Typography>
                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            gap={1}
                            ml={1.5}
                        >
                            <Box
                                onClick={handleView}
                                sx={{
                                    background: item.origin === 'air' ? '#FF5A5F' : '#0E6191',
                                    borderRadius: '4px',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    p: 0.5,
                                    height: '24px',
                                }}
                            >
                                {item.origin === 'air' ? (
                                    <>
                                        <AirbnbIcon />{' '}
                                        <span style={{ fontSize: '13px' }}> +{item.guests}</span>
                                    </>
                                ) : (
                                    <>
                                        <GroupOutlinedIcon
                                            fontSize={'small'}
                                            sx={{ fontSize: '16px', padding: 0, margin: 0 }}
                                        />
                                        <span style={{ fontSize: '13px', lineHeight: '1px' }}>
                                            +{item.guests}
                                        </span>
                                    </>
                                )}
                            </Box>

                            {item.guests && (
                                <IconButton
                                    sx={{
                                        padding: 0.5,
                                        borderRadius: '4px',
                                        background: '#65D072',
                                        ':hover': { background: '#65D072' },
                                    }}
                                    onClick={handlePhoneClick}
                                >
                                    <WhatsAppIcon
                                        fontSize="small"
                                        sx={{ fontSize: '18px', color: 'white' }}
                                    />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                    <Box
                        display={'flex'}
                        gap={2}
                        mt={4}
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
                            $ {item.origin === 'air' ? ' -' : item.price_usd}
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
                            S./ {item.origin === 'air' ? ' -' : item.price_sol}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    sx={{
                        '@media (max-width: 1400px)': {
                            justifyContent: 'start',
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
                        sx={{
                            '@media (max-width: 1400px)': {
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'end',
                                mt: 2,
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
                                    {convertDate(item.check_in_date)}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    fontSize={12}
                                    sx={{
                                        opacity: 0.7,
                                        fontSize: { md: '14px', sm: '12px', xs: '12px' },
                                    }}
                                >
                                    Fecha de ingreso
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            display={'flex'}
                            mt={{ md: 1, sm: 0, xs: 0 }}
                            justifyContent={'start'}
                            alignItems={'center'}
                        >
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
                                    {convertDate(item.check_out_date)}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    fontSize={12}
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
                    style={{ position: 'absolute', top: 1, right: -3 }}
                >
                    <MoreVertIcon />
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
                    <MenuItem
                        onClick={() => handleDelete('Reyes Sanchez Jesus Alexander')}
                        sx={{ color: '#FF4C51' }}
                    >
                        Eliminar
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    )
}
