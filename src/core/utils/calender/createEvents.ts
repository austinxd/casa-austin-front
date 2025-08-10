import { IEventoCalendario, IRentalClient } from '@/interfaces/rental/registerRental'

export const createEvents = (data: IRentalClient[]): IEventoCalendario[] => {
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
            rental.origin === 'aus' || rental.origin === 'man' || rental.origin === 'client'
                ? rental.property.name
                : '/airbnb.png',
        type: rental.origin,
        lateCheckout: rental.late_checkout,
        house: rental.property.name,
    }))
}
