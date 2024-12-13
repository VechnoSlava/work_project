import styles from './formFiltersSideMenu.module.css'
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'
import { FieldAccordion } from '../../../entities/fieldFilters'
import { SelectFrequency } from '../../../entities/selectFrequency'

interface IFormFilters {
	minFrequency: Number
	maxFrequency: Number
	metricPrefix: Number
	deleteFilter: boolean
	minT: Number
	maxT: Number
}

export const FormFiltersSideMenu = () => {
	const {
		handleSubmit,
		formState: { errors },
		control,
		register,
	} = useForm<IFormFilters>({
		mode: 'all',
	})

	const onSubmit: SubmitHandler<IFormFilters> = data => console.log('data:', data)
	const onError: SubmitErrorHandler<IFormFilters> = data => console.log('error:', data)

	return (
		<>
			<form className={styles.formFilters} onSubmit={handleSubmit(onSubmit, onError)}>
				<FieldAccordion nameField="Фильтрация по частоте" id="frequency_field">
					<Controller
						name="minFrequency"
						rules={{ required: 'Поле обязательно для ввода' }}
						control={control}
						render={({ field }) => (
							<InputFilterForm
								size="small"
								label="Начало"
								{...field}
								// helperText={
								// 	errors.minFrequency ? errors.minFrequency?.message : 'Начальная частота'
								// }
								error={!!errors.minFrequency}
								sx={{
									marginRight: '10px',
									width: '180px',
								}}
							/>
						)}
					/>
					<Controller
						name="maxFrequency"
						control={control}
						render={({ field }) => (
							<InputFilterForm
								{...field}
								size="small"
								label="Конец"
								// helperText={errors.maxFrequency ? errors.maxFrequency?.message : 'Конечная частота'}
								sx={{
									marginRight: '10px',
									width: '180px',
								}}
							/>
						)}
					/>
					<Controller
						name="metricPrefix"
						control={control}
						render={({ field }) => <SelectFrequency inputRef={register} {...field} />}
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
