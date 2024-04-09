import { useEffect, useState } from 'react'
import { IDataClienbyApi, IDataRucbyApi } from '../../../interfaces/clients/registerClients'
import { useDebounce } from '../../../components/common/useDebounce'
import { useGetTokenForClientQuery } from './clientsService'

export const useGetDataClient = () => {
    const [typeDocument, setSelecTypeDocument] = useState('')
    const [documentNumber, setDocumentNumber] = useState('')
    const [tokenDni, setTokenDni] = useState('20483ac1-702f-41c7-80f2-f98205acd11a')
    const [dataByApi, setDataByApi] = useState<IDataClienbyApi>()
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
                        const response = await fetch(
                            `https://script.google.com/macros/s/AKfycbyoBhxuklU5D3LTguTcYAS85klwFINHxxd-FroauC4CmFVvS0ua/exec?op=${typeDocDebounce}&token=${tokenDni}&formato=json&documento=${numberDocDebounce}`
                        )
                        const data = await response.json()

                        if (data.message === 'Exito' || data.status === 0) {
                            setDataByApi(data)
                        }
                    }

                    if (typeDocument === 'ruc') {
                        setIsLoadingClient(true)
                        const response = await fetch(
                            `https://script.google.com/macros/s/AKfycbyoBhxuklU5D3LTguTcYAS85klwFINHxxd-FroauC4CmFVvS0ua/exec?op=${typeDocDebounce}&token=${tokenDni}&formato=json&documento=${numberDocDebounce}`
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
        dataByApi,
        isLoadingClient,
        typeDocument,
        dataRucByApi,
    }
}
