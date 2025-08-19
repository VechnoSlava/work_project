import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'
import { TextFieldProps } from '@mui/material'

type Props<T extends FieldValues> = {
	name: Path<T>
} & Pick<TextFieldProps, 'label' | 'placeholder' | 'sx' | 'fullWidth'>

export function RHFTextField<T extends FieldValues>({
	name,
	label,
	fullWidth = true,
	...props
}: Props<T>) {
	const { control } = useFormContext()

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<InputFilterForm
					{...field}
					{...props}
					label={label}
					size="small"
					fullWidth={fullWidth}
					error={!!error}
					helperText={error?.message}
					sx={{
						marginBottom: '10px',
						marginRight: '5px',
					}}
				/>
			)}
		/>
	)
}
