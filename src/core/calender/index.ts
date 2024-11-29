import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { hexToRGBA } from '../utils/hex-to-rgba copy'

const CalendarWrappers = styled(Box)<BoxProps>(({ theme }) => {
    return {
        borderRadius: theme.shape.borderRadius,
        scrollBehavior: 'smooth',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: 'auto',
        padding: '0px',
        '& .fc': {
            zIndex: 1,
            '.fc-day-disabled': {
                backgroundColor: '#FBFBFB',
                border: 'none',
            },
            '.fc-day-past': {
                backgroundColor: 'white',
                '.fc-event-main': {
                    opacity: 0.4,
                },
            },
            '.fc-daygrid-day-events': {
                marginBottom: '10px',
            },
            '.fc-col-header, .fc-daygrid-body, .fc-scrollgrid-sync-table, .fc-timegrid-body, .fc-timegrid-body table':
                {
                    maxWidth: '1200px',
                    overflowX: 'hidden',
                    width: '100% !important',
                },
            '& .fc-toolbar': {
                flexWrap: 'wrap',

                flexDirection: 'row !important',
                '&.fc-header-toolbar': {
                    marginBottom: '0px',
                },
                '.fc-button ': {
                    display: 'none',
                },
                '.fc-prev-button, & .fc-next-button': {
                    display: 'none', // eliominar si no quiere que se scroller
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    '& .fc-icon': {
                        color: theme.palette.text.secondary,
                        fontSize: theme.typography.h4.fontSize,
                    },
                    '&:hover, &:active, &:focus': {
                        boxShadow: 'none !important',
                        borderColor: 'transparent !important',
                        backgroundColor: 'transparent !important',
                    },
                },
                '& .fc-prev-button': {
                    paddingLeft: '0 !important',
                    marginRight: theme.spacing(1.5),
                },
                '& .fc-toolbar-chunk:first-of-type': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    [theme.breakpoints.down('md')]: {
                        '& div:first-of-type': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                    },
                },
                '& .fc-button': {
                    padding: theme.spacing(),
                    '&:active, .&:focus': {
                        boxShadow: 'none',
                    },
                },
                '& .fc-button-group': {
                    '& .fc-button': {
                        textTransform: 'capitalize',
                        '&:focus': {
                            boxShadow: 'none',
                        },
                    },
                    '& .fc-button-primary': {
                        '&:not(.fc-prev-button):not(.fc-next-button):not(.fc-sidebarToggle-button)':
                            {
                                border: 0,
                                color: theme.palette.primary.main,
                                padding: theme.spacing(1.94, 5.08),
                                backgroundColor: hexToRGBA(theme.palette.primary.main, 0.16),
                                '&.fc-button-active, &:hover': {
                                    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.24),
                                },
                            },
                    },
                    '& .fc-sidebarToggle-button': {
                        border: 0,
                        lineHeight: 0.8,
                        borderColor: 'transparent',
                        paddingBottom: '0 !important',
                        backgroundColor: 'transparent',
                        color: theme.palette.text.secondary,
                        marginLeft: `${theme.spacing(-2)} !important`,
                        padding: `${theme.spacing(1.275, 2)} !important`,
                        '&:focus': {
                            outline: 0,
                            boxShadow: 'none',
                        },
                        '&:not(.fc-prev-button):not(.fc-next-button):hover': {
                            backgroundColor: 'transparent !important',
                        },
                        '& + div': {
                            marginLeft: 0,
                        },
                    },
                    '.fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button, & .fc-listMonth-button':
                        {
                            padding: theme.spacing(2.2, 6),

                            '&:last-of-type, &:first-of-type': {
                                borderRadius: theme.shape.borderRadius,
                            },
                            '&:first-of-type': {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            },
                            '&:last-of-type': {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            },
                        },
                },
                '& > * > :not(:first-of-type)': {
                    marginLeft: 0,
                },
                '& .fc-toolbar-title': {
                    ...theme.typography.h5,
                    color: '#0E6191',
                    marginTop: '20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                },
                '.fc-button:empty:not(.fc-sidebarToggle-button), & .fc-toolbar-chunk:empty': {
                    display: 'none',
                },
            },
            '& .fc-event': {
                '&:first-of-type': {
                    marginLeft: '20px',
                },
                '&:last-child': {
                    marginRight: '-12px',
                },
            },
            '& tbody td, & thead th': {
                borderColor: theme.palette.divider,

                '&.fc-col-header-cell': {
                    borderLeft: 0,
                    display: 'none',
                },
                '&[role="presentation"]': {
                    borderRightWidth: 0,
                },
            },
            '& .fc-scrollgrid': {
                border: '1px solid red',
                borderColor: theme.palette.divider,
                margin: 'auto',
            },

            '& .fc-daygrid-event-harness': {
                '& .fc-event': {
                    marginTop: 2,
                    fontWeight: 400,
                    marginBottom: 0,
                    borderRadius: '12px',
                    padding: 0,
                },
                /*             '&:not(:last-of-type)': {
                    marginRight: theme.spacing(-1.5),
                    marginLeft: theme.spacing(2),
                }, */
            },
            '& .fc-daygrid-day-number': {
                margin: 'auto',
                marginTop: '4px',
            },
            '& .fc-daygrid-day-number, & .fc-timegrid-slot-label-cushion, & .fc-list-event-time': {
                color: '#A1A5B7',
                fontWeight: 600,
                marginTop: '2px',
            },
            '& .fc-day-today:not(.fc-popover):not(.fc-col-header-cell)': {
                backgroundColor: 'white',
                padding: '0px',
            },
            '& .fc-day-today .fc-daygrid-day-frame': {
                border: '1px solid #0E6191',
                minHeigth: '80%',
                paddingTop: '0px',
                textAlign: 'center',
                margin: 'auto',
            },
            '@media (max-width:800px)': {
                '.fc-daygrid-day-events': {
                    marginBottom: '3px',
                },
                '& .fc-daygrid-day-number': {
                    marginTop: '0px',
                    fontSize: '12px',
                    padding: '0px',
                    fontWeight: 400,
                },
                '& .fc-toolbar-title': {
                    color: '#0E6191',
                    marginTop: '12px',
                    fontSize: '13px',
                },
                '& .fc-daygrid-event-harness': {
                    '& .fc-event': {
                        marginTop: 0.5,
                        fontWeight: 400,
                        marginBottom: 0,
                        borderRadius: '8px',
                        padding: 0,
                        fontSize: theme.typography.body2.fontSize,
                    },
                },
            },
        },
    }
})

export default CalendarWrappers
