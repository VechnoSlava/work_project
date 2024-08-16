import { createTheme } from '@mui/material'
import { ruRU } from '@mui/material/locale'

export const darkTheme = createTheme(
	{
		palette: {
			mode: 'dark',
		},
		typography: {
			// fontWeightRegular: 400,
			fontFamily: [
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			].join(','),
		},
	},
	ruRU,
)
