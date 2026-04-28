import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { SwitchProps } from '@mui/material'
import { CustomSwitch } from '@/shared/buttons'

type Props<T extends FieldValues> = {
	name: Path<T>
} & Omit<SwitchProps, 'name' | 'checked' | 'onChange'>

export function RHFSwitch<T extends FieldValues>({ name, ...props }: Props<T>) {
	const { control } = useFormContext()

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<CustomSwitch
					{...props}
					checked={field.value}
					onChange={e => field.onChange(e.target.checked)}
				/>
			)}
		/>
	)
}
