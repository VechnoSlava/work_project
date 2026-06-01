import { useCallback, useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Stack } from '@mui/material'
import { AiOutlineLogin } from 'react-icons/ai'
import { MdOutlineCancel } from 'react-icons/md'
import { ModalWindowForm } from '@/entities/modalWindowForm'
import { RHFTextField } from '@/entities/RHFTextField'
import { ButtonFormAction } from '@/shared/buttons'
import { useAppDispatch } from '@/app/store/hooks'
import { schemaTechAuthForm, TypeSchemaTechAuthForm } from '../model/authSchema'
import { enableTechMode } from '../model/techModeSlice'
import { addLog } from '@/widgets/footer'
import config from '../../../../config.json'

interface TechAuthDialogProps {
	open: boolean
	onClose: () => void
}

export const TechAuthDialog = ({ open, onClose }: TechAuthDialogProps) => {
	const dispatch = useAppDispatch()
	const [authError, setAuthError] = useState<string | null>(null)

	const methods = useForm<TypeSchemaTechAuthForm>({
		resolver: zodResolver(schemaTechAuthForm),
		mode: 'all',
		defaultValues: { login: '', password: '' },
	})

	// Сброс формы и ошибки при каждом открытии
	useEffect(() => {
		if (open) {
			methods.reset({ login: '', password: '' })
			setAuthError(null)
		}
	}, [open])

	const onSubmit: SubmitHandler<TypeSchemaTechAuthForm> = useCallback(
		data => {
			const expectedLogin = (config as any).login
			const expectedPassword = (config as any).password

			if (data.login === expectedLogin && data.password === expectedPassword) {
				dispatch(enableTechMode())
				dispatch(addLog('Включён технологический режим'))
				onClose()
			} else {
				setAuthError('Неверный логин или пароль')
			}
		},
		[dispatch, onClose],
	)

	return (
		<FormProvider {...methods}>
			<ModalWindowForm
				open={open}
				onClose={onClose}
				title="Вход в технологический режим"
				actions={
					<Stack direction="row" spacing={2}>
						<ButtonFormAction
							startIcon={<AiOutlineLogin />}
							onClick={methods.handleSubmit(onSubmit)}
						>
							Войти
						</ButtonFormAction>
						<ButtonFormAction startIcon={<MdOutlineCancel />} onClick={onClose}>
							Отмена
						</ButtonFormAction>
					</Stack>
				}
			>
				<RHFTextField<TypeSchemaTechAuthForm>
					name="login"
					label="Логин"
					id="tech-login"
					autoComplete="off"
				/>
				<RHFTextField<TypeSchemaTechAuthForm>
					name="password"
					label="Пароль"
					id="tech-password"
					type="password"
					autoComplete="off"
				/>
				{authError && (
					<Alert severity="error" variant="outlined" sx={{ marginTop: '4px' }}>
						{authError}
					</Alert>
				)}
			</ModalWindowForm>
		</FormProvider>
	)
}
