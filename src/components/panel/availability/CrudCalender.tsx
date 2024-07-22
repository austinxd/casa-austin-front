import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import { AppBar, Box, Typography, useTheme } from '@mui/material'
import { useGetCalenderListQuery } from '../../../libs/services/rentals/rentalService'
import { useEffect, useState } from 'react'
import { IEventoCalendario, IRentalClient } from '../../../interfaces/rental/registerRental'
import CalendarWrappers from '../../../libs/calender'
import { useGetDashboardQuery } from '../../../libs/services/dashboard/dashboardSlice'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const generarEventos = (data: IRentalClient[]): IEventoCalendario[] => {
    if (!data) return []
    return data.map((rental: IRentalClient) => ({
        title:
            rental.origin === 'aus'
                ? `${rental.client.first_name} + ${rental.guests}`
                : rental.origin === 'air'
                  ? 'Airbnb'
                  : 'Mantenimiento',
        start: rental.check_in_date,
        end: rental.late_checkout ? rental.late_check_out_date : rental.check_out_date,
        color: rental.origin === 'man' ? '#888888' : rental.property.background_color,
        image:
            rental.origin === 'aus' || rental.origin === 'man'
                ? rental.property.name
                : '/airbnb.png',
        type: rental.origin,
        lateCheckout: rental.late_checkout,
    }))
}

export default function CrudCalender() {
    const { data: calenderList } = useGetCalenderListQuery('')
    const { data: dataHouse } = useGetDashboardQuery({ month: '1', year: '2024' })
    const { palette } = useTheme()
    const [eventos, setEventos] = useState<IEventoCalendario[]>([])

    useEffect(() => {
        if (calenderList) {
            setEventos(generarEventos(calenderList))
        }
    }, [calenderList])

    useEffect(() => {
        const currentMonth = currentDate.getMonth()

        const scrollonMonth = () => {
            const scrollHeight = window.innerWidth < 1000 ? 320 : 520
            window.scroll(0, scrollHeight * currentMonth)
        }
        scrollonMonth()
    }, [])

    const currentDate = new Date()

    const renderEventContent = (eventInfo: any) => {
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
                        {eventInfo.event.extendedProps.lateCheckout && (
                            <Box display={'flex'} ml={'8px'} alignItems={'center'}>
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
    let usedColors: any = []
    const eventDidMount = (info: any) => {
        if (info.isStart) {
            const firstDayCell = info.el.closest('.fc-event')
            if (firstDayCell) {
                firstDayCell.style.background = 'innerth'
                const parentRow = firstDayCell.closest('.fc-scrollgrid-section')
                if (parentRow) {
                    const firstDayOfRow = parentRow.querySelector('.fc-day')
                    if (firstDayOfRow === info.el) {
                        firstDayCell.style.marginLeft = '14px'
                    }
                }
            }
        } else {
            info.el.style.background = 'innerth'
            info.el.style.marginLeft = '0px'
            info.el.style.borderTopLeftRadius = '0px'
            info.el.style.borderBottomLeftRadius = '0px'
        }
        if (info.event.extendedProps.lateCheckout) {
            info.el.style.marginRight = '-21px'
            if (window.innerWidth < 900) {
                info.el.style.marginRight = '-16px'
            }
        }
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        const eventDate = new Date(info.event.end)
        eventDate.setHours(0, 0, 0, 0)

        const isPastDate = eventDate < currentDate
        if (isPastDate) {
            info.el.style.backgroundColor = info.event.backgroundColor
            info.el.style.opacity = '0.35'
        }

        if (info.isEnd) {
            const endDate = info.event.end
            const endDayCell = document.querySelector(
                `.fc-day[data-date="${endDate.toISOString().slice(0, 10)}"]:first-of-type .fc-daygrid-day-events`
            )
            if (endDayCell) {
                const eventColor = info.event.backgroundColor
                if (!usedColors.includes(eventColor)) {
                    const box = document.createElement('div')
                    box.style.height = '25px'
                    if (info.event.extendedProps.lateCheckout) {
                        box.style.width = '32px'
                        if (window.innerWidth < 900) {
                            box.style.width = '12px'
                        }
                    }
                    box.style.width = '12px'
                    box.style.backgroundColor = eventColor
                    box.style.borderTopRightRadius = '12px'
                    box.style.borderBottomRightRadius = '12px'
                    box.style.marginTop = '2px'
                    if (isPastDate) {
                        box.style.opacity = '0.4'
                    }
                    if (window.innerWidth < 900) {
                        box.style.height = '6px'
                        box.style.width = '4px'
                        box.style.marginTop = '1px'
                    }

                    endDayCell.appendChild(box)
                    usedColors.push(eventColor)
                }
            }
        }
    }
    const currentDates = new Date()
    const currentYear = currentDates.getFullYear()
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    const monthStartDates = months.map((month) => `${currentYear}-${month}-01`)
    const monthEndDates = months.map((_month: string, index) => {
        const nextMonth = index === 11 ? '01' : months[index + 1]
        const nextYear = index === 11 ? currentYear + 1 : currentYear
        return `${nextYear}-${nextMonth}-01`
    })

    return (
        <div>
            <Typography variant="h1" mb={{ md: 1, sm: 1, xs: 1 }}>
                Disponibilidad
            </Typography>

            <AppBar
                position="sticky"
                sx={{ boxShadow: 'none', backgroundColor: 'white', width: '100%' }}
            >
                <Box display={'flex'} gap={2} my={{ md: 3, sm: 2, xs: 2 }}>
                    {dataHouse?.free_days_per_house.map((item) => (
                        <Box
                            key={item.property__background_color}
                            display={'flex'}
                            gap={0.5}
                            alignItems={'center'}
                        >
                            <Box
                                sx={{
                                    background: item.property__background_color,
                                    borderRadius: '100%',
                                    height: '15px',
                                    width: '15px',
                                }}
                            ></Box>
                            <Typography fontSize={15} fontWeight={400}>
                                {item.casa.replace('Austin', '')}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        background: '#82C9E2',
                        display: 'flex',
                        textAlign: 'center',
                        p: 1,
                        borderRadius: 1.5,
                    }}
                >
                    <Typography sx={{ flex: 1 }}>L</Typography>
                    <Typography sx={{ flex: 1 }}>M</Typography>
                    <Typography sx={{ flex: 1 }}>M</Typography>
                    <Typography sx={{ flex: 1 }}>J</Typography>
                    <Typography sx={{ flex: 1 }}>V</Typography>
                    <Typography sx={{ flex: 1 }}>S</Typography>
                    <Typography sx={{ flex: 1 }}>D</Typography>
                </Box>
            </AppBar>

            <CalendarWrappers>
                {months.map((month, index) => (
                    <FullCalendar
                        key={month}
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        initialDate={monthStartDates[index]}
                        events={eventos}
                        contentHeight={'auto'}
                        nextDayThreshold={'00:00:00'}
                        headerToolbar={{
                            left: 'title',
                        }}
                        titleFormat={{
                            year: 'numeric',
                            month: 'long',
                        }}
                        locale={esLocale}
                        eventContent={renderEventContent}
                        eventDidMount={eventDidMount}
                        dayCellContent={function (arg) {
                            return (
                                <div style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            opacity: arg.date < currentDate ? 0.32 : 1,
                                        }}
                                    >
                                        {arg.dayNumberText}
                                    </div>
                                </div>
                            )
                        }}
                        validRange={{
                            start: monthStartDates[index],
                            end: monthEndDates[index],
                        }}
                    />
                ))}
            </CalendarWrappers>
        </div>
    )
}
