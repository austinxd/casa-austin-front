import style from '../../dashboard.module.css'
import Card from './cards/Card'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import StarsIcon from '@mui/icons-material/Stars'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { IDataDash } from '@/interfaces/dashboard/dashboard'
import formatCurrency from '@/core/utils/formatCurrency'

interface Props {
    data: IDataDash | undefined
}

export default function SumaryCards({ data }: Props) {
    return (
        <>
            <div className={style.container}>
                <div className={style.item}>
                    <Card
                        color="#4caf50"
                        icon={
                            <EventAvailableOutlinedIcon
                                sx={{ color: '#4caf50', fontSize: { md: '34px', xs: '22px' } }}
                            />
                        }
                        quantity={data?.free_days_total ? data?.free_days_total : ' '}
                        title="Noches Disponibles "
                        nigthReserv={data?.ocuppied_days_total ? data.ocuppied_days_total : 0}
                    />
                </div>

                <div className={style.item}>
                    <Card
                        color="#FF9800"
                        icon={
                            <StarsIcon
                                sx={{ color: '#FF9800', fontSize: { md: '34px', xs: '22px' } }}
                            />
                        }
                        quantity={data?.puntos_canjeados ? data?.puntos_canjeados : '0'}
                        title="Puntos canjeados"
                    />
                </div>

                <div className={style.item}>
                    <Card
                        color="#FFBBBD"
                        icon={
                            <MoneyOffIcon
                                sx={{ color: '#FFBBBD', fontSize: { md: '34px', xs: '22px' } }}
                            />
                        }
                        quantity={
                            data?.dinero_por_cobrar
                                ? ` ${formatCurrency(+data?.dinero_por_cobrar)}`
                                : ' '
                        }
                        title="Dinero por cobrar"
                    />
                </div>
                <div className={style.item}>
                    <Card
                        color="#9EE5ED"
                        icon={
                            <AccountBalanceIcon
                                sx={{ color: '#9EE5ED', fontSize: { md: '34px', xs: '22px' } }}
                            />
                        }
                        quantity={
                            data?.dinero_total_facturado
                                ? `${formatCurrency(+data?.dinero_total_facturado)}`
                                : ' '
                        }
                        title="Total facturado"
                    />
                </div>
            </div>
        </>
    )
}
