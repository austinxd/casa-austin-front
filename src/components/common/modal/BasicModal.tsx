import { Dialog, Zoom } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    open: boolean
}

export default function BasicModal({ children, open }: Props) {
    return (
        <Dialog
            TransitionComponent={Zoom}
            transitionDuration={400}
            sx={{
                '& .MuiDialog-paper': {
                    maxWidth: '684px',
                    width: '100%',
                    background: '#FFFFFF',
                    borderRadius: { md: '20px', sm: '12px', xs: '8px' },
                    paddingY: '20px',
                    paddingX: { xs: '12px', md: '40px' },
                    textAlign: 'center',
                    mx: '4px',
                },
            }}
            open={open}
        >
            {children}
        </Dialog>
    )
}
