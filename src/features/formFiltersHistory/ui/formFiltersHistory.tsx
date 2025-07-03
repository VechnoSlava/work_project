import styles from './formFiltersHistory.module.scss'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldAccordion } from '../../../entities/fieldFilters'
import { Button } from '@mui/material'
import { ControlledFilterField } from '../../../entities/controlledFilterField'
import { ControlledSelectField } from '../../../entities/controlledSelectField'

export const FormFiltersHistory = () => {
	console.log('RenderFormHistory')
	const methods = useForm()
	// const onSubmit: SubmitHandler<IFormFiltersHistory> = data => console.log('data:', data)
	// 	const onError: SubmitErrorHandler<IFormFiltersHistory> = data => console.log('error:', data)
	const onSubmit = (data: any) => console.log('data:', data)
	const onError = (data: any) => console.log('error:', data)

	return (
		<FormProvider {...methods}>
			<form className={styles.formFilters} onSubmit={methods.handleSubmit(onSubmit, onError)}>
				<FieldAccordion nameField="Фильтрация по частоте" id="freqFilter">
					<ControlledFilterField nameField="start" labelField="мин.частота" />
					<ControlledFilterField nameField="stop" labelField="макс.частота" />
					<ControlledSelectField name="metricPrefix" />
				</FieldAccordion>
				<Button className={styles.formFilters_buttonSubmit} type="submit">
					Применить
				</Button>
			</form>
		</FormProvider>
	)
}
