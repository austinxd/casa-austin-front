export interface IRegisterClient {
    comentarios_clientes: string
    document_type: string
    number_doc: string
    first_name: string
    last_name: string
    sex: string
    email: string
    date: any
    tel_number: string
    id: string
    icon?: string
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

export interface IDataClienbyApi {
    status: number
    message: string
    data: IClientInformation
}
export interface IDataClienbyApiScondary {
    data: IClientInformation
}

export interface IClientInformation {
    apellidoMaterno: string | null
    apellidoPaterno: string | null
    departamento: string | null
    direccion: string | null
    distrito: string | null
    fechaNacimiento: string | null
    nombres: string | null
    pais: string | null
    provincia: string | null
    razonsocial: string | null
    sexo: string | null
}

export interface IDataRucbyApi {
    status: number
    message: string
    data: IRucInformation
}

export interface IRucInformation {
    nombrecomercial: string | null
    estado: string | null
    departamento: string | null
    direccion: string | null
    distrito: string | null
    razonsocial: string | null
    pais: string | null
    provincia: string | null
}
