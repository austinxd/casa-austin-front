import { useEffect, useState } from 'react'

import { useGetTokenForClientQuery } from './clientsService'
import { IDataRucbyApi } from '@/interfaces/clients/registerClients'
import { useDebounce } from '@/components/common'
import { config } from '@/core/constants/config'

export const useGetDataClient = () => {
    const [typeDocument, setSelecTypeDocument] = useState('')
    const [documentNumber, setDocumentNumber] = useState('')
    const [tokenDni, setTokenDni] = useState('20483ac1-702f-41c7-80f2-f98205acd11a')
    const [dataByApiSecond, setDataByApiSecond] = useState<any>()
    const [dataRucByApi, setDataRucByApi] = useState<IDataRucbyApi>()
    const [isLoadingClient, setIsLoadingClient] = useState(false)
    const numberDocDebounce: string = useDebounce(documentNumber, 800)
    const typeDocDebounce: string = useDebounce(typeDocument, 500)
    const { data } = useGetTokenForClientQuery('')

    useEffect(() => {
        const fetchData = async () => {
            if (data) {
                setTokenDni(data?.token)
            }
            try {
                if (typeDocument && documentNumber && tokenDni) {
                    if (typeDocument === 'dni') {
                        setIsLoadingClient(true)
                        // Usar endpoint Django con autenticación JWT
                        const token = localStorage.getItem('token')
                        const response = await fetch(
                            `${config.API_URL}/reniec/lookup/auth/`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ dni: documentNumber })
                            }
                        )
                        const data = await response.json()
                        if (response.status === 200) {
                            setDataByApiSecond(data.data)
                        }
                    }

                    if (typeDocument === 'ruc') {
                        setIsLoadingClient(true)
                        const response = await fetch(
                            `https://script.google.com/macros/s/AKfycbwo__qdJpcxEcpfORq8O2-jLTLKqJCwO2xabWmopYDuUUbflsE6TebicurSe_B5Oh-Q/exec?op=${typeDocDebounce}&token=${tokenDni}&formato=json&documento=${numberDocDebounce}`
                        )
                        const data = await response.json()

                        if (data.message === 'Exito' || data.status === 0) {
                            setDataRucByApi(data)
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoadingClient(false)
            }
        }
        fetchData()
    }, [typeDocDebounce, numberDocDebounce])

    return {
        setSelecTypeDocument,
        setDocumentNumber,
        documentNumber,
        setTokenDni,
        dataByApiSecond,
        isLoadingClient,
        typeDocument,
        dataRucByApi,
    }
}
