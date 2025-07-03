import { TextField } from '@mui/material'
import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { SelectFrequency } from '../../selectFrequency'

interface IControlledSelect {
	name: string
}

export const ControlledSelectField: FC<IControlledSelect> = ({ name }) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<SelectFrequency
					{...field}
					sx={{
						minWidth: '80px',
					}}
				/>
			)}
		/>
	)
}
