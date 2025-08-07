import { TextFieldProps } from '@mui/material'
import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'

interface ControlledFilterFieldProps {
	name: string
	label: string
	placeholder?: string
	type?: string
	fullWidth?: boolean
	sx?: TextFieldProps['sx']
}

export const ControlledFilterField: FC<ControlledFilterFieldProps> = ({
	name,
	label,
	placeholder = '',
	type = 'text',
	fullWidth = true,
	sx = {},
}) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()

	// Функция для получения вложенных ошибок
	const getError = (name: string, errors: any) => {
		const nameParts = name.split('.')
		let currentError = errors
		for (const part of nameParts) {
			if (currentError[part]) {
				currentError = currentError[part]
			} else {
				return null
			}
		}
		return currentError
	}

	const fieldError = getError(name, errors)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<InputFilterForm
					{...field}
					label={label}
					size="small"
					type={type}
					fullWidth={fullWidth}
					placeholder={placeholder}
					error={!!fieldError}
					helperText={fieldError?.message as string}
					sx={{
						marginBottom: '10px',
						marginRight: '5px',
						...sx,
					}}
				/>
			)}
		/>
	)
}
