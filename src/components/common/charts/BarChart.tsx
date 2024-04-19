import { Box, Skeleton } from '@mui/material'
import ApexChart from 'react-apexcharts'

interface Props {
    categories: any
    data: any
    colors: any
    isLoading: boolean
    selectedOption: number
}

function BarCharts({ categories, colors, data, isLoading, selectedOption }: Props) {
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
                        `<p style="margin-bottom: 12px; margin-left: 8px; margin-top: 4px;color: #444151; font-size: 13px; font-weight: 500">S/. ${value}</p>`,
                ]
            },
        },
        xaxis: {
            tickAmount: 4,
            labels: {
                style: {
                    colors: '#ACAAB1',
                },
                /*                 formatter: function (val: any) {
                    return val
                }, */
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
                fontWeight: 400,
            },
            formatter: function (_val: any, opts: any) {
                return 'Casa ' + (opts.dataPointIndex + 1)
            },
        },
        tooltip: {
            enabled: false,
        },
    }
    const optionsSell: any = {
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
                        `<p style="margin-bottom: 12px; margin-left: 8px; margin-top: 4px;color: #444151; font-size: 13px; font-weight: 500">${value} noches libres</p>`,
                ]
            },
        },
        xaxis: {
            tickAmount: 4,
            labels: {
                style: {
                    colors: '#ACAAB1',
                },
                /*                 formatter: function (val: any) {
                    return val
                }, */
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
                fontWeight: 400,
            },
            formatter: function (_val: any, opts: any) {
                return 'Casa ' + (opts.dataPointIndex + 1)
            },
        },
        tooltip: {
            enabled: false,
        },
    }

    const optionsNigth: any = {
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
                        `<p style="margin-bottom: 12px; margin-left: 8px; margin-top: 4px;color: #444151; font-size: 13px; font-weight: 500">${value} noches ocupadas</p>`,
                ]
            },
        },
        xaxis: {
            tickAmount: 4,
            labels: {
                style: {
                    colors: '#ACAAB1',
                },
                /*                 formatter: function (val: any) {
                    return val
                }, */
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
                fontWeight: 400,
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
        <Box sx={{ background: 'white', px: { md: 2, sm: 2, xs: 1.5 }, pt: 0, borderRadius: 3 }}>
            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={310}
                />
            ) : (
                <ApexChart
                    type="bar"
                    options={
                        selectedOption === 1
                            ? options
                            : selectedOption === 2
                              ? optionsSell
                              : optionsNigth
                    }
                    series={series}
                    height={310}
                    width={'100%'}
                />
            )}
        </Box>
    )
}

export default BarCharts
