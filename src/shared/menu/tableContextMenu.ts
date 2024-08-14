import { Menu, styled } from '@mui/material'

export const MenuContextTable = styled(Menu)(({ theme }) => ({
	'.MuiList-root': {
		backgroundColor: '#144855',
		borderRadius: 4,
		color: '#c6c6c7',
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		padding: '4px 0',
		'& .MuiButtonBase-root': {
			fontSize: 16,
			padding: '4px 10px',
			'&:hover': {
				color: '#ffffff',
			},
		},
		'& svg': {
			marginRight: 4,
		},
	},
}))
