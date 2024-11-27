import { Box, Typography } from '@mui/material'

interface OptionTabsProps {
    options: string[]
    selectedOption: number
    onSelect: (index: number) => void
}

export default function OptionTabs({ options, selectedOption, onSelect }: OptionTabsProps) {
    return (
        <Box display="flex" gap={1}>
            {options.map((option, index) => (
                <Typography
                    key={index}
                    variant="body1"
                    sx={{
                        opacity: selectedOption === index + 1 ? 1 : 0.5,
                        borderBottom: selectedOption === index + 1 ? '2px solid #A8A8A8' : 'none',
                        cursor: 'pointer',
                    }}
                    onClick={() => onSelect(index + 1)}
                >
                    {option}
                </Typography>
            ))}
        </Box>
    )
}
