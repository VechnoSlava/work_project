import { ToggleButton, styled } from '@mui/material'

export const ButtonMenuHead = styled(ToggleButton)({
	padding: '10px',
	width: '60px',
	height: '60px',
	color: '#fff',
	border: '1px solid #737373',
	boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
	'&:hover': {
		backgroundColor: '#0000003d',
	},
})
