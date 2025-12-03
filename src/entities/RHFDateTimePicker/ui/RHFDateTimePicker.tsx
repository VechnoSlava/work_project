// import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import 'dayjs/locale/en-gb'

// type Props<T extends FieldValues> = {
// 	name: Path<T>
// 	label: string
// }

// export function RHFDateTimePicker<T extends FieldValues>({ name, label, ...props }: Props<T>) {
// 	const { control } = useFormContext()

// 	return (
// 		<Controller
// 			control={control}
// 			name={name}
// 			render={({ field, fieldState: { error } }) => (
// 				<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
// 					<DateTimePicker label={label} {...field} />
// 				</LocalizationProvider>
// 			)}
// 		/>
// 	)
// }
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'

type Props<T extends FieldValues> = {
	name: Path<T>
	label: string
}

export function RHFDateTimePicker<T extends FieldValues>({ name, label, ...props }: Props<T>) {
	const { control } = useFormContext()

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onBlur, onChange, ref, value }, fieldState: { error } }) => {
				return (
					<DateTimePicker
						label={label}
						// 1. Правильная передача значения
						value={value}
						// 2. Передача ref для фокуса при ошибках
						inputRef={ref}
						// 3. Обработчик изменений
						onChange={(newValue: Dayjs | null) => {
							onChange(newValue)
						}}
						// 4. Обработчик потери фокуса
						// onBlur={field.onBlur}
						// 5. Передача ошибок во внутренний TextField
						slotProps={{
							textField: {
								error: !!error,
								helperText: error?.message,
							},
						}}
						// 6. Дополнительные пропсы от родителя
						{...props}
					/>
				)
			}}
		/>
	)
}
