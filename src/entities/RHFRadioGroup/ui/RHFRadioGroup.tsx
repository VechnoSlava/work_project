import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormHelperText,
} from '@mui/material'
import { Option } from '../../../shared/constants/selectOptions'

type Props<T extends FieldValues> = {
	name: Path<T>
	label: string
	options: Option[]
}

export function RHFRadioGroup<T extends FieldValues>({ name, label, options }: Props<T>) {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => (
				<FormControl error={!!error} sx={{}}>
					<FormLabel sx={{ ml: 2 }}>{label}</FormLabel>
					<RadioGroup
						{...field}
						row={true} // horizontal layout, remove for vertical
						value={field.value || ''}
						onChange={event => field.onChange(event.target.value)}
						sx={{ ml: 2 }}
					>
						{options.map(option => (
							<FormControlLabel
								key={option.value}
								value={option.value}
								control={<Radio size="small" />}
								label={option.label}
							/>
						))}
					</RadioGroup>
					{error && <FormHelperText>{error.message}</FormHelperText>}
				</FormControl>
			)}
		/>
	)
}
