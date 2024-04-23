export interface IRegisterRental {
    property: string
    client: string
    full_payment: boolean
    temperature_pool: boolean
    check_in_date: any
    check_out_date: any
    guests: number
    price_usd: number
    price_sol: number
    advance_payment: number
    advance_payment_currency: string
    tel_contact_number: string
    file: File | File[]
}

export interface IRental {
    actual: number
    count: number
    next: string
    previous: string
    results: IRentalClient[]
    total_paginas: number
}

export interface IRentalClient {
    advance_payment: number
    advance_payment_currency: string
    check_in_date: any
    check_out_date: any
    full_payment: boolean
    temperature_pool: boolean
    guests: number
    id: string
    origin: string
    price_sol: number
    price_usd: number
    property: IProperty
    tel_contact_number: string
    seller: ISeller
    client: ISeller
    recipts: IRecipts[] | []
}

export interface IRecipts {
    id: string
    file: string
}
export interface ISeller {
    first_name: string
    id: string
    last_name: string
    tel_number: string
    number_doc: string
    type_document: string
}
export interface IPropertyRental {
    actual: number
    count: number
    next: string
    previous: string
    results: IProperty[]
    total_paginas: number
}

export interface IProperty {
    airbnb_url: string
    capacity_max: number
    id: string
    location: string
    name: string
    background_color: string
}

export interface IEventoCalendario {
    title: string
    start: string
    end: string
    color: string
    image: string
}
