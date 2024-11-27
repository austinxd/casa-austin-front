import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { SelectInputs } from '@/components/common'
import { monthNames, yearOptions } from '@/core/utils/time-options'

interface DashboardHeaderProps {
    selectedMonth: number
    currentYear: number
    onPrevMonth: () => void
    onNextMonth: () => void
    onYearChange: (event: any) => void
}

export default function DashboardHeader({
    selectedMonth,
    currentYear,
    onPrevMonth,
    onNextMonth,
    onYearChange,
}: DashboardHeaderProps) {
    return (
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h1">Dashboard</Typography>
                <IconButton sx={{ p: 0.1 }} onClick={onPrevMonth}>
                    <ArrowBackIosNewIcon color="primary" sx={{ opacity: 0.5, fontSize: 16 }} />
                </IconButton>
                <Typography variant="body1">{monthNames[selectedMonth - 1]}</Typography>
                <IconButton sx={{ p: 0.1 }} onClick={onNextMonth}>
                    <ArrowForwardIosIcon color="primary" sx={{ opacity: 0.5, fontSize: 16 }} />
                </IconButton>
            </Box>
            <SelectInputs
                messageError=""
                variant="outlined"
                options={yearOptions}
                label="Año"
                onChange={onYearChange}
                value={currentYear}
                defaultValue={currentYear.toString()}
            />
        </Box>
    )
}
