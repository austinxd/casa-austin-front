import { casaApi } from '../../api/casaApi'

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
