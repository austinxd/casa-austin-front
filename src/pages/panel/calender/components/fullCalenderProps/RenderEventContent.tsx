import { Box, Typography, useTheme } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

export default function RenderEventContent({ eventInfo }: any) {
    const { palette } = useTheme()
    if (eventInfo.isStart) {
        return (
            <Box
                borderRadius={'16px'}
                padding={{ md: '1px', sm: '1px', xs: '0px' }}
                display={'flex'}
                alignItems={'center'}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: { md: '12px', sm: '6px', xs: '6px' },
                    }}
                >
                    {eventInfo.event.extendedProps.type === 'aus' ||
                    eventInfo.event.extendedProps.type === 'man' ? (
                        <Box
                            sx={{
                                height: { md: '16px', sm: '6px', xs: '6px' },
                                width: { md: '16px', sm: '6px', xs: '6px' },
                                paddingTop: '2px',
                                background: 'white',
                                fontWeight: 600,
                                color: '#0E6191',
                                borderRadius: '100%',
                                fontSize: { md: '12px', sm: '4.5px', xs: '4.5px' },
                                marginRight: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {eventInfo.event.extendedProps.image.match(/\d+/)}
                        </Box>
                    ) : (
                        <img
                            src={eventInfo.event.extendedProps.image}
                            alt="Event Image"
                            className="imgCalender"
                        />
                    )}
                </Box>
                <Box display={{ md: 'flex', sm: 'none', xs: 'none' }} alignItems={'center'}>
                    <Typography
                        sx={{
                            color: 'white',
                            fontSize: { md: '12px', sm: '10px', xs: '10px' },
                        }}
                        style={{ width: '90%', padding: 0, margin: 0.5 }}
                    >
                        {eventInfo.event.title}
                    </Typography>{' '}
                </Box>

                {eventInfo.event.extendedProps.lateCheckout && (
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        sx={{
                            marginLeft: 'auto',
                        }}
                    >
                        <ExitToAppIcon
                            sx={{
                                color: palette.background.default,
                                fontSize: { md: '16px', sm: '6px', xs: '6px' },
                                marginRight: '2px',
                            }}
                        />
                    </Box>
                )}
            </Box>
        )
    } else {
        return (
            <Box
                borderRadius={'16px'}
                padding={{ md: '2px', sm: '1px', xs: '0px' }}
                display={'flex'}
                alignItems={'center'}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: { md: '17px', sm: '1px', xs: '6px' },
                        width: '100%',
                    }}
                >
                    {eventInfo.event.extendedProps.lateCheckout && (
                        <Box
                            display={'flex'}
                            sx={{
                                marginLeft: 'auto',
                            }}
                        >
                            <ExitToAppIcon
                                sx={{
                                    color: palette.background.default,
                                    fontSize: { md: '16px', sm: '6px', xs: '6px' },
                                    marginRight: '2px',
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        )
    }
}
