import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import { Box, Typography } from '@mui/material'
import CalendarWrapper from '../../../libs/calender'
import { useGetSearchRentalQuery } from '../../../libs/services/rentals/rentalService'
import { useEffect, useState } from 'react'
import { IEventoCalendario, IRental } from '../../../interfaces/rental/registerRental'
const getColorHouse = (house: string): string => {
    switch (house) {
        case 'Casa 1':
            return '#0E6191'
        case 'Casa 2':
            return '#82C9E2'
        case 'Casa 3':
            return '#7367F0'
        case 'Casa 4':
            return '#C466A1'
        default:
            return 'transparent'
    }
}
const generarEventos = (data: IRental): IEventoCalendario[] => {
    if (!data || !data.results) return []

    return data.results.map((rental) => ({
        title: `${rental.client.first_name} +${rental.guests}`,
        start: rental.check_in_date,
        end: rental.check_out_date,
        color: getColorHouse(rental.property.name),
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
            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <img
                    src={eventInfo.event.extendedProps.image}
                    alt="Event Image"
                    style={{
                        height: '22px',
                        width: '22px',
                        borderRadius: '100%',
                        marginRight: '12px',
                        objectFit: 'cover',
                    }}
                />
                <p style={{ width: '90%', padding: 0, margin: 2 }}>{eventInfo.event.title}</p>
            </div>
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
            <CalendarWrapper>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={eventos}
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
                                <Typography sx={{ color: '#173E83', mt: 1, fontWeight: 400 }}>
                                    80$
                                </Typography>
                            </div>
                        )
                    }}
                />
            </CalendarWrapper>
        </div>
    )
}
