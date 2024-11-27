import style from '../../dashboard.module.css'
import Card from './cards/Card'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { IDataDash } from '@/interfaces/dashboard/dashboard'

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
                        title="Noches disponibles"
                    />
                </div>

                <div className={style.item}>
                    <Card
                        color="#ff1744"
                        icon={
                            <EventBusyOutlinedIcon
                                sx={{ color: '#ff1744', fontSize: { md: '34px', xs: '22px' } }}
                            />
                        }
                        quantity={data?.ocuppied_days_total ? data?.ocuppied_days_total : '0'}
                        title="Noches reservadas"
                        nochesMan={data?.noches_man ? data?.noches_man : null}
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
                        quantity={data?.dinero_por_cobrar ? `S/. ${data?.dinero_por_cobrar}` : ' '}
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
                                ? `S/. ${data?.dinero_total_facturado}`
                                : ' '
                        }
                        title="Total facturado"
                    />
                </div>
            </div>
        </>
    )
}
