import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import CommentIcon from '@mui/icons-material/Comment'
import { useBoxShadow } from '@/core/utils'
interface Props {
    handleEdit: () => void
    handleComment: () => void
    handleDelete: (id: string) => void
    handleAdjustPoints: () => void
    first_name: string
    tel_number: string
    number_doc: string
    document_type: string
    email: string
    comment: string
    id: string
    level_icon?: string
    points_balance: string
}

export default function CardResponsive({
    handleEdit,
    handleComment,
    comment,
    handleDelete,
    handleAdjustPoints,
    number_doc,
    email,
    first_name,
    tel_number,
    document_type,
    id,
    level_icon,
    points_balance,
}: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const { palette } = useTheme()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const getTypeDocument = (id: string) => {
        switch (id) {
            case 'dni':
                return 'DNI'
            case 'cex':
                return 'Carnet de Extranjeria'
            case 'pas':
                return 'Pasaporte'
            case 'ruc':
                return 'RUC'
            default:
                return id
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
                sx={{
                    p: 2,
                    background: palette.primary.contrastText,
                    boxShadow: useBoxShadow(true),
                    borderRadius: 2,
                }}
                position={'relative'}
                flexDirection={'column'}
            >
                <Box display={'flex'} alignItems={'center'} gap={0.5} mb={0.5}>
                    {level_icon && (
                        <Typography fontSize="1.2rem">{level_icon}</Typography>
                    )}
                    <Typography fontWeight={600} fontSize={15}>
                        {first_name}
                    </Typography>
                    {comment && (
                        <IconButton onClick={handleComment} sx={{ p: 0.5 }}>
                            <CommentIcon sx={{ color: 'gray', opacity: 0.6, fontSize: '17px' }} />
                        </IconButton>
                    )}
                </Box>
                <Typography variant="caption" color="text.secondary" mb={1}>
                    Puntos: {parseFloat(points_balance || '0').toFixed(2)}
                </Typography>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                        <strong>{getTypeDocument(document_type)}: </strong> {number_doc}{' '}
                    </Typography>
                    <Box
                        display={'flex'}
                        sx={{ cursor: 'pointer' }}
                        onClick={handlePhoneClick}
                        alignItems={'center'}
                        gap={0.2}
                    >
                        <LocalPhoneOutlinedIcon
                            sx={{ fontSize: '20px', color: palette.primary.main, opacity: 0.6 }}
                        />
                        <WhatsAppIcon sx={{ fontSize: '20px', color: '#65D072' }} />
                    </Box>
                </Box>

                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                    {email ? (
                        <>
                            <strong>Correo: </strong> {email}
                        </>
                    ) : (
                        ''
                    )}
                </Typography>

                <IconButton
                    id="basic-button"
                    size="small"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{ position: 'absolute', top: 5, right: 3 }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{ paper: { style: { padding: '4px 8px' } } }}
                >
                    <MenuItem onClick={handleEdit} sx={{ color: '#000F08' }}>
                        Editar
                    </MenuItem>
                    <MenuItem onClick={handleAdjustPoints} sx={{ color: '#000F08' }}>
                        Puntos
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(id)} sx={{ color: '#FF4C51' }}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    )
}
