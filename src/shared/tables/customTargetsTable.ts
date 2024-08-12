import { alpha, styled, Theme } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

function customCheckbox(theme: Theme) {
	return {
		'& .MuiCheckbox-root svg': {
			width: 16,
			height: 16,
			backgroundColor: 'transparent',
			border: `1px solid #444444`,
			borderRadius: 2,
		},
		'& .MuiCheckbox-root svg path': {
			display: 'none',
		},
		'& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
			backgroundColor: '#10745eff',
			borderColor: '#a3a3a3',
		},
		'& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
			position: 'absolute',
			display: 'table',
			border: '2px solid #fff',
			borderTop: 0,
			borderLeft: 0,
			transform: 'rotate(45deg) translate(-50%,-50%)',
			opacity: 1,
			transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
			content: '""',
			top: '50%',
			left: '39%',
			width: 5.71428571,
			height: 9.14285714,
		},
		'& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
			width: 8,
			height: 8,
			backgroundColor: '#1f3c5c',
			transform: 'none',
			top: '39%',
			border: 0,
		},
	}
}

export const CustomTargetTable = styled(DataGrid)(({ theme }) => ({
	'--DataGrid-containerBackground': '#112d49',
	'--DataGrid-rowBorderColor': '#656b6e56',

	border: 'none',
	borderRadius: 0,
	backgroundColor: '#15283b',

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
	},
	'& ::-webkit-scrollbar-thumb:hover': {
		backgroundColor: '#aeafaf63',
	},

	// Vertical scrollbar styles
	'.MuiDataGrid-scrollbar--vertical ': {
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

	'& .MuiDataGrid-columnHeaderTitleContainer': {
		justifyContent: 'space-between',
	},

	'& .MuiDataGrid-virtualScroller': {
		'& .MuiDataGrid-row': {
			'&:hover': {
				backgroundColor: '#d1d1d128',
			},
			'&.Mui-selected': {
				backgroundColor: '#03556ebe',
				'&:hover': {
					backgroundColor: '#dfdede34',
				},
			},
		},
	},

	//Striped rows
	[`& .${gridClasses.row}.even`]: {
		backgroundColor: '#172f47',
		'&:hover': {
			backgroundColor: alpha('#717274', 0.2),
			'@media (hover: none)': {
				backgroundColor: 'transparent',
			},
		},
	},

	// footer table container-navigation
	'& .MuiDataGrid-footerContainer': {
		borderTop: 'none',
		backgroundColor: '#112d49',
		'& .MuiTablePagination-root': {
			color: '#dfdfdfff',
			overflowY: 'hidden',
		},
	},
	...customCheckbox(theme),
}))
