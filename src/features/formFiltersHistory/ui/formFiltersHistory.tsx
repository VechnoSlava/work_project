import styles from './formFiltersHistory.module.scss'
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { FieldAccordion } from '../../../entities/fieldFilters'
import { Button, IconButton, Typography } from '@mui/material'
import { ControlledFilterField } from '../../../entities/controlledFilterField'
import { ControlledSelectField } from '../../../entities/controlledSelectField'
import { schemaFiltersHistory, TypeSchemaFiltersHistory } from '../model/schemaFiltersHistory'
import { zodResolver } from '@hookform/resolvers/zod'
import { RiAddLargeFill, RiCloseLargeFill, RiDeleteBin2Line } from 'react-icons/ri'
import { ButtonAddBand, ButtonDeleteFilter } from '../../../shared/buttons'

export const FormFiltersHistory = () => {
	console.log('RenderFormHistory')
	const methods = useForm<TypeSchemaFiltersHistory>({
		resolver: zodResolver(schemaFiltersHistory),
		defaultValues: {
			freqFilter: {
				key: 0,
				filterLabel: 'Фильтрация по частоте',
				templateType: 'bands',
				units: {
					'1': 'Гц',
					'1000': 'кГц',
					'1000000': 'МГц',
					'1000000000': 'ГГц',
				},
				bands: [],
			},
		},
	})

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: 'freqFilter.bands',
	})

	const handleAddBand = () => {
		append({ start: '', stop: '', metricPrefix: '1000000000' })
	}

	const onSubmit: SubmitHandler<TypeSchemaFiltersHistory> = data => {
		// Преобразуем строки в числа
		const transformedData = {
			...data,
			freqFilter: {
				...data.freqFilter,
				bands: data.freqFilter.bands.map(band => ({
					...band,
					metricPrefix: Number(band.metricPrefix),
				})),
			},
		}
		console.log('Submitted data:', transformedData)
	}
	const onError = (errors: any) => console.log('Form errors:', errors)

	return (
		<FormProvider {...methods}>
			<form className={styles.formFilters} onSubmit={methods.handleSubmit(onSubmit, onError)}>
				<FieldAccordion nameField="Фильтрация по частоте" id="freqFilter">
					{fields.map((field, index) => (
						<div key={field.id} className={styles.item_li}>
							<ControlledFilterField
								name={`freqFilter.bands.${index}.start`}
								label="Начало"
								placeholder="мин. частота"
								fullWidth={true}
							/>
							<ControlledFilterField
								name={`freqFilter.bands.${index}.stop`}
								label="Конец"
								placeholder="макс. частота"
								fullWidth={true}
							/>
							<ControlledSelectField
								name={`freqFilter.bands.${index}.metricPrefix`}
								sx={{ minWidth: '80px' }}
							/>
							<ButtonDeleteFilter onClick={() => remove(index)}>
								<RiCloseLargeFill />
							</ButtonDeleteFilter>
						</div>
					))}

					<ButtonAddBand
						variant="outlined"
						startIcon={<RiAddLargeFill />}
						onClick={handleAddBand}
						className={styles.buttonAddBand}
					>
						Добавить диапазон
					</ButtonAddBand>
				</FieldAccordion>
				<Button className={styles.formFilters_buttonSubmit} type="submit" color="primary">
					Применить
				</Button>
			</form>
		</FormProvider>
	)
}
