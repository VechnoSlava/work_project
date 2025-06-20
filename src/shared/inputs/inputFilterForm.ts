import { TextField, styled } from '@mui/material'

export const InputFilterForm = styled(TextField)({
	'& .MuiFilledInput-root': {
		backgroundColor: '#80808028',
	},
	'& label.Mui-focused': {
		color: '#A0AAB4',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: '#B2BAC2',
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: '#404041',
		},
		'&:hover fieldset': {
			borderColor: '#8b8f94',
		},
		'&.Mui-focused fieldset': {
			border: '1px solid ',
			borderColor: '#457d86',
			backgroundColor: '#6d6d6d17',
		},
	},
}) as typeof TextField
