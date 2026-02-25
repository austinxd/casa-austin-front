import { casaApi } from '@/core/api/casaApi'
import { ENV } from '@/core/constants/config'
import { cookiesGetString } from '@/core/utils/cookie-storage'

export const reservationsForm = async (payload: FormData) => {
    return await casaApi.post('/reservations/', payload)
}

export const checkReservationDate = async (payload: FormData) => {
    return await casaApi.post('/prop/check-avaible/', payload)
}

export const checkEditReservationDate = async (payload: FormData) => {
    return await casaApi.patch('/prop/check-avaible/', payload)
}

export const editReservationsForm = async (payload: FormData, id: string) => {
    return await casaApi.patch(`/reservations/${id}/`, payload)
}

export const deleteReservationsForm = async (id: string) => {
    return await casaApi.delete(`/reservations/${id}/`)
}

export const deleteRecipesForm = async (id: string) => {
    return await casaApi.delete(`/delete-recipe/${id}/`)
}

export const downloadContractById = async (id: string, name: string, checkIn: string) => {
    const token = cookiesGetString('token')
    const url = `${ENV.API_URL}/reservations/${id}/contrato/`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    const blob = await response.blob()
    const urlBlob = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = urlBlob
    a.download = `${name}_${checkIn}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(urlBlob)
}

export const downloadSignedContractById = async (id: string, name: string, checkIn: string) => {
    const token = cookiesGetString('token')
    const url = `${ENV.API_URL}/reservations/${id}/contrato-firma/`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    const blob = await response.blob()
    const urlBlob = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = urlBlob
    a.download = `${name}_${checkIn}_firmado.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(urlBlob)
}
