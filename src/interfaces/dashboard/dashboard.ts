export interface IDataDash {
    properties_more_reserved: IPropery[]
    reservations_last_week: number
    seller_more_reserved: ISellerDashboard[]
    statistic_2: number
    statistic_3: number
    statistic_4: number
}
export interface ISellerDashboard {
    num_reservas: number
    percentage: number
    seller: number
    seller__email: string
    seller__first_name: string
    seller__last_name: string
}

export interface IPropery {
    num_reservas: number
    percentage: number
    property: string
    property__background_color: string
    property__name: string
}
