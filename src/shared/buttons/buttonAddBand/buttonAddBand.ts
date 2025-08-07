import { Button, styled } from '@mui/material'

export const ButtonAddBand = styled(Button)(({ theme }) => ({
	color: '#8b8f94',
	border: '1px solid ',
	borderColor: '#404041',
	borderRadius: '5px',
	'&:hover': {
		color: '#d8d8da',
		borderColor: '#8b8f94',
		backgroundColor: '#6d6d6d17',
	},
}))
