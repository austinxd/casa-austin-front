import * as XLSX from 'xlsx'
import { IRentalClient } from '@/interfaces/rental/registerRental'

const STATUS_LABELS: Record<string, string> = {
    incomplete: 'Incompleto',
    pending: 'Pendiente',
    approved: 'Aprobado',
}

export function exportRentalsToExcel(rentals: IRentalClient[], monthLabel: string) {
    const rows = rentals.map((r) => ({
        Propiedad: r.property?.name ?? '',
        Cliente: `${r.client?.first_name ?? ''} ${r.client?.last_name ?? ''}`.trim(),
        'Tipo Doc': r.client?.type_document ?? '',
        'Nro Doc': r.client?.number_doc ?? '',
        Teléfono: r.tel_contact_number || r.client?.tel_number || '',
        'Check-in': r.check_in_date ?? '',
        'Check-out': r.check_out_date ?? '',
        Huéspedes: r.guests,
        Estado: STATUS_LABELS[r.status] ?? r.status,
        Origen: r.origin ?? '',
        'Precio USD': r.price_usd,
        'Precio SOL': r.price_sol,
        Adelanto: r.advance_payment,
        'Moneda Adelanto': r.advance_payment_currency ?? '',
        'Resta por pagar': r.resta_pagar ?? '',
        'Pago completo': r.full_payment ? 'Sí' : 'No',
        'Piscina temperada': r.temperature_pool ? 'Sí' : 'No',
        'Late checkout': r.late_checkout ? 'Sí' : 'No',
        Comentarios: r.comentarios_reservas ?? '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)

    // Auto-size columns
    const colWidths = Object.keys(rows[0] || {}).map((key) => {
        const maxLen = Math.max(
            key.length,
            ...rows.map((row) => String((row as any)[key] ?? '').length)
        )
        return { wch: Math.min(maxLen + 2, 40) }
    })
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas')
    XLSX.writeFile(workbook, `Reservas_${monthLabel}.xlsx`)
}
