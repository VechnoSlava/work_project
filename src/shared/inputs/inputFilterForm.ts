import { TextField, styled } from '@mui/material'

export const InputFilterForm = styled(TextField)({
	'& .MuiFilledInput-root': {
		backgroundColor: '#80808028',
	},
	'& label.Mui-focused': {
		color: '#A0AAB4',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: '#B2BAC2',
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: '#404041',
		},
		'&:hover fieldset': {
			borderColor: '#8b8f94',
		},
		'&.Mui-focused fieldset': {
			border: '1px solid ',
			borderColor: '#457d86',
			backgroundColor: '#6d6d6d17',
		},
	},
})

// export const InputFilterForm = styled(TextField)({
// 	'& .MuiTextField-root': {
// 		backgroundColor: 'white',
// 		color: 'white',
// 	},
// 	'& .MuiFormLabel-root': {
// 		color: '#999999e7',
// 		'&:focused': {
// 			color: '#2f7e7ae7',
// 		},
// 	},

// 	'& .MuiInputBase-input': {
// 		backgroundColor: '#05544fdd',
// 		'&:focused': {
// 			// color: "#fff",
// 		},
// 	},
// 	'& .MuiFilledInput-root': {
// 		// backgroundColor: '#08781bdd',

// 		color: '#fff',
// 		'&:hover': {
// 			borderBottom: '1px solid #fff',
// 		},
// 		'&:before': {
// 			borderBottom: '1px solid #999999e7',
// 			// backgroundColor: "white",
// 		},
// 		'&:after': {
// 			borderBottom: '2px solid #fff',
// 			// backgroundColor: "white",
// 		},
// 	},
// })
