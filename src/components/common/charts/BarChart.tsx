import { Box, Skeleton, Typography } from '@mui/material'
import ApexChart from 'react-apexcharts'

interface Props {
    title: string
    categories: any
    data: any
    colors: any
    isLoading: boolean
}

function BarCharts({ title, categories, colors, data, isLoading }: Props) {
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
            categories: categories,
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
        colors: colors,
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
            data: data,
        },
    ]

    return (
        <Box
            boxShadow="4px 4px 20px rgba(0, 0, 0, 0.1)"
            sx={{ background: 'white', p: { md: 3, sm: 2, xs: 1.5 }, borderRadius: 3 }}
        >
            <Typography variant="h2">{title}</Typography>
            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={310}
                />
            ) : (
                <ApexChart
                    type="bar"
                    options={options}
                    series={series}
                    height={310}
                    width={'100%'}
                />
            )}
        </Box>
    )
}

export default BarCharts
