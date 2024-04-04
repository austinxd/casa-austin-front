import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

import useBgColor, { UseBgColorType } from '../../hook/useBgColor'
import { hexToRGBA } from '../utils/hex-to-rgba'

const CalendarWrapper = styled(Box)<BoxProps>(({ theme }) => {
    const bgColors: UseBgColorType = useBgColor()

    return {
        borderRadius: theme.shape.borderRadius,
        scrollBehavior: 'smooth',
        overflowY: 'hidden',
        overflowX: 'hidden',
        minHeight: '100%',
        width: 'auto',
        padding: '0px',
        '& .fc': {
            zIndex: 1,
            '& .fc-daygrid-body-unbalanced .fc-daygrid-day-events': {
                maxHeight: '30px',
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
                    display: 'inline-block',
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
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                },
                '.fc-button:empty:not(.fc-sidebarToggle-button), & .fc-toolbar-chunk:empty': {
                    display: 'none',
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

            '& .fc-event': {
                '&:not(.fc-list-event)': {
                    '&.bg-primary': {
                        borderColor: 'transparent',
                        color: theme.palette.primary.main,
                        backgroundColor: bgColors.primaryLight.backgroundColor,
                        '& .fc-event-title, & .fc-event-time': {
                            color: theme.palette.primary.main,
                        },
                    },
                    '&.bg-success': {
                        borderColor: 'transparent',
                        color: theme.palette.success.main,
                        backgroundColor: bgColors.successLight.backgroundColor,
                        '& .fc-event-title, & .fc-event-time': {
                            color: theme.palette.success.main,
                        },
                    },
                    '&.bg-error': {
                        borderColor: 'transparent',
                        color: theme.palette.error.main,
                        backgroundColor: bgColors.errorLight.backgroundColor,
                        '& .fc-event-title, & .fc-event-time': {
                            color: theme.palette.error.main,
                        },
                    },
                    '&.bg-warning': {
                        borderColor: 'transparent',
                        color: theme.palette.warning.main,
                        backgroundColor: bgColors.warningLight.backgroundColor,
                        '& .fc-event-title, & .fc-event-time': {
                            color: theme.palette.warning.main,
                        },
                    },
                    '&.bg-info': {
                        borderColor: 'transparent',
                        color: theme.palette.info.main,
                        backgroundColor: bgColors.infoLight.backgroundColor,
                        '& .fc-event-title, & .fc-event-time': {
                            color: theme.palette.info.main,
                        },
                    },
                },
                '&.bg-primary': {
                    '& .fc-list-event-dot': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main,
                    },
                    '&:hover td': {
                        backgroundColor: hexToRGBA(theme.palette.primary.light, 0.1),
                    },
                },
                '&.bg-success': {
                    '& .fc-list-event-dot': {
                        borderColor: theme.palette.success.main,
                        backgroundColor: theme.palette.success.main,
                    },
                    '&:hover td': {
                        backgroundColor: hexToRGBA(theme.palette.success.light, 0.1),
                    },
                },
                '&.bg-error': {
                    '& .fc-list-event-dot': {
                        borderColor: theme.palette.error.main,
                        backgroundColor: theme.palette.error.main,
                    },
                    '&:hover td': {
                        backgroundColor: hexToRGBA(theme.palette.error.light, 0.1),
                    },
                },
                '&.bg-warning': {
                    '& .fc-list-event-dot': {
                        borderColor: theme.palette.warning.main,
                        backgroundColor: theme.palette.warning.main,
                    },
                    '&:hover td': {
                        backgroundColor: hexToRGBA(theme.palette.warning.light, 0.1),
                    },
                },
                '&.bg-info': {
                    '& .fc-list-event-dot': {
                        borderColor: theme.palette.info.main,
                        backgroundColor: theme.palette.info.main,
                    },
                    '&:hover td': {
                        backgroundColor: hexToRGBA(theme.palette.info.light, 0.1),
                    },
                },
                '&.fc-daygrid-event': {
                    margin: '4px',
                    padding: '12px',
                    marginBottom: '0px',
                },
            },
            '& .fc-day ': {
                '& .fc-day-wed': {
                    '& .fc-day-today ': {
                        '& .fc-daygrid-day': {
                            minHeight: '120px',
                        },
                    },
                },
            },

            '& .fc-view-harness': {
                minHeight: '650px',
            },

            '& .fc-col-header': {
                '& .fc-col-header-cell': {
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    fontSize: theme.typography.body1.fontSize,
                    '& .fc-col-header-cell-cushion': {
                        padding: theme.spacing(0.5, 2),
                        textDecoration: 'none !important',
                    },
                },
            },

            '& .fc-scrollgrid-section-liquid > td': {
                borderRight: '1px solid red',
                maxWidth: '1200px',
            },
            '& .fc-daygrid-event-harness': {
                '& .fc-event': {
                    marginTop: 0,
                    fontWeight: 400,
                    marginBottom: 1,
                    borderRadius: '12px',
                    padding: 0,
                    fontSize: theme.typography.body2.fontSize,
                },
                '&:not(:last-of-type)': {
                    marginRight: theme.spacing(-3),
                    marginLeft: theme.spacing(1),
                },
            },
            '& .fc-daygrid-day-bottom': {
                marginTop: 1,
            },

            '& .fc-daygrid-day': {
                padding: '5px',
                '& .fc-daygrid-day-top': { flexDirection: 'row' },
            },
            '& .fc-scrollgrid': {
                border: '1px solid red',
                borderColor: theme.palette.divider,
                margin: 'auto',
            },
            '& .fc-day-past, & .fc-day-future': {
                '&.fc-daygrid-day-number': {
                    color: 'theme.palette.text. disabled',
                },
            },

            // ** All Views Event
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
                paddingTop: '4px',
            },

            // ** WeekView
            '& .fc-timegrid': {
                '& .fc-scrollgrid-section': {
                    height: 0,
                    '& .fc-col-header-cell, & .fc-timegrid-axis': {
                        borderLeft: 0,
                        borderColor: theme.palette.divider,
                    },
                    '& .fc-timegrid-axis': {
                        borderColor: theme.palette.divider,
                    },
                },
                '& .fc-timegrid-axis': {
                    '&.fc-scrollgrid-shrink': {
                        '& .fc-timegrid-axis-cushion': {
                            textTransform: 'lowercase',
                            color: theme.palette.text.disabled,
                            fontSize: theme.typography.h6.fontSize,
                        },
                    },
                },
                '& .fc-timegrid-slots': {
                    '& .fc-timegrid-slot': {
                        height: '3rem',
                        borderColor: theme.palette.divider,
                        '&.fc-timegrid-slot-label': {
                            borderRight: 0,
                        },
                        '&.fc-timegrid-slot-lane': {
                            borderLeft: 0,
                        },
                        '& .fc-timegrid-slot-label-frame': {
                            textAlign: 'center',
                            '& .fc-timegrid-slot-label-cushion': {
                                textTransform: 'lowercase',
                                fontSize: theme.typography.body2.fontSize,
                                color: `${theme.palette.text.secondary} !important`,
                            },
                        },
                    },
                },
                '& .fc-timegrid-divider': {
                    display: 'none',
                },
                '& .fc-timegrid-event': {
                    boxShadow: 'none',
                },
            },

            // ** List View
            '& .fc-list': {
                border: 'none',
                '& th[colspan="3"]': {
                    position: 'relative',
                },
                '& .fc-list-table': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '& tr': {
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:first-of-type': {
                            borderTop: `1px solid ${theme.palette.divider}`,
                        },
                        '& > *': {
                            border: 0,
                        },
                    },
                },
                '& .fc-list-day-cushion': {
                    background: theme.palette.action.hover,
                },
                '.fc-list-event': {
                    cursor: 'pointer',
                    '&:hover': {
                        '& td': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                    '& td': {
                        borderColor: theme.palette.divider,
                    },
                },
                '& .fc-list-day': {
                    backgroundColor: theme.palette.action.hover,

                    '& .fc-list-day-text, & .fc-list-day-side-text': {
                        textDecoration: 'none',
                        ...theme.typography.h6,
                    },

                    '&  >  *': {
                        background: 'none',
                        borderColor: theme.palette.divider,
                    },
                },
                '& .fc-list-event-title': {
                    display: 'flex',
                    paddingLeft: theme.spacing(2.5),
                    color: theme.palette.text.secondary,
                    fontSize: theme.typography.body1.fontSize,
                },
                '& .fc-list-event-time': {
                    color: theme.palette.text.disabled,
                    fontSize: theme.typography.body1.fontSize,
                },
            },

            // ** Popover
            '& .fc-popover': {
                zIndex: 20,
                boxShadow: 1,
                borderColor: theme.palette.divider,
                background: theme.palette.background.paper,
                '& .fc-popover-header': {
                    padding: theme.spacing(2),
                    background: theme.palette.action.hover,
                    '& .fc-popover-title, & .fc-popover-close': {
                        color: theme.palette.text.primary,
                    },
                },
                '& .fc-popover-body': {
                    '& *:not(.fc-event-main):not(:last-of-type)': {
                        marginBottom: theme.spacing(1.2),
                    },
                },
            },

            // ** Media Queries
            [theme.breakpoints.up('md')]: {
                '& .fc-sidebarToggle-button': {
                    display: 'none',
                },
                '& .fc-toolbar-title': {
                    marginLeft: 0,
                },
            },
            '@media (max-width:710px)': {
                '& .fc-header-toolbar .fc-toolbar-chunk:last-of-type': {
                    marginTop: theme.spacing(4),
                },
                '& .fc-daygrid-body-unbalanced .fc-daygrid-day-events': {
                    maxHeight: '20px',
                },
                '& .fc-daygrid-event-harness': {
                    '& .fc-event': { marginBottom: 3, borderRadius: '12px' },
                },
            },
        },
    }
})

export default CalendarWrapper
