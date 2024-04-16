import { Box, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import ApexChart from 'react-apexcharts'

interface Props {
    title: string
    categories: any
    data: any
    colors: any
    isLoading: boolean
    title2: string
    title3: string
}

function BarCharts({ title, categories, colors, data, isLoading, title2, title3 }: Props) {
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
    const [selectedOption, setSelectedOption] = useState<number>(1)
    const renderChartOrText = () => {
        if (selectedOption === 1) {
            return (
                <ApexChart
                    type="bar"
                    options={options}
                    series={series}
                    height={310}
                    width={'100%'}
                />
            )
        } else if (selectedOption === 2) {
            return (
                <ApexChart
                    type="bar"
                    options={options}
                    series={series}
                    height={310}
                    width={'100%'}
                />
            )
        } else if (selectedOption === 3) {
            return (
                <ApexChart
                    type="bar"
                    options={options}
                    series={series}
                    height={310}
                    width={'100%'}
                />
            )
        }
        return null
    }
    return (
        <Box
            boxShadow="4px 4px 20px rgba(0, 0, 0, 0.1)"
            sx={{ background: 'white', p: { md: 3, sm: 2, xs: 1.5 }, borderRadius: 3 }}
        >
            <Box display={'flex'} gap={1}>
                <Typography
                    variant="h2"
                    fontSize={16}
                    sx={{
                        opacity: selectedOption === 1 ? 1 : 0.5,
                        borderBottom: selectedOption === 1 ? '2px solid #A8A8A8' : 'none',
                        cursor: 'pointer',
                    }}
                    fontWeight={500}
                    onClick={() => setSelectedOption(1)}
                >
                    {title}
                </Typography>
                <Typography
                    variant="h2"
                    fontSize={16}
                    sx={{
                        opacity: selectedOption === 2 ? 2 : 0.5,
                        borderBottom: selectedOption === 2 ? '2px solid #A8A8A8' : 'none',
                        cursor: 'pointer',
                    }}
                    fontWeight={500}
                    onClick={() => setSelectedOption(2)}
                >
                    {title2}
                </Typography>
                <Typography
                    sx={{
                        opacity: selectedOption === 3 ? 1 : 0.5,
                        borderBottom: selectedOption === 3 ? '2px solid #A8A8A8' : 'none',
                        cursor: 'pointer',
                    }}
                    variant="h2"
                    fontSize={16}
                    fontWeight={500}
                    onClick={() => setSelectedOption(3)}
                >
                    {title3}
                </Typography>
            </Box>
            {isLoading ? (
                <Skeleton
                    variant="rounded"
                    sx={{ width: '100%', bgcolor: '#DADADA' }}
                    height={310}
                />
            ) : (
                renderChartOrText()
            )}
        </Box>
    )
}

export default BarCharts
