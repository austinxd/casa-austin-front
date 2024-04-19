import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
interface Props {
    handleEdit: () => void
    handleDelete: (id: string) => void
    first_name: string
    tel_number: string
    number_doc: string
    document_type: string
    email: string
    id: string
}

export default function CardResponsive({
    handleEdit,
    handleDelete,
    number_doc,
    email,
    first_name,
    tel_number,
    document_type,
    id,
}: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
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
                width={'100%'}
                position={'relative'}
                flexDirection={'column'}
                border={'1px solid #D1D0D4'}
                borderRadius={'8px'}
                px={'12px'}
                py={'12px'}
            >
                <Typography variant="subtitle1">{first_name}</Typography>
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="subtitle1" sx={{ color: '#2F2B3D', opacity: 0.7 }}>
                        {email ? email : '-'}
                    </Typography>
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
                </Box>
                <Typography variant="subtitle1" sx={{ color: '#2F2B3D', opacity: 0.7 }}>
                    <span>{getTypeDocument(document_type)}</span> {number_doc}
                </Typography>

                <IconButton
                    id="basic-button"
                    size="small"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{ position: 'absolute', top: 3, right: 1 }}
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
                    <MenuItem onClick={() => handleDelete(id)} sx={{ color: '#FF4C51' }}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    )
}
