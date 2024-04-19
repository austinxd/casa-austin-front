export interface IDataProfits {
    count: number
    next: string
    previous: string
    results: IProfits[]
    total_paginas: number
}
export interface IProfits {
    id: string
    property: IProperty[]
    month: number
    year: number
    profit_sol: string
}

export interface IProperty {
    id: string
    name: string
    airbnb_url: string
    location: string
    capacity_max: number
    background_color: string
    on_temperature_pool_url: string
    off_temperature_pool_url: string
}
