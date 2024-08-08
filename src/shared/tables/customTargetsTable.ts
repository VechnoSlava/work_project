import { styled } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

export const CustomTargetTable = styled(DataGrid)({
	'&.MuiDataGrid-root': {
		// border: '1px solid #4f4f4fac ',
		border: 'none',
		borderRadius: 0,
		backgroundColor: '#112d49',
		color: '#dfdfdfff',
		'--DataGrid-containerBackground': '#06344dff',
		'--DataGrid-rowBorderColor': '#656b6e56',
		'--DataGrid-scrollbarSize': '12px',

		// '& .MuiDataGrid-virtualScroller': {
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
		backgroundColor: '#06344dff',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-thumb': {
		backgroundColor: '#0c4c5cff',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-thumb:hover': {
		backgroundColor: '#aeafaf63',
	},

	'.MuiDataGrid-scrollbar::-webkit-scrollbar-button:vertical:decrement': {
		backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23dfdfdfff' d='M213.66 165.66a8 8 0 0 1-11.32 0L128 91.31 53.66 165.66a8 8 0 0 1-11.32-11.32l80-80a8 8 0 0 1 11.32 0l80 80a8 8 0 0 1 0 11.32z'/%3E%3C/svg%3E")`,
		backgroundSize: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-button:vertical:increment': {
		backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='%23dfdfdfff' viewBox='0 0 256 256'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'%3E%3C/path%3E%3C/svg%3E")`,
		backgroundSize: '100%',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	},
	'.MuiDataGrid-scrollbar::-webkit-scrollbar-button:vertical': {
		backgroundColor: ' #0c4c5cff',
		':hover': {
			backgroundColor: '#aeafaf63',
		},
	},
})
