import { MenuItem, TextFieldProps } from '@mui/material'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'

const frequencyNames = [
	{
		value: '1',
		label: 'Гц',
	},
	{
		value: '1000',
		label: 'кГц',
	},
	{
		value: '1000000',
		label: 'МГц',
	},
	{
		value: '1000000000',
		label: 'ГГц',
	},
]

export const SelectFrequency = ({ ...props }) => {
	return (
		<InputFilterForm
			id="outlined-select-frequency"
			label="Ед. изм."
			select
			size="small"
			defaultValue="МГц"
			sx={{
				width: '90px',
			}}
		>
			{frequencyNames.map(option => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</InputFilterForm>
	)
}
