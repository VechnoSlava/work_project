import { IconButton, styled } from '@mui/material'

export const ButtonDeleteFilter = styled(IconButton)(({ theme }) => ({
	color: '#ac0404',
	border: '1px solid ',
	borderColor: '#404041',
	borderRadius: '5px',
	'&:hover': {
		color: '#ff0000ff',
		borderColor: '#8b8f94',
		backgroundColor: '#6d6d6d17',
	},
}))
