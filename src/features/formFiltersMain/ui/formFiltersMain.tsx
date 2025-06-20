import styles from './formFiltersMain.module.css'
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'
import { FieldAccordion } from '../../../entities/fieldFilters'
import { SelectFrequency } from '../../../entities/selectFrequency'

interface IFormFiltersMain {
	minFrequency: number
	maxFrequency: number
	metricPrefix: string
	deleteFilter: boolean
	minT: number
	maxT: number
}

export const FormFiltersMain = () => {
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<IFormFiltersMain>({
		mode: 'all',
		defaultValues: {
			minFrequency: 0,
			maxFrequency: 0,
			metricPrefix: '1000000',
			deleteFilter: false,
			minT: 0,
			maxT: 0,
		},
	})

	const onSubmit: SubmitHandler<IFormFiltersMain> = data => console.log('data:', data)
	const onError: SubmitErrorHandler<IFormFiltersMain> = data => console.log('error:', data)

	console.log('renderForm')

	return (
		<>
			<form className={styles.formFilters} onSubmit={handleSubmit(onSubmit, onError)}>
				<FieldAccordion nameField="Фильтрация по частоте" id="frequency_field">
					<Controller
						name="minFrequency"
						control={control}
						rules={{ required: 'Поле обязательно для ввода' }}
						render={({ field }) => (
							<InputFilterForm
								{...field}
								size="small"
								label="Начало"
								placeholder="Введите частоту"
								// onChange={e => field.onChange(Number(e.target.value))}
								helperText={errors?.minFrequency?.message}
								error={!!errors.minFrequency}
								sx={{
									marginRight: '10px',
								}}
							/>
						)}
					/>
					<Controller
						name="maxFrequency"
						control={control}
						rules={{ required: 'Поле обязательно для ввода' }}
						render={({ field }) => (
							<InputFilterForm
								{...field}
								// onChange={e => field.onChange(Number(e.target.value))}
								size="small"
								label="Конец"
								placeholder="Введите частоту"
								helperText={errors?.maxFrequency?.message}
								error={!!errors.maxFrequency}
								sx={{
									marginRight: '10px',
								}}
							/>
						)}
					/>
					<Controller
						name="metricPrefix"
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
				</FieldAccordion>

				<FieldAccordion nameField="Фильтрация по длительности импульса" id="pulseTime_field">
					<Controller
						name="minT"
						control={control}
						render={({ field }) => <InputFilterForm {...field} />}
					/>
					<Controller
						name="maxT"
						control={control}
						render={({ field }) => <InputFilterForm {...field} />}
					/>
				</FieldAccordion>

				<button className={styles.formFilters__buttonSubmit} type="submit">
					Применить
				</button>
			</form>
		</>
	)
}
