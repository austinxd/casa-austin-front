import { IRental, IRentalClient } from '@/interfaces/rental/registerRental'

const reformDate = (dateString: string): string => {
    const parts = dateString.split('-')
    return `${parts[2]}-${parts[1]}-${parts[0]}` // Se mantiene el formato dd-mm-yyyy
}

interface Props {
    data: IRental | undefined
}

const formatRowsProfits = ({ data }: Props) => {
    if (!data || !data.results) return []

    return data.results.map((rental: IRentalClient) => {
        return {
            id: rental.id,
            first_name:
                rental.origin === 'air'
                    ? rental.client.first_name != ''
                        ? rental.client.first_name
                        : 'Airbnb'
                    : rental.client.first_name,
            last_name:
                rental.origin === 'air'
                    ? rental.client.last_name != ''
                        ? rental.client.last_name
                        : ' '
                    : rental.client.last_name,
            number_doc: rental.client.number_doc ? rental.client.number_doc : '-',
            type_home: rental.property.name,
            check_in_date: reformDate(rental.check_in_date),
            type_reservation:
                rental.origin === 'air'
                    ? 'Reserva Airbnb'
                    : rental.origin === 'man'
                      ? 'Mantenimiento'
                      : 'Reserva Local',
            price_sol: rental.price_sol,
            tel_number: rental.client.tel_number,
            type_document: rental.client.document_type,
            origin: rental.origin,
        }
    })
}

export default formatRowsProfits
