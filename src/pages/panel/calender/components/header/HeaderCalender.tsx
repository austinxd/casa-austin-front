import { Box, IconButton, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

interface Props {
    setCurrentYear: React.Dispatch<React.SetStateAction<number>>
    currentYear: number
    dataHouse: any
    filterHousesCalender: (e: string) => void
    itemsSelect: string[]
}

export default function HeaderCalender({
    currentYear,
    dataHouse,
    filterHousesCalender,
    itemsSelect,
    setCurrentYear,
}: Props) {
    return (
        <Box
            sx={{
                maxWidth: 1200,
                position: 'fixed',
                width: {
                    md: 'calc(100% - 242px)',
                    sm: 'calc(100% - 242px)',
                    xs: 'calc(100% - 32px)',
                },
                zIndex: 100,
                top: { md: 0, sm: 0, xs: 50 },
                pt: 2,
                background: 'white',
            }}
        >
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant="h1" mb={{ md: 1, sm: 1, xs: 1 }}>
                    Disponibilidad
                </Typography>
                <Box display={'flex'} ml={'auto'} alignItems={'center'} gap={1}>
                    <IconButton size="small" onClick={() => setCurrentYear((prev) => prev - 1)}>
                        <ArrowBackIosIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                    <Typography variant="body2">{currentYear}</Typography>
                    <IconButton size="small" onClick={() => setCurrentYear((prev) => prev + 1)}>
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                </Box>
            </Box>

            <Box>
                <Box display={'flex'} gap={{ md: 3, xs: 1 }} my={{ md: 3, sm: 2, xs: 1 }}>
                    {dataHouse?.free_days_per_house.map((item: any) => (
                        <Box
                            key={item.property__background_color}
                            display={'flex'}
                            sx={{ cursor: 'pointer' }}
                            alignItems={'center'}
                            onClick={() => filterHousesCalender(item.casa)}
                        >
                            <Box
                                height={14}
                                width={14}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    mr: 0.5,
                                    mb: 0.2,
                                    backgroundColor: itemsSelect.find((e) => e === item.casa)
                                        ? 'white'
                                        : item.property__background_color,
                                    padding: '4px',
                                    border: `4px solid ${
                                        itemsSelect.find((e) => e === item.casa)
                                            ? item.property__background_color
                                            : 'transparent'
                                    }`,
                                    boxSizing: 'border-box',
                                }}
                            />

                            <Typography fontSize={15} fontWeight={400}>
                                {item.casa.replace('Austin', '')}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    background: '#82C9E2',
                    display: 'flex',
                    textAlign: 'center',
                    p: 1,
                    borderRadius: 1.5,
                }}
            >
                <Typography sx={{ flex: 1 }}>L</Typography>
                <Typography sx={{ flex: 1 }}>M</Typography>
                <Typography sx={{ flex: 1 }}>M</Typography>
                <Typography sx={{ flex: 1 }}>J</Typography>
                <Typography sx={{ flex: 1 }}>V</Typography>
                <Typography sx={{ flex: 1 }}>S</Typography>
                <Typography sx={{ flex: 1 }}>D</Typography>
            </Box>
        </Box>
    )
}
