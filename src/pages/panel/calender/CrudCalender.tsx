import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import { Box } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { IEventoCalendario } from '../../../interfaces/rental/registerRental'
import { useGetCalenderListQuery } from '@/services/rentals/rentalService'
import { useGetDashboardQuery } from '@/services/dashboard/dashboardSlice'
import CalendarWrappers from '@/core/calender'
import CalenderSkelton from './components/skeleton/CalenderSkelton'
import HeaderCalender from './components/header/HeaderCalender'
import { createEvents, getMonthStartAndEndDates, months } from '@/core/utils'
import RenderEventContent from './components/fullCalenderProps/RenderEventContent'

export default function CrudCalender() {
    const currentDates = new Date()
    const [itemsSelect, setItemsSelect] = useState<string[]>([])
    const [currentYear, setCurrentYear] = useState(currentDates.getFullYear())
    const { data: calenderList, isLoading } = useGetCalenderListQuery({
        year: currentYear.toString(),
    })
    const { data: dataHouse } = useGetDashboardQuery({ month: '1', year: '2024' })
    const [eventos, setEventos] = useState<IEventoCalendario[]>([])
    const { monthStartDates, monthEndDates } = getMonthStartAndEndDates(months, currentYear)

    useEffect(() => {
        const dataScroll = () => {
            const currentMonthIndex = currentDates.getMonth()
            const scrollHeight = window.innerWidth < 1000 ? 370 : 670
            const isCurrentYear = currentYear === currentDates.getFullYear()
            if (calenderList) {
                setEventos(createEvents(calenderList))
                setTimeout(() => {
                    if (isCurrentYear) {
                        window.scrollTo({
                            top: currentMonthIndex * scrollHeight,
                            behavior: 'smooth',
                        })
                    } else {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }
                }, 100)
            }
        }
        dataScroll()
    }, [calenderList])

    const currentDate = new Date()

    let usedColors: any = []

    const eventDidMount = useCallback((info: any) => {
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
    }, [])

    const filterHousesCalender = (nameHouse: string) => {
        let updatedItemsSelect

        if (itemsSelect.includes(nameHouse)) {
            updatedItemsSelect = itemsSelect.filter((item) => item !== nameHouse)
        } else {
            updatedItemsSelect = [...itemsSelect, nameHouse]
        }

        setItemsSelect(updatedItemsSelect)

        if (updatedItemsSelect.length === 0) {
            setEventos(createEvents(calenderList || []))
        } else {
            const filteredEvents = createEvents(calenderList || []).filter((item) =>
                updatedItemsSelect.includes(item.image)
            )
            setEventos(filteredEvents)
        }
    }
    return (
        <>
            {isLoading ? (
                <CalenderSkelton />
            ) : (
                <Box mt={{ md: 18, sm: 18, xs: 19 }}>
                    <HeaderCalender
                        filterHousesCalender={filterHousesCalender}
                        currentYear={currentYear}
                        dataHouse={dataHouse}
                        itemsSelect={itemsSelect}
                        setCurrentYear={setCurrentYear}
                    />
                    <CalendarWrappers>
                        {months.map((month, index) => (
                            <Box key={month}>
                                <FullCalendar
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
                                    eventContent={(eventInfo) => (
                                        <RenderEventContent eventInfo={eventInfo} />
                                    )}
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
                            </Box>
                        ))}
                    </CalendarWrappers>
                </Box>
            )}
        </>
    )
}

/*     const renderEventContent = useCallback((eventInfo: any) => {
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
    }, []) */
