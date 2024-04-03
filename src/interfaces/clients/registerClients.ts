export interface IRegisterClient {
    document_type: string
    number_doc: string
    first_name: string
    last_name: string
    sex: string
    email: string
    date: any
    tel_number: string
    id: string
}
export interface IListClients {
    actual: number
    count: number
    next: string
    previous: string
    results: IRegisterClient[]
    total_paginas: number
}
