import styles from './formFiltersSideMenu.module.css'
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'
import { FieldAccordion } from '../../../entities/fieldFilters'

interface IFormFilters {
	minFrequency: Number
	maxFrequency: Number
	minT: Number
	maxT: Number
}

export const FormFiltersSideMenu = () => {
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<IFormFilters>({
		mode: 'onBlur',
	})

	const onSubmit: SubmitHandler<IFormFilters> = data => console.log(data)
	const onError: SubmitErrorHandler<IFormFilters> = data => console.log(data)

	return (
		<>
			<form className={styles.formFilters} onSubmit={handleSubmit(onSubmit, onError)}>
				<FieldAccordion nameField="Фильтрация по частоте" id="frequency_field">
					<Controller
						name="minFrequency"
						control={control}
						render={({ field }) => <InputFilterForm size="small" label="начало" {...field} />}
					/>
					<Controller
						name="maxFrequency"
						control={control}
						render={({ field }) => <InputFilterForm size="small" label="конец" {...field} />}
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
