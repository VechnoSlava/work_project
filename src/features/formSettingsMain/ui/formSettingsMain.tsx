import styles from './formSettingsMain.module.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
	Controller,
	FormProvider,
	SubmitErrorHandler,
	SubmitHandler,
	useFormContext,
	useForm,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldAccordion } from '@/entities/fieldFilters'
import { schemaMainSettingsForm, TypeSchemaMainSettingsForm } from '../model/schema'
import { RHFTextField } from '@/entities/RHFTextField'
import { RHFSelect } from '@/entities/RHFSelect/ui/RHFSelect'
import { attenuatorOptions } from '@/shared/constants/selectOptions'
import { AiOutlineFileDone, AiOutlineImport } from 'react-icons/ai'
import { MdOutlineCancel } from 'react-icons/md'
import { Checkbox, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { shallowEqual } from 'react-redux'
import { closeSideMenuSettings, selectSideMenuSettingsOpened } from '@/widgets/sideMenuSettings'
import { selectMainSettings, updateMainSettings } from '../model/formSettingsSlice'
import { mainSettingsDefaultValues } from '@/shared/constants/settingsDefaults'
import { ButtonFormAction } from '@/shared/buttons'
import { CustomSwitch } from '@/shared/buttons'
import { sendMessage } from '@/shared/webSocket/serverConnectionSlice'
import type { WebSocketMessage } from '@/shared/webSocket/IWebSocket'

export const FormSettingsMain = () => {
	console.log('render_SettingsForm')
	const dispatch = useAppDispatch()
	const savedSettings = useAppSelector(selectMainSettings, shallowEqual)
	const sideMenuSettingsOpened = useAppSelector(selectSideMenuSettingsOpened)

	const wasSubmittedRef = useRef(false)

	/** Имя выбранного файла для импорта (не является частью формы RHF) */
	const [importFile, setImportFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const methods = useForm<TypeSchemaMainSettingsForm>({
		resolver: zodResolver(schemaMainSettingsForm),
		mode: 'all',
		defaultValues: savedSettings,
	})
	const { control, reset } = methods

	useEffect(() => {
		if (sideMenuSettingsOpened) {
			reset(savedSettings)
			setImportFile(null)
			wasSubmittedRef.current = false
		} else {
			if (!wasSubmittedRef.current) {
				reset(savedSettings)
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
		reset(savedSettings)
		dispatch(closeSideMenuSettings())
	}, [reset, savedSettings, dispatch])

	/** Выбор файла */
	const handleFileSelect = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null
		setImportFile(file)
		// Сбрасываем input, чтобы можно было выбрать тот же файл повторно
		e.target.value = ''
	}

	/** Импорт файла — отправка на сервер (пока заглушка) */
	const handleImport = () => {
		if (!importFile) return
		// TODO: отправка файла на сервер через WebSocket или REST
		console.log('Importing file:', importFile.name)
	}

	return (
		<FormProvider {...methods}>
			<form className={styles.formSettings} onSubmit={methods.handleSubmit(onSubmit, onError)}>
				{/* ─── Аккордеон 1: Полосы приёма ─── */}
				<FieldAccordion nameField="Выбор полос приема" id="change_bands">
					<BandsTable />
				</FieldAccordion>

				{/* ─── Аккордеон 2: Тестовый сигнал ─── */}
				<FieldAccordion nameField="Включение тестового сигнала" id="signal_test">
					<div className={styles.vskRow}>
						<Controller
							name="vsk.bands.0.checked"
							control={control}
							render={({ field }) => (
								<CustomSwitch
									checked={field.value}
									onChange={e => field.onChange(e.target.checked)}
								/>
							)}
						/>
						<RHFTextField<TypeSchemaMainSettingsForm>
							name="vsk.bands.0.freq"
							label="Частота"
							id="vsk-freq"
							sx={{ maxWidth: '20px', marginRight: '5px' }}
						/>
						<span className={styles.bandUnit}>ГГц</span>
					</div>
					<div className={styles.vskNote}>
						* Тестовый (непрерывный гармонический) сигнал используется для экспресс проверки
						работоспособности фидерных трактов изделия. При этом изделие переходит из режима записи
						импульсов в режим непрерывной регистрации.
					</div>
				</FieldAccordion>

				{/* ─── Аккордеон 3: Импорт сигнатур ─── */}
				<FieldAccordion nameField="Импорт сигнатур" id="signature_import">
					<div className={styles.importerRow}>
						<div className={styles.fileName}>{importFile ? importFile.name : 'Файл не выбран'}</div>
						<ButtonFormAction type="button" onClick={handleFileSelect}>
							Выбрать
						</ButtonFormAction>
						<input
							ref={fileInputRef}
							type="file"
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
					</div>
					<div className={styles.importActions}>
						<ButtonFormAction
							startIcon={<AiOutlineImport />}
							type="button"
							onClick={handleImport}
							disabled={!importFile}
						>
							Импортировать
						</ButtonFormAction>
					</div>
				</FieldAccordion>

				{/* ─── Кнопки ─── */}
				<Stack direction={'row'} justifyContent="center" spacing={2}>
					<ButtonFormAction startIcon={<AiOutlineFileDone />} type="submit">
						Применить параметры
					</ButtonFormAction>
					<ButtonFormAction startIcon={<MdOutlineCancel />} type="button" onClick={handleCancel}>
						Отмена изменений
					</ButtonFormAction>
				</Stack>
			</form>
		</FormProvider>
	)
}

/**
 * Таблица полос приёма — вынесена в отдельный компонент
 * для чистоты и переиспользования useFormContext.
 */
const BandsTable = () => {
	const { control, watch } = useFormContext<TypeSchemaMainSettingsForm>()
	const bands = watch('bandsFilter.bands')

	return (
		<div>
			{bands.map((band, index) => (
				<div key={band.id} className={styles.bandRow}>
					<Controller
						name={`bandsFilter.bands.${index}.checked`}
						control={control}
						render={({ field }) => (
							<Checkbox
								checked={field.value}
								onChange={e => field.onChange(e.target.checked)}
								// size="small"
								sx={{
									padding: '2px',
									color: '#5a7a8f',
									'&.Mui-checked': { color: '#4fc3f7' },
								}}
							/>
						)}
					/>
					<span className={styles.bandLabel}>{band.band} ГГц</span>
					<RHFTextField<TypeSchemaMainSettingsForm>
						name={`bandsFilter.bands.${index}.time`}
						label="Время, сек"
						id={`band-time-${index}`}
						sx={{ width: 40, marginRight: '5px' }}
					/>
					<RHFSelect<TypeSchemaMainSettingsForm>
						name={`bandsFilter.bands.${index}.attenuator`}
						options={attenuatorOptions}
						label="Ослабление"
						id={`band-att-${index}`}
						sx={{ minWidth: 120 }}
					/>
				</div>
			))}
		</div>
	)
}

/**
 * Трансформирует данные формы в серверный формат.
 * attenuator и time приводятся к числам, importer не отправляется.
 */
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
