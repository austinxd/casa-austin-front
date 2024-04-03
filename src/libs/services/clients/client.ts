import { casaApi } from '../../api/casaApi'

export const clientForm = async (payload: FormData) => {
    return await casaApi.post('/clients/', payload)
}

export const editClientForm = async (payload: FormData, id: string) => {
    return await casaApi.patch(`/clients/${id}/`, payload)
}

export const deleteClienForm = async (id: string) => {
    return await casaApi.delete(`/clients/${id}/`)
}
