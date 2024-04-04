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
export interface IListClientsByBD {
    status: number
    message: string
    data: IUserData
}

export interface IUserData {
    pais: string
    departamento: string | null
    provincia: string | null
    distrito: string | null
    razonsocial: string | null
    direccion: string | null
    nombres: string
    apellidoMaterno: string
    apellidoPaterno: string
    fechaNacimiento: string
    sexo: string
}
