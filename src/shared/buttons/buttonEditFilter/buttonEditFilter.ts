import { IconButton, styled } from '@mui/material'

export const ButtonEditFilter = styled(IconButton)(() => ({
	color: '#4fc3f7',
	border: '1px solid',
	borderColor: '#404041',
	borderRadius: '5px',
	width: '40px',
	height: '40px',
	'&:hover': {
		color: '#81d4fa',
		borderColor: '#8b8f94',
		backgroundColor: '#6d6d6d17',
	},
	'&.Mui-disabled': {
		color: '#4fc3f740',
		borderColor: '#40404140',
	},
}))
