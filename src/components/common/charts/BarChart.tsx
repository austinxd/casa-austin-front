import { Box, Typography } from '@mui/material'
import ApexChart from 'react-apexcharts'

interface Props {
    title: string
}

function BarCharts({ title }: Props) {
    const options: any = {
        chart: {
            id: 'apexchart-example',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '65%',
                distributed: true,
                barWidth: '75%',
                borderRadius: 9,
                borderRadiusApplication: 'end',
            },
        },
        legend: {
            position: 'right',
            labels: {
                colors: '#6E6B78',
            },
            markers: {
                radius: 12,
                offsetX: -4,
                offsetY: 2,
            },
            formatter: function (
                val: any,
                _opts: {
                    seriesIndex: number
                    w: { globals: { series: any[] } }
                }
            ) {
                const value = series[0].data[val - 1]
                return [
                    `Casa ${val}` +
                        `<p style="margin-bottom: 16px; margin-left: 16px; margin-top: 4px;color: #444151; font-size: 16px; font-weight: 500">${value} %</p>`,
                ]
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#ACAAB1',
                },
                formatter: function (val: any) {
                    return val + '%'
                },
            },
            categories: ['1', '2', '3', '4'],
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#ACAAB1',
                },
            },
        },
        grid: {
            show: true,
            borderColor: '#E6E5E7',
            strokeDashArray: 12,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        stroke: {
            width: 1,
        },
        colors: ['#0E6191', '#82C9E2', '#7367F0', '#C466A1'],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                colors: ['white'],
            },
            formatter: function (_val: any, opts: any) {
                return 'Casa ' + (opts.dataPointIndex + 1)
            },
        },
        tooltip: {
            enabled: false,
        },
    }

    const series = [
        {
            name: 'Casa',
            data: [12, 10, 38, 40],
        },
    ]

    return (
        <Box
            boxShadow="4px 4px 20px rgba(0, 0, 0, 0.1)"
            sx={{ background: 'white', p: { md: 3, sm: 2, xs: 2 }, borderRadius: 3 }}
        >
            <Typography variant="h2">{title}</Typography>
            <ApexChart type="bar" options={options} series={series} height={310} width={'100%'} />
        </Box>
    )
}

export default BarCharts
