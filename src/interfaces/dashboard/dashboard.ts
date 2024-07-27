export interface IDataDash {
    best_sellers: IBest_sellers[]
    free_days_per_house: IFreeDays[]
    free_days_total: number
    ocuppied_days_total: number
    dinero_por_cobrar: string
    dinero_total_facturado: string
    noches_man: any
}
export interface IFreeDays {
    casa: string
    dias_libres: number
    dias_ocupada: number
    dinero_por_cobrar: number
    dinero_facturado: number
    property__background_color: string
}

export interface IBest_sellers {
    id: number
    nombre: number
    apellido: number
    ventas_soles: string
    foto_perfil: string
}
