import { Box, Skeleton, Typography } from '@mui/material'
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
            show: false,
        },
        xaxis: {
            tickAmount: 4,
            labels: {
                style: {
                    colors: '#ACAAB1',
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
                <>
                    <Box display={'flex'} gap={1}>
                        <Box
                            width={
                                selectedOption === 1
                                    ? 'calc(100% - 85px)'
                                    : selectedOption === 2
                                      ? 'calc(100% - 115px)'
                                      : 'calc(100% - 143px)'
                            }
                        >
                            {' '}
                            <ApexChart
                                type="bar"
                                options={options}
                                series={series}
                                height={310}
                                width={'100%'}
                            />
                        </Box>

                        <Box
                            width={
                                selectedOption === 1
                                    ? '85px'
                                    : selectedOption === 2
                                      ? '112px'
                                      : '140px'
                            }
                            py={2}
                        >
                            {data.map((item: any, index: number) => (
                                <Box pt={2} key={index}>
                                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                                        <Box
                                            height={10}
                                            width={10}
                                            borderRadius={100}
                                            sx={{ background: colors[index] }}
                                        ></Box>
                                        <Typography
                                            variant="body1"
                                            sx={{ opacity: 0.8, fontSize: 12.5, fontWeight: 600 }}
                                        >
                                            Casa {categories[index]}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" fontSize={12} ml={1}>
                                        {selectedOption === 1 ? (
                                            <> S/. {new Intl.NumberFormat('es-PE').format(item)}</>
                                        ) : selectedOption === 2 ? (
                                            <>
                                                {item > 1
                                                    ? item + ' noches libres'
                                                    : item + ' noche libre'}
                                            </>
                                        ) : (
                                            <>
                                                {item > 1
                                                    ? item + ' noches ocupadas'
                                                    : item + ' noche ocupada'}
                                            </>
                                        )}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default BarCharts
