import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { Checkbox, CheckboxProps } from '@mui/material'

type Props<T extends FieldValues> = {
	name: Path<T>
} & Omit<CheckboxProps, 'name' | 'checked' | 'onChange'>

export function RHFCheckbox<T extends FieldValues>({ name, ...props }: Props<T>) {
	const { control } = useFormContext()

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Checkbox
					{...props}
					checked={field.value}
					onChange={e => field.onChange(e.target.checked)}
				/>
			)}
		/>
	)
}
