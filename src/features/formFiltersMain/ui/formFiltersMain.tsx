import styles from './formFiltersMain.module.scss'
import { useCallback, useEffect } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru' // или ваш локаль
import {
	FormProvider,
	SubmitErrorHandler,
	SubmitHandler,
	useFieldArray,
	useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldAccordion } from '../../../entities/fieldFilters'
import { schemaMainFiltersForm, TypeSchemaMainFiltersForm } from '../model/schema'
import { RHFTextField } from '../../../entities/RHFTextField'
import { ButtonAddBand, ButtonDeleteFilter, ButtonFormAction } from '../../../shared/buttons'
import { RiAddLargeFill, RiCloseLargeFill } from 'react-icons/ri'
import { AiOutlineDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RHFSelect } from '../../../entities/RHFSelect/ui/RHFSelect'
import {
	frequencyOptions,
	periodPulseOptions,
	selectorTypeOptions,
	timeDurationOptions,
} from '../../../shared/constants/selectOptions'
import { Stack, Box } from '@mui/material'
import { RHFDateTimePicker } from '../../../entities/RHFDateTimePicker'
import { RHFRadioGroup } from '../../../entities/RHFRadioGroup'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
	selectMainFilters,
	updateMainFilters,
} from '../../../widgets/sideMenuFilters/model/mainFiltersSlice'

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
	calendarFilter: {
		key: 3,
		filterLabel: 'Фильтрация по дате и времени',
		templateType: 'calendar',
		bands: [null, null],
	},
	selectorFilter: {
		key: 5,
		filterLabel: 'Фильтрация по типу целей',
		templateType: 'selector',
		units: {
			'0': 'нет',
			'1': 'радиоцель',
			'2': 'эталон',
			'3': 'импульсная РЛС',
			'4': 'большебазовая РЛС',
		},
		value: '0',
	},
}

export const FormFiltersMain = () => {
	console.log('render_MainForm')
	const dispatch = useAppDispatch()
	const savedFilters = useAppSelector(selectMainFilters)

	const methods = useForm<TypeSchemaMainFiltersForm>({
		resolver: zodResolver(schemaMainFiltersForm),
		mode: 'all',
		defaultValues: defaultValues,
	})
	const { control, setValue, getValues } = methods
	// Инициализация формы из Redux при загрузке компонента
	useEffect(() => {
		methods.reset(savedFilters)
	}, [methods, savedFilters])

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

	// Управление диапазонами для фильтра по периоду импульсов
	const {
		fields: pulsePeriodFields,
		append: appendPeriodPulse,
		remove: removePeriodPulse,
	} = useFieldArray({
		control: methods.control,
		name: 'pulsePeriodFilter.bands',
	})

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

	const onSubmit: SubmitHandler<TypeSchemaMainFiltersForm> = useCallback(
		data => {
			dispatch(updateMainFilters(data))

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
				pulsePeriodFilter: {
					...data.pulsePeriodFilter,
					bands: data.pulsePeriodFilter.bands.map(band => ({
						...band,
						metricPrefix: Number(band.metricPrefix),
					})),
				},
			}

			console.log('Submitted data:', transformedData)

			// Здесь отправка на сервер
		},
		[dispatch],
	)

	const onError: SubmitErrorHandler<TypeSchemaMainFiltersForm> = data => console.log('error:', data)

	// Функция для сброса конкретной даты
	const handleClearDate = useCallback(
		(index: number) => {
			const currentBands = [...getValues('calendarFilter.bands')]
			currentBands[index] = null
			setValue('calendarFilter.bands', currentBands, { shouldValidate: true })
		},
		[getValues, setValue],
	)

	// Функция сброса всех фильтров
	const resetFilters = useCallback(() => {
		methods.reset(defaultValues)
		onSubmit(defaultValues as TypeSchemaMainFiltersForm)
	}, [methods, onSubmit])

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
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

					<FieldAccordion nameField="Фильтрация по дате" id="filterDate_field">
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<RHFDateTimePicker
								name="calendarFilter.bands[0]"
								label="Начало периода"
								index={0}
								onClear={handleClearDate}
							/>
							<RHFDateTimePicker
								name="calendarFilter.bands[1]"
								label="Окончание периода"
								index={1}
								onClear={handleClearDate}
							/>
						</Box>
					</FieldAccordion>

					<FieldAccordion nameField="Фильтрация по типу целей" id="targetType_field">
						<RHFRadioGroup
							name="selectorFilter.value"
							label="Тип цели"
							options={selectorTypeOptions}
						/>
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
		</LocalizationProvider>
	)
}
