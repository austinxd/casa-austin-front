import { Box, Skeleton, Typography, useMediaQuery } from '@mui/material'
import ApexChart from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import { useRef, useState } from 'react'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface Props {
    title: string
    categories: any
    data: any
    isLoading: boolean
}

function BarChartsVertical({ title, categories, data, isLoading }: Props) {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const chartRef = useRef<any>(null)

    const [scrollPosition, setScrollPosition] = useState(0)

    const handleScroll = (scrollOffset: number) => {
        chartRef.current?.container?.scrollTo({
            left: scrollPosition + scrollOffset,
            behavior: 'smooth',
        })
        setScrollPosition(scrollPosition + scrollOffset)
    }

    const options: any = {
        chart: {
            id: 'apexchart-example',
            toolbar: {
                show: false,
            },
            events: {
                xAxisLabelClick: function (event: any) {
                    console.log(event.target.innerHTML, 'clic')
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
        <Box
            boxShadow="4px 4px 20px rgba(0, 0, 0, 0.1)"
            position="relative"
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
            {isSmallScreen && (
                <Box
                    position="absolute"
                    top="0"
                    right="0"
                    zIndex="1"
                    display="flex"
                    alignItems="center"
                >
                    <NavigateBeforeIcon
                        onClick={() => handleScroll(-100)}
                        style={{ cursor: 'pointer', color: '#000' }}
                    />
                    <NavigateNextIcon
                        onClick={() => handleScroll(100)}
                        style={{ cursor: 'pointer', color: '#000' }}
                    />
                </Box>
            )}
            <Box display={'flex'} gap={1} p={{ md: 0, sm: 0, xs: 1 }}>
                <Typography variant="h2" fontSize={16} fontWeight={500}>
                    {title}
                </Typography>
            </Box>
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
                    style={{ width: isSmallScreen ? '800px' : '100%' }}
                    ref={chartRef}
                />
            )}
        </Box>
    )
}

export default BarChartsVertical
