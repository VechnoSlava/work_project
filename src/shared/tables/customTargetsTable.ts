import { styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

export const CustomTargetTable = styled(DataGrid)({
	'&.MuiDataGrid-root': {
		// border: '1px solid #4f4f4fac ',
		border: 'none',
		borderRadius: 0,
		backgroundColor: '#112d49',
		color: '#dfdfdfff',
		// '--DataGrid-containerBackground': '#06344dff',
		'--DataGrid-rowBorderColor': '#656b6e56',
		// '& .MuiDataGrid-virtualScroller': {
		// 	'& .MuiDataGrid-columnHeaders': {},

		// 	'& .MuiDataGrid-row': {
		// 		// borderBottom: 'none',
		// 		'&:hover': {
		// 			backgroundColor: '#444',
		// 		},
		// 	},
		// },

		//footer table container-navigation
		'& .MuiDataGrid-footerContainer': {
			borderTop: 'none',
			backgroundColor: '#06344dff',
			'& .MuiTablePagination-root': {
				// height: '30px',
				// fontSize: '10px',
				color: '#dfdfdfff',
			},
		},
	},

	//Scrollbar styles
	'.MuiDataGrid-scrollbar::-webkit-scrollbar': {
		width: '12px',
		height: '12px',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-track': {
		background: '#113d4ae1',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-thumb': {
		backgroundColor: '#888',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-thumb:hover': {
		background: '#555',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-track-piece:vertical:start': {
		backgroundColor: ' #4d7fff',
	},

	// '.MuiDataGrid-virtualScroller': {
	// 	// backgroundColor: '#da1919ff',
	// 	color: '#38ff07ff',
	// 	'& .MuiDataGrid-topContainer': {
	// 		backgroundColor: '#da1919ff',
	// 		color: '#3d07ffff',
	// 	},
	// 	'& .MuiDataGrid-columnHeader': {
	// 		backgroundColor: '#da1919ff',
	// 		height: '30px',
	// 	},
	// },

	// '& .MuiDataGrid-columnsContainer': {
	// 	background: '#555',
	// },
	'& .MuiDataGrid-container--top': {
		background: '#da1919ff',
	},

	// '.MuiDataGrid-topContainer': {
	// 	background: '#555',
	// },
})
