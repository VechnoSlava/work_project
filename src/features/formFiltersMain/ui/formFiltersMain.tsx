import styles from './formFiltersMain.module.scss'
import {
	FormProvider,
	SubmitErrorHandler,
	SubmitHandler,
	useFieldArray,
	useForm,
} from 'react-hook-form'
import { FieldAccordion } from '../../../entities/fieldFilters'
import { schemaMainFiltersForm, TypeSchemaMainFiltersForm } from '../model/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { RHFTextField } from '../../../entities/RHFTextField'
import { ButtonAddBand, ButtonDeleteFilter, ButtonFormAction } from '../../../shared/buttons'
import { RiAddLargeFill, RiCloseLargeFill } from 'react-icons/ri'
import { AiOutlineDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RHFSelect } from '../../../entities/RHFSelect/ui/RHFSelect'
import {
	frequencyOptions,
	periodPulseOptions,
	timeDurationOptions,
} from '../../../shared/constants/selectOptions'
import { Stack } from '@mui/material'
import { useCallback } from 'react'

const defaultValues: TypeSchemaMainFiltersForm = {
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
	pulseDurationFilter: {
		key: 1,
		filterLabel: 'Фильтрация по длительности импульса',
		templateType: 'bands',
		units: {
			'0.001': 'мс',
			'0.000001': 'мкс',
			'0.000000001': 'нс',
		},
		bands: [],
	},
	pulsePeriodFilter: {
		key: 2,
		filterLabel: 'Фильтрация по периоду следования импульсов',
		templateType: 'bands',
		units: {
			'0.001': 'мс',
			'0.000001': 'мкс',
			'0.000000001': 'нс',
		},
		bands: [],
	},
}

export const FormFiltersMain = () => {
	console.log('render_MainForm')
	const methods = useForm<TypeSchemaMainFiltersForm>({
		resolver: zodResolver(schemaMainFiltersForm),
		mode: 'all',
		defaultValues: defaultValues,
	})

	// Управление диапазонами для частотного фильтра
	const {
		fields: freqFields,
		append: appendFreq,
		remove: removeFreq,
	} = useFieldArray({
		control: methods.control,
		name: 'freqFilter.bands',
	})

	// Управление диапазонами для фильтра длительности импульса
	const {
		fields: pulseDurationFields,
		append: appendPulseDuration,
		remove: removePulseDuration,
	} = useFieldArray({
		control: methods.control,
		name: 'pulseDurationFilter.bands',
	})

	// Управление диапазонами для фильтра длительности импульса
	const {
		fields: pulsePeriodFields,
		append: appendPeriodPulse,
		remove: removePeriodPulse,
	} = useFieldArray({
		control: methods.control,
		name: 'pulsePeriodFilter.bands',
	})

	// const appendBandFrequency = () => {
	// 	appendFreq({ start: '', stop: '', metricPrefix: '1000000' })
	// }
	// const appendBandPulseDuration = () => {
	// 	appendPulseDuration({ start: '', stop: '', metricPrefix: '0.000001' })
	// }

	// const onSubmit: SubmitHandler<TypeSchemaMainFiltersForm> = data => {
	// 	const transformedData = {
	// 		...data,
	// 		freqFilter: {
	// 			...data.freqFilter,
	// 			bands: data.freqFilter.bands.map(band => ({
	// 				...band,
	// 				metricPrefix: Number(band.metricPrefix),
	// 			})),
	// 		},
	// 		pulseDurationFilter: {
	// 			...data.pulseDurationFilter,
	// 			bands: data.pulseDurationFilter.bands.map(band => ({
	// 				...band,
	// 				metricPrefix: Number(band.metricPrefix),
	// 			})),
	// 		},
	// 	}
	// 	console.log('Submitted data:', transformedData)
	// }

	// Оптимизированные версии функций с useCallback
	const appendBandFrequency = useCallback(() => {
		appendFreq({ start: '', stop: '', metricPrefix: '1000000' }, { shouldFocus: false })
	}, [appendFreq])

	const appendBandPulseDuration = useCallback(() => {
		appendPulseDuration({ start: '', stop: '', metricPrefix: '0.000001' }, { shouldFocus: false })
	}, [appendPulseDuration])

	const appendBandPeriodPulse = useCallback(() => {
		appendPeriodPulse({ start: '', stop: '', metricPrefix: '0.000001' }, { shouldFocus: false })
	}, [appendPeriodPulse])

	const onSubmit: SubmitHandler<TypeSchemaMainFiltersForm> = useCallback(data => {
		const transformedData = {
			...data,
			freqFilter: {
				...data.freqFilter,
				bands: data.freqFilter.bands.map(band => ({
					...band,
					metricPrefix: Number(band.metricPrefix),
				})),
			},
			pulseDurationFilter: {
				...data.pulseDurationFilter,
				bands: data.pulseDurationFilter.bands.map(band => ({
					...band,
					metricPrefix: Number(band.metricPrefix),
				})),
			},
		}
		console.log('Submitted data:', transformedData)
		// Здесь отправка на сервер
	}, [])

	const onError: SubmitErrorHandler<TypeSchemaMainFiltersForm> = data => console.log('error:', data)

	// const resetForm = () => {
	// 	methods.reset(defaultValues)
	// 	onSubmit(defaultValues as TypeSchemaMainFiltersForm)
	// }
	const resetFilters = useCallback(() => {
		methods.reset(defaultValues)
		onSubmit(defaultValues as TypeSchemaMainFiltersForm)
	}, [methods, onSubmit])

	return (
		<FormProvider {...methods}>
			<form className={styles.formFilters} onSubmit={methods.handleSubmit(onSubmit, onError)}>
				<FieldAccordion nameField="Фильтрация по частоте" id="frequency_field">
					{freqFields.map((field, index) => (
						<div key={field.id} className={styles.formItem}>
							<RHFTextField
								name={`freqFilter.bands.${index}.start`}
								id={`freq-start-${index}`}
								label="Начало"
								placeholder="мин. частота"
							/>
							<RHFTextField
								name={`freqFilter.bands.${index}.stop`}
								id={`freq-stop-${index}`}
								label="Конец"
								placeholder="макс. частота"
							/>
							<RHFSelect
								name={`freqFilter.bands.${index}.metricPrefix`}
								id={`freq-metric-${index}`}
								label="Ед. изм."
								options={frequencyOptions}
							/>
							<ButtonDeleteFilter onClick={() => removeFreq(index)} type="button">
								<RiCloseLargeFill />
							</ButtonDeleteFilter>
						</div>
					))}
					<ButtonAddBand
						variant="outlined"
						startIcon={<RiAddLargeFill />}
						onClick={appendBandFrequency}
						className={styles.buttonAddBand}
					>
						Добавить диапазон
					</ButtonAddBand>
				</FieldAccordion>

				<FieldAccordion nameField="Фильтрация по длительности импульса" id="pulseDuration_field">
					{pulseDurationFields.map((field, index) => (
						<div key={field.id} className={styles.formItem}>
							<RHFTextField
								name={`pulseDurationFilter.bands.${index}.start`}
								id={`pulseDuration-start-${index}`}
								label="Начало"
								placeholder="мин. длительность"
							/>
							<RHFTextField
								name={`pulseDurationFilter.bands.${index}.stop`}
								id={`pulseDuration-stop-${index}`}
								label="Конец"
								placeholder="макс. длительность"
							/>
							<RHFSelect
								name={`pulseDurationFilter.bands.${index}.metricPrefix`}
								id={`pulseDuration-metric-${index}`}
								label="Ед. изм."
								options={timeDurationOptions}
							/>
							<ButtonDeleteFilter onClick={() => removePulseDuration(index)} type="button">
								<RiCloseLargeFill />
							</ButtonDeleteFilter>
						</div>
					))}
					<ButtonAddBand
						variant="outlined"
						startIcon={<RiAddLargeFill />}
						onClick={appendBandPulseDuration}
						className={styles.buttonAddBand}
					>
						Добавить диапазон
					</ButtonAddBand>
				</FieldAccordion>

				<FieldAccordion
					nameField="Фильтрация по периоду следования импульсов"
					id="pulsePeriod_field"
				>
					{pulsePeriodFields.map((field, index) => (
						<div key={field.id} className={styles.formItem}>
							<RHFTextField
								name={`pulsePeriodFilter.bands.${index}.start`}
								id={`pulsePeriod-start-${index}`}
								label="Начало"
								placeholder="мин. длительность"
							/>
							<RHFTextField
								name={`pulsePeriodFilter.bands.${index}.stop`}
								id={`pulsePeriod-stop-${index}`}
								label="Конец"
								placeholder="макс. длительность"
							/>
							<RHFSelect
								name={`pulsePeriodFilter.bands.${index}.metricPrefix`}
								id={`pulsePeriod-metric-${index}`}
								label="Ед. изм."
								options={periodPulseOptions}
							/>
							<ButtonDeleteFilter onClick={() => removePeriodPulse(index)} type="button">
								<RiCloseLargeFill />
							</ButtonDeleteFilter>
						</div>
					))}
					<ButtonAddBand
						variant="outlined"
						startIcon={<RiAddLargeFill />}
						onClick={appendBandPeriodPulse}
						className={styles.buttonAddBand}
					>
						Добавить диапазон
					</ButtonAddBand>
				</FieldAccordion>
				<Stack direction={'row'} justifyContent="center" spacing={2}>
					<ButtonFormAction startIcon={<AiOutlineFileDone />} type="submit">
						Применить
					</ButtonFormAction>
					<ButtonFormAction startIcon={<AiOutlineDelete />} type="button" onClick={resetFilters}>
						Сброс фильтров
					</ButtonFormAction>
				</Stack>
			</form>
		</FormProvider>
	)
}
