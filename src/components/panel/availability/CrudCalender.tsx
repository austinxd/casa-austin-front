import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import { Box, Typography } from '@mui/material'
import { useGetSearchRentalQuery } from '../../../libs/services/rentals/rentalService'
import { useEffect, useState } from 'react'
import { IEventoCalendario, IRental } from '../../../interfaces/rental/registerRental'
import CalendarWrappers from '../../../libs/calender'

const generarEventos = (data: IRental): IEventoCalendario[] => {
    if (!data || !data.results) return []
    return data.results.map((rental) => ({
        title: `${rental.client.first_name} +${rental.guests}`,
        start: rental.check_in_date,
        end: rental.check_out_date,
        color: rental.property.background_color,
        image: '/logo.svg',
    }))
}

export default function CrudCalender() {
    const { data } = useGetSearchRentalQuery('')

    const [eventos, setEventos] = useState<IEventoCalendario[]>([])

    useEffect(() => {
        if (data) {
            setEventos(generarEventos(data))
        }
    }, [data])

    const renderEventContent = (eventInfo: any) => {
        if (eventInfo.isStart) {
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
                            height: { md: '12px', sm: '1px', xs: '4px' },
                        }}
                    >
                        <img
                            src={eventInfo.event.extendedProps.image}
                            alt="Event Image"
                            className="imgCalender"
                        />
                    </Box>

                    <Typography
                        sx={{
                            color: 'white',
                            display: { md: 'flex', sm: 'none', xs: 'none' },
                            fontSize: { md: '12px', sm: '10px', xs: '10px' },
                        }}
                        style={{ width: '90%', padding: 0, margin: 0.5 }}
                    >
                        {eventInfo.event.title}
                    </Typography>
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
                            height: { md: '17px', sm: '1px', xs: '4px' },
                        }}
                    ></Box>
                </Box>
            )
        }
    }
    const eventDidMount = (info: any) => {
        // Aplica estilos específicos al primer día de cada evento
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

        if (info.isEnd) {
            const endDate = info.event.end // Obteniendo la fecha de finalización del evento

            // Buscar la celda correspondiente a la fecha de finalización del evento
            const endDayCell = document.querySelector(
                `.fc-day[data-date="${endDate.toISOString().slice(0, 10)}"]:first-of-type .fc-daygrid-day-events`
            )

            // Si se encontró la celda correspondiente, agregar el Box con el color del evento
            if (endDayCell) {
                const box = document.createElement('div')
                box.style.height = '25px'
                box.style.width = '12px'
                box.style.backgroundColor = info.event.backgroundColor // Usamos el color del evento
                box.style.borderTopRightRadius = '12px' // Establecemos el radio de borde superior derecho
                box.style.borderBottomRightRadius = '12px' // Establecemos el radio de borde inferior derecho
                box.style.marginTop = '2px'
                // Verificar el tamaño de la pantalla y ajustar el tamaño del Box
                if (window.innerWidth < 900) {
                    box.style.height = '6px'
                    box.style.width = '4px'
                    box.style.marginTop = '1px'
                }

                endDayCell.appendChild(box)
            }
        }
    }

    return (
        <div>
            <Typography variant="h1" mb={{ md: 3, sm: 1, xs: 1 }}>
                Disponibilidad
            </Typography>
            <Box display={'flex'} gap={2} my={3}>
                <Box display={'flex'} gap={0.5} alignItems={'center'}>
                    <Box
                        sx={{
                            background: '#0E6191',
                            borderRadius: '100%',
                            height: '15px',
                            width: '15px',
                        }}
                    ></Box>
                    <Typography fontSize={15} fontWeight={400}>
                        Casa 1
                    </Typography>
                </Box>
                <Box display={'flex'} gap={0.5} alignItems={'center'}>
                    <Box
                        sx={{
                            background: '#82C9E2',
                            borderRadius: '100%',
                            height: '15px',
                            width: '15px',
                        }}
                    ></Box>
                    <Typography fontSize={15} fontWeight={400}>
                        Casa 2
                    </Typography>
                </Box>
                <Box display={'flex'} gap={0.5} alignItems={'center'}>
                    <Box
                        sx={{
                            background: '#7367F0',
                            borderRadius: '100%',
                            height: '15px',
                            width: '15px',
                        }}
                    ></Box>
                    <Typography fontSize={15} fontWeight={400}>
                        Casa 3
                    </Typography>
                </Box>
                <Box display={'flex'} gap={0.5} alignItems={'center'}>
                    <Box
                        sx={{
                            background: '#C466A1',
                            borderRadius: '100%',
                            height: '15px',
                            width: '15px',
                        }}
                    ></Box>
                    <Typography fontSize={15} fontWeight={400}>
                        Casa 4
                    </Typography>
                </Box>
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
            <CalendarWrappers>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
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
                                <div>{arg.dayNumberText}</div>
                            </div>
                        )
                    }}
                />
            </CalendarWrappers>
        </div>
    )
}
