import { casaApi } from '@/core/api/casaApi'

export const clientForm = async (payload: FormData) => {
    return await casaApi.post('/clients/', payload)
}

export const editClientForm = async (payload: FormData, id: string) => {
    return await casaApi.patch(`/clients/${id}/`, payload)
}

export const deleteClienForm = async (id: string) => {
    return await casaApi.delete(`/clients/${id}/`)
}

export const dataClientByDocument = async (
    typeDocument: string,
    document: string,
    token: string
) => {
    try {
        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbwo__qdJpcxEcpfORq8O2-jLTLKqJCwO2xabWmopYDuUUbflsE6TebicurSe_B5Oh-Q/exec?op=${typeDocument}&token=${token}&formato=json&documento=${document}/`
        )
        console.log(response)
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}
