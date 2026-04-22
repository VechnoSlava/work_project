import styles from './formSettingsMain.module.scss'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru' // или ваш локаль
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldAccordion } from '@/entities/fieldFilters'
import { schemaMainSettingsForm, TypeSchemaMainSettingsForm } from '../model/schema'
import { AiOutlineFileDone } from 'react-icons/ai'
import { MdOutlineCancel } from 'react-icons/md'
import { Stack, Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { shallowEqual } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import { closeSideMenuSettings, selectSideMenuSettingsOpened } from '@/widgets/sideMenuSettings'
import { selectMainSettings, updateMainSettings } from '../model/formSettingsSlice'
import { mainSettingsDefaultValues } from '@/shared/constants/settingsDefaults'
import { ButtonFormAction } from '@/shared/buttons'

export const FormSettingsMain = () => {
	console.log('render_SettingsForm')
	const dispatch = useAppDispatch()
	const savedSettings = useAppSelector(selectMainSettings, shallowEqual)
	const sideMenuSettingsOpened = useAppSelector(selectSideMenuSettingsOpened)

	/** Флаг: были ли фильтры применены (submit) в этой сессии открытия меню */
	const wasSubmittedRef = useRef(false)

	const methods = useForm<TypeSchemaMainSettingsForm>({
		resolver: zodResolver(schemaMainSettingsForm),
		mode: 'all',
		defaultValues: savedSettings,
	})
	const { setValue, getValues, reset } = methods

	useEffect(() => {
		if (sideMenuSettingsOpened) {
			// Меню открылось — синхронизируем форму с Redux и запоминаем гео-снэпшот
			reset(savedSettings)
			wasSubmittedRef.current = false
		} else {
			// Меню закрылось — если не было submit, откатываем всё
			if (!wasSubmittedRef.current) {
				reset(savedSettings)
			}
		}
	}, [sideMenuSettingsOpened])

	const onSubmit: SubmitHandler<TypeSchemaMainSettingsForm> = useCallback(
		data => {
			wasSubmittedRef.current = true
			// dispatch(updateMainSettings(data))
			// const serverDataSettings = transformSettingsForServer(data)
			// const message: WebSocketMessage = { id: 100, data: serverDataSettings }
			// dispatch(sendMessage(message))
			// console.log('Filters sent:', message)
			console.log('Filters sent: TEST HERE!')
			dispatch(closeSideMenuSettings())
		},
		[dispatch],
	)

	const onError: SubmitErrorHandler<TypeSchemaMainSettingsForm> = data =>
		console.log('error:', data)

	// Функция сброса всех фильтров
	const resetFilters = useCallback(() => {
		reset(mainSettingsDefaultValues)
		wasSubmittedRef.current = true
		onSubmit(mainSettingsDefaultValues)
	}, [reset, onSubmit])

	/** Отмена — откатываем форму и закрываем меню */
	const handleCancel = useCallback(() => {
		reset(savedSettings)
		dispatch(closeSideMenuSettings())
	}, [reset, savedSettings, dispatch])

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
			<FormProvider {...methods}>
				<form className={styles.formFilters} onSubmit={methods.handleSubmit(onSubmit, onError)}>
					<FieldAccordion nameField="Выбор полос приема" id="Change_bands">
						<div>
							<p> 'Чек-бокс' 1-2 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ</p>
							<p>
								{' '}
								'Чек-бокс' 2-2.5 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
							<p>
								{' '}
								'Чек-бокс' 2.5-3 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
							<p>
								{' '}
								'Чек-бокс' 3-3.5 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
							<p>
								{' '}
								'Чек-бокс' 3.5-4 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
							<p> 'Чек-бокс' 4-5 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ</p>
							<p> 'Чек-бокс' 5-6 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ</p>
							<p> 'Чек-бокс' 6-7 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ</p>
							<p> 'Чек-бокс' 7-8 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ</p>
							<p> 'Чек-бокс' 8-9 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ</p>
							<p>
								{' '}
								'Чек-бокс' 9-10 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
							<p>
								{' '}
								'Чек-бокс' 10-11 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
							<p>
								{' '}
								'Чек-бокс' 11-12 ГГц, время 'инпут номер' сек, ослабление 'селект 0-10-20-30' дБ
							</p>
						</div>
					</FieldAccordion>

					<FieldAccordion nameField="Включение тестового сигнала" id="Signal_test">
						<div>
							{' '}
							<p>'тогглер включения/отключения' 'инпут номер' ГГц</p>
						</div>
						<div>
							{' '}
							<p>
								* Тестовый (непрерывный гармонический) сигнал используется для экспресс проверки
								работоспособности фидерных трактов изделия. При этом изделие переходит из режима
								записи импульсов в режим непрерывной регистрации.
							</p>
						</div>
					</FieldAccordion>

					<FieldAccordion nameField="Импорт сигнатур" id="Signature_import">
						<div>
							<p>'поле нименования файла' Выбрать</p>
						</div>
						<div>кнопка импортировать</div>
					</FieldAccordion>

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
		</LocalizationProvider>
	)
}
