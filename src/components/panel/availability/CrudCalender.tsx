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
    /*     return data.results.map((rental) => {
        // Parsear las fechas de inicio y finalización
        const startDate = new Date(rental.check_in_date)
        const endDate = new Date(rental.check_out_date)

        // Calcular la mitad del día para la fecha de inicio y finalización
        const startMedioDia = new Date(startDate)
        startMedioDia.setHours(0, 0, 0, 0) // Establecer a las 12:00 PM (mediodía)

        const endMedioDia = new Date(endDate)
        endMedioDia.setHours(12, 0, 0, 0) // Establecer a las 12:00 PM (mediodía)

        return {
            title: `${rental.client.first_name} +${rental.guests}`,
            start: startMedioDia.toISOString(),
            end: endMedioDia.toISOString(),
            color: rental.property.background_color,
            image: '/logo.svg',
        }
    }) */
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
                    eventDragMinDistance={12}
                    events={eventos}
                    progressiveEventRendering={true}
                    dayCellClassNames={'ccsssss'}
                    contentHeight={'auto'}
                    headerToolbar={{
                        left: 'title',
                    }}
                    titleFormat={{
                        year: 'numeric',
                        month: 'long',
                    }}
                    locale={esLocale}
                    eventContent={renderEventContent}
                    dayCellContent={function (arg) {
                        return (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ textDecoration: 'line-through' }}>
                                    {arg.dayNumberText}
                                </div>
                            </div>
                        )
                    }}
                />
            </CalendarWrappers>
        </div>
    )
}
