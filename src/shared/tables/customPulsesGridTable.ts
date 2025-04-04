import { alpha, styled, TableCell, TableRow } from '@mui/material'

// Стилизация строк
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	fontSize: 12,
	fontWeight: 400,
	'&:hover': {
		backgroundColor: '#d1d1d128 !important',
	},
	'&.Mui-selected': {
		backgroundColor: '#03556ebe !important',
		'&:hover': {
			backgroundColor: '#dfdede34 !important',
		},
	},
	'&.even': {
		backgroundColor: '#172f47',
		'&:hover': {
			backgroundColor: alpha('#717274', 0.2),
			'@media (hover: none)': {
				backgroundColor: 'transparent',
			},
		},
	},
}))

// Стилизация ячеек
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	fontSize: 12,
	fontWeight: 400,
	borderColor: '#656b6e56',
	'&:focus, &:focus-within': {
		outline: 'none',
	},
}))

// Стилизация заголовков
export const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
	backgroundColor: '#112d49',
	color: theme.palette.common.white,
	fontSize: 14,
	fontWeight: 400,
	borderColor: '#656b6e56',
}))
