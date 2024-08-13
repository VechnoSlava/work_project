import { alpha, styled, Theme } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

function customCheckbox(theme: Theme) {
	return {
		[`& .${gridClasses.checkboxInput}`]: {
			'& svg': {
				width: 12,
				height: 12,
				border: `1px solid #444444`,
				borderRadius: 2,
			},
			'& svg path': {
				display: 'none',
			},
			'&.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
				backgroundColor: '#10745eff',
				borderColor: '#a3a3a3',
			},
		},
	}
}

export const CustomTargetTable = styled(DataGrid)(({ theme }) => ({
	//root styles table
	'--DataGrid-containerBackground': '#112d49',
	'--DataGrid-rowBorderColor': '#656b6e56',
	backgroundColor: '#15283b',
	border: 'none',
	borderRadius: 0,

	//Scrollbar styles
	'& ::-webkit-scrollbar': {
		width: '12px',
		height: '12px',
	},
	'& ::-webkit-scrollbar-track': {
		backgroundColor: '#06344dff',
	},
	'& ::-webkit-scrollbar-thumb': {
		backgroundColor: '#0c4c5cff',
		'&:hover': {
			backgroundColor: '#aeafaf63',
		},
	},

	// Vertical scrollbar styles
	'.MuiDataGrid-scrollbar--vertical': {
		width: '12px',
		'& .MuiDataGrid-scrollbarContent': {
			width: '12px',
			display: 'block',
		},
	},
	'& ::-webkit-scrollbar-button:vertical': {
		backgroundColor: ' #0c4c5cff',
		':hover': {
			backgroundColor: '#587c7cff',
		},
	},
	'& ::-webkit-scrollbar-button:vertical:decrement': {
		backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23dfdfdfff' d='M213.66 165.66a8 8 0 0 1-11.32 0L128 91.31 53.66 165.66a8 8 0 0 1-11.32-11.32l80-80a8 8 0 0 1 11.32 0l80 80a8 8 0 0 1 0 11.32z'/%3E%3C/svg%3E")`,
		backgroundSize: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	},
	'& ::-webkit-scrollbar-button:vertical:increment': {
		backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='%23dfdfdfff' viewBox='0 0 256 256'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'%3E%3C/path%3E%3C/svg%3E")`,
		backgroundSize: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	},

	// Horizontal scrollbar styles
	'& .MuiDataGrid-scrollbar--horizontal': {
		height: '12px',
		'& .MuiDataGrid-scrollbarContent': {
			display: 'block',
			height: '12px',
		},
	},

	// styles header column
	[`& .${gridClasses.columnHeaderTitleContainer}`]: {
		justifyContent: 'space-between',
	},

	[`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
		outline: 'none',
	},

	// styles rows
	[`& .${gridClasses.row}`]: {
		fontSize: 12,
		fontWeight: 400,
		[`&:hover`]: {
			backgroundColor: '#d1d1d128',
		},
		[`&.Mui-selected`]: {
			backgroundColor: '#03556ebe',
			[`&:hover`]: {
				backgroundColor: '#dfdede34',
			},
		},
		[`&.even`]: {
			backgroundColor: '#172f47',
			[`&:hover`]: {
				backgroundColor: alpha('#717274', 0.2),
				'@media (hover: none)': {
					backgroundColor: 'transparent',
				},
			},
		},
	},

	// styles cells
	[`& .${gridClasses.cell}`]: {
		fontSize: 12,
		fontWeight: 400,
		[`&:focus, &:focus-within`]: {
			outline: 'none',
		},
	},

	// footer table container-navigation
	[`& .${gridClasses.footerContainer}`]: {
		borderTop: 'none',
		backgroundColor: '#112d49',
		[`& .MuiTablePagination-root`]: {
			color: '#dfdfdfff',
			overflowY: 'hidden',
		},
	},

	[`& .${gridClasses.virtualScroller}`]: {
		[`& .${gridClasses.row}`]: {
			[`&:hover`]: {
				backgroundColor: '#d1d1d128',
			},
			[`&.Mui-selected`]: {
				backgroundColor: '#03556ebe',
				[`&:hover`]: {
					backgroundColor: '#dfdede34',
				},
			},
		},
	},
	...customCheckbox(theme),
}))
