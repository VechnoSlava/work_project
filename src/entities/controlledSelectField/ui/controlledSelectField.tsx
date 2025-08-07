import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { SelectFrequency } from '../../selectFrequency'

interface ControlledSelectFieldProps {
	name: string
	label?: string
	sx?: React.CSSProperties
}

export const ControlledSelectField: FC<ControlledSelectFieldProps> = ({
	name,
	label = 'Ед. изм.',
	sx = {},
}) => {
	const { control } = useFormContext()
	return (
		<Controller
			name={name}
			control={control}
			defaultValue="1000000"
			render={({ field }) => (
				<SelectFrequency
					{...field}
					label={label}
					sx={{
						minWidth: '80px',
						marginRight: '5px',
						...sx,
					}}
				/>
			)}
		/>
	)
}
