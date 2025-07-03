import { TextField } from '@mui/material'
import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

interface IControlledField {
	nameField: string
	labelField: string
}

export const ControlledFilterField: FC<IControlledField> = ({ nameField, labelField }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()
	return (
		<Controller
			control={control}
			defaultValue={''}
			name={nameField}
			render={({ field }) => (
				<TextField
					{...field}
					label={labelField}
					variant="outlined"
					error={!!errors.nameField}
					placeholder="Поле ввода"
				/>
			)}
		/>
	)
}
