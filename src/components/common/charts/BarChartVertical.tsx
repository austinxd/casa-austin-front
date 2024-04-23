import { Box, IconButton, Skeleton, Typography, useMediaQuery } from '@mui/material'
import ApexChart from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import { useRef } from 'react'
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'

interface Props {
    title: string
    categories: any
    data: any
    setMonthSelect: any
    isLoading: boolean
}

function BarChartsVertical({ title, categories, data, isLoading, setMonthSelect }: Props) {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const chartRef = useRef<any>()

    const scrollLeft = () => {
        chartRef.current.scrollLeft -= 50 // Ajusta la velocidad de desplazamiento según sea necesario
    }

    const scrollRight = () => {
        chartRef.current.scrollLeft += 50 // Ajusta la velocidad de desplazamiento según sea necesario
    }

    const options: any = {
        chart: {
            id: 'apexchart-example',
            toolbar: {
                show: false,
            },
            events: {
                xAxisLabelClick: function (event: any) {
                    setMonthSelect(event.target.innerHTML)
                },
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '65%',
                distributed: true,
                barWidth: '75%',
                borderRadius: 9,
                borderRadiusApplication: 'end',
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#ACAAB1',
                },
            },
            categories: categories,
        },
        yaxis: {
            tickAmount: 3,
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
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        stroke: {
            width: 1,
        },
        legend: {
            show: false,
        },
        colors: ['#FF5733'],
        dataLabels: {
            enabled: false,
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
        <Box position="relative">
            {isSmallScreen && (
                <Box position={'absolute'} right={1} mt={'12px'}>
                    <IconButton aria-label="scroll left" onClick={scrollLeft}>
                        <ArrowCircleLeftOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="scroll right" sx={{ pl: 0 }} onClick={scrollRight}>
                        <ArrowCircleRightOutlinedIcon />
                    </IconButton>
                </Box>
            )}
            <Box
                ref={chartRef}
                boxShadow="4px 4px 20px rgba(0, 0, 0, 0.1)"
                width={{ md: '100%', sm: 'calc(100vw - 268px)', xs: 'calc(100vw - 32px)' }}
                sx={{
                    background: 'white',
                    p: { md: 3, sm: 2, xs: 1.5 },
                    borderRadius: 3,
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    scrollPadding: '0px 16px',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                <Box display={'flex'} gap={1} p={{ md: 0, sm: 0, xs: 1 }}>
                    <Typography variant="h2" fontSize={16} fontWeight={500}>
                        {title}
                    </Typography>
                </Box>
                {isLoading ? (
                    <Skeleton
                        variant="rounded"
                        sx={{ width: '100%', bgcolor: '#DADADA', marginTop: '16px' }}
                        height={300}
                    />
                ) : (
                    <ApexChart
                        type="bar"
                        options={options}
                        series={series}
                        height={310}
                        style={{ width: isSmallScreen ? '800px' : '100%' }}
                    />
                )}
            </Box>
        </Box>
    )
}

export default BarChartsVertical
