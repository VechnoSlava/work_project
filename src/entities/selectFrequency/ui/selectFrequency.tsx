import { forwardRef } from 'react'
import { MenuItem, TextFieldProps } from '@mui/material'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'

interface FrequencyOption {
	value: string
	label: string
}

const frequencyNames: FrequencyOption[] = [
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

const menuItems = frequencyNames.map((option, index) => (
	<MenuItem key={index} value={option.value}>
		{option.label}
	</MenuItem>
))

export const SelectFrequency = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
	return (
		<InputFilterForm
			id="outlined-select-frequency"
			label="Ед. изм."
			select
			// ref={ref}
			inputRef={ref}
			size="small"
			// defaultValue="1000000"
			{...props}
		>
			{menuItems}
		</InputFilterForm>
	)
})

SelectFrequency.displayName = 'SelectFrequency'
