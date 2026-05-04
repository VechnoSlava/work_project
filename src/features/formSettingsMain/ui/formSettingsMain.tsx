import styles from './formSettingsMain.module.scss'
import { useCallback, useEffect, useRef } from 'react'
import {
	FormProvider,
	SubmitErrorHandler,
	SubmitHandler,
	useForm,
	useFormContext,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldAccordion } from '@/entities/fieldFilters'
import { schemaMainSettingsForm, TypeSchemaMainSettingsForm } from '../model/schema'
import { RHFTextField } from '@/entities/RHFTextField'
import { RHFSelect } from '@/entities/RHFSelect/ui/RHFSelect'
import { RHFCheckbox } from '@/entities/RHFCheckbox'
import { RHFSwitch } from '@/entities/RHFSwitch'
import { attenuatorOptions } from '@/shared/constants/selectOptions'
import { AiOutlineFileDone } from 'react-icons/ai'
import { MdOutlineCancel } from 'react-icons/md'
import { Stack, FormHelperText } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { shallowEqual } from 'react-redux'
import { closeSideMenuSettings, selectSideMenuSettingsOpened } from '@/widgets/sideMenuSettings'
import { selectMainSettings, updateMainSettings } from '../model/formSettingsSlice'
import { mainSettingsDefaultValues } from '@/shared/constants/settingsDefaults'
import { ButtonFormAction } from '@/shared/buttons'
import { sendMessage } from '@/shared/webSocket/serverConnectionSlice'
import type { WebSocketMessage } from '@/shared/webSocket/IWebSocket'

/** Скрывает встроенный helperText у MUI TextField */
const hideBuiltInHelper = {
	'& .MuiFormHelperText-root': { display: 'none' },
}

export const FormSettingsMain = () => {
	console.log('render_SettingsForm')
	const dispatch = useAppDispatch()
	const savedSettings = useAppSelector(selectMainSettings, shallowEqual)
	const sideMenuSettingsOpened = useAppSelector(selectSideMenuSettingsOpened)

	const wasSubmittedRef = useRef(false)
	const bands = mainSettingsDefaultValues.bandsFilter.bands

	const methods = useForm<TypeSchemaMainSettingsForm>({
		resolver: zodResolver(schemaMainSettingsForm),
		mode: 'all',
		defaultValues: savedSettings,
	})

	useEffect(() => {
		if (sideMenuSettingsOpened) {
			methods.reset(savedSettings)
			wasSubmittedRef.current = false
		} else {
			if (!wasSubmittedRef.current) {
				methods.reset(savedSettings)
			}
		}
	}, [sideMenuSettingsOpened])

	const onSubmit: SubmitHandler<TypeSchemaMainSettingsForm> = useCallback(
		data => {
			wasSubmittedRef.current = true
			dispatch(updateMainSettings(data))

			const serverData = transformSettingsForServer(data)
			const message: WebSocketMessage = { id: 100, data: serverData }

			dispatch(sendMessage(message))
			console.log('Settings sent:', message)
			dispatch(closeSideMenuSettings())
		},
		[dispatch],
	)

	const onError: SubmitErrorHandler<TypeSchemaMainSettingsForm> = data =>
		console.log('error:', data)

	const handleCancel = useCallback(() => {
		methods.reset(savedSettings)
		dispatch(closeSideMenuSettings())
	}, [methods, savedSettings, dispatch])

	return (
		<FormProvider {...methods}>
			<form className={styles.formSettings} onSubmit={methods.handleSubmit(onSubmit, onError)}>
				{/* ─── Выбор полос приёма ─── */}
				<FieldAccordion nameField="Выбор полос приема" id="change_bands">
					{bands.map((band, index) => (
						<BandRow key={band.id} index={index} bandLabel={band.band} />
					))}
				</FieldAccordion>

				{/* ─── Включение тестового сигнала ─── */}
				<FieldAccordion nameField="Включение тестового сигнала" id="signal_test">
					<VskSection />
				</FieldAccordion>

				{/* ─── Кнопки ─── */}
				<Stack direction={'row'} justifyContent="center" spacing={1}>
					<ButtonFormAction
						startIcon={<AiOutlineFileDone />}
						type="submit"
						size="small"
						sx={{ padding: '5px 8px' }}
					>
						Применить параметры
					</ButtonFormAction>
					<ButtonFormAction
						startIcon={<MdOutlineCancel />}
						type="button"
						onClick={handleCancel}
						size="small"
						sx={{ padding: '5px 8px' }}
					>
						Отменить изменения
					</ButtonFormAction>
				</Stack>
			</form>
		</FormProvider>
	)
}

/**
 * Строка полосы приёма.
 * Ошибка поля «Время» выводится под всей строкой, а не под инпутом.
 */
const BandRow = ({ index, bandLabel }: { index: number; bandLabel: string }) => {
	const {
		formState: { errors },
	} = useFormContext<TypeSchemaMainSettingsForm>()

	const timeError = errors.bandsFilter?.bands?.[index]?.time?.message

	return (
		<div className={styles.bandRowWrapper}>
			<div className={styles.bandRow}>
				<RHFCheckbox<TypeSchemaMainSettingsForm>
					name={`bandsFilter.bands.${index}.checked`}
					size="medium"
					sx={{
						padding: '2px',
						color: '#5a7a8f',
						'&.Mui-checked': { color: '#4fc3f7' },
					}}
				/>
				<span className={styles.bandLabel}>{bandLabel} ГГц</span>
				<RHFTextField<TypeSchemaMainSettingsForm>
					name={`bandsFilter.bands.${index}.time`}
					label="Время, сек"
					id={`band-time-${index}`}
					sx={{ maxWidth: 140, ...hideBuiltInHelper }}
				/>
				<RHFSelect<TypeSchemaMainSettingsForm>
					name={`bandsFilter.bands.${index}.attenuator`}
					options={attenuatorOptions}
					label="Ослабление"
					id={`band-att-${index}`}
					sx={{ minWidth: 100, marginRight: '10px' }}
				/>
			</div>
			{timeError && (
				<FormHelperText error sx={{ userSelect: 'none' }}>
					{timeError}
				</FormHelperText>
			)}
		</div>
	)
}

/**
 * Секция тестового сигнала.
 * Ошибка поля «Частота» выводится под всей строкой.
 */
const VskSection = () => {
	const {
		formState: { errors },
	} = useFormContext<TypeSchemaMainSettingsForm>()

	const freqError = errors.vsk?.bands?.[0]?.freq?.message

	return (
		<>
			<div className={styles.vskRow}>
				<RHFSwitch<TypeSchemaMainSettingsForm> name="vsk.bands.0.checked" />
				<RHFTextField<TypeSchemaMainSettingsForm>
					name="vsk.bands.0.freq"
					label="Частота"
					id="vsk-freq"
					sx={{ maxWidth: 120, ...hideBuiltInHelper }}
				/>
				<span className={styles.bandUnit}>ГГц</span>
			</div>
			{freqError && (
				<FormHelperText error sx={{ userSelect: 'none' }}>
					{freqError}
				</FormHelperText>
			)}
			<div className={styles.vskNote}>
				* Тестовый (непрерывный гармонический) сигнал используется для экспресс проверки
				работоспособности фидерных трактов изделия. При этом изделие переходит из режима записи
				импульсов в режим непрерывной регистрации.
			</div>
		</>
	)
}

/** Трансформер формы → серверный формат */
const transformSettingsForServer = (data: TypeSchemaMainSettingsForm) => ({
	bandsFilter: {
		...data.bandsFilter,
		bands: data.bandsFilter.bands.map(band => ({
			...band,
			time: Number(band.time),
			attenuator: Number(band.attenuator),
		})),
	},
	vsk: {
		...data.vsk,
		bands: data.vsk.bands.map(item => ({
			...item,
			freq: Number(item.freq),
		})),
	},
})
