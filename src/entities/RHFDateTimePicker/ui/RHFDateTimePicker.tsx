import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import { Box, IconButton } from '@mui/material'
import { MdClear } from 'react-icons/md'

type Props<T extends FieldValues> = {
	name: Path<T>
	label: string
	index: number // Индекс в массиве bands
	onClear: (index: number) => void // Функция сброса
}

export function RHFDateTimePicker<T extends FieldValues>({
	name,
	label,
	index,
	onClear,
	...props
}: Props<T>) {
	const { control, setValue } = useFormContext()

	// Локальная функция сброса
	const handleClear = () => {
		setValue(name, null as any, { shouldValidate: true })
		onClear(index)
	}

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => {
				// Преобразуем строку в Dayjs для отображения
				const value = field.value ? dayjs(field.value) : null

				return (
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
						<DateTimePicker
							label={label}
							value={value}
							onChange={(newValue: Dayjs | null) => {
								const isoValue = newValue ? newValue.toISOString() : null
								field.onChange(isoValue)
							}}
							onClose={() => {
								field.onBlur()
							}}
							inputRef={field.ref}
							slotProps={{
								textField: {
									size: 'small',
									error: !!error,
									helperText: error?.message,
									sx: {
										width: '240px',
										mr: 1,
									},
									onBlur: field.onBlur,
								},
							}}
							{...props}
						/>
						<IconButton
							onClick={handleClear}
							sx={{
								visibility: field.value ? 'visible' : 'hidden', // Показываем только если есть значение
							}}
						>
							<MdClear />
						</IconButton>
					</Box>
				)
			}}
		/>
	)
}
