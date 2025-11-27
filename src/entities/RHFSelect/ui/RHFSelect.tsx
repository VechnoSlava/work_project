import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'
import { MenuItem, TextFieldProps } from '@mui/material'
import { Option } from '../../../shared/constants/selectOptions'

type Props<T extends FieldValues> = {
	name: Path<T>
	options: Option[]
} & Pick<TextFieldProps, 'label' | 'id' | 'sx'>

export function RHFSelect<T extends FieldValues>({ name, options, label, id, ...props }: Props<T>) {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => (
				<InputFilterForm
					{...field}
					aria-label={id}
					select
					size="small"
					id={id}
					label={label}
					error={!!error}
					helperText={error?.message}
					sx={{ minWidth: '80px', marginRight: '5px' }}
					{...props}
				>
					{options.map((option, index) => (
						<MenuItem key={index} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</InputFilterForm>
			)}
		/>
	)
}
