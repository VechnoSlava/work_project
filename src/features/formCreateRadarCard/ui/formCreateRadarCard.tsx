import { useCallback } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Stack } from '@mui/material'
import { AiOutlineFileDone } from 'react-icons/ai'
import { MdOutlineCancel } from 'react-icons/md'
import { RHFTextField } from '@/entities/RHFTextField'
import { ButtonFormAction } from '@/shared/buttons'
import { useAppDispatch } from '@/app/store/hooks'
import { sendMessage } from '@/shared/webSocket/serverConnectionSlice'
import type { IRadarsList, WebSocketMessage } from '@/shared/webSocket/IWebSocket'
import { schemaCreateRadarCardForm, TypeSchemaCreateRadarCardForm } from '../model/schema'
import { ModalWindowForm } from '@/entities/modalWindowForm'

const disabledFieldSx = {
	'& .MuiInputBase-input.Mui-disabled': {
		WebkitTextFillColor: '#c8d6df',
	},
}

interface FormCreateRadarCardProps {
	open: boolean
	radar: IRadarsList | null
	onClose: () => void
}

export const FormCreateRadarCardForm = ({ open, radar, onClose }: FormCreateRadarCardProps) => {
	const dispatch = useAppDispatch()

	const methods = useForm<TypeSchemaCreateRadarCardForm>({
		resolver: zodResolver(schemaCreateRadarCardForm),
		mode: 'all',
		values: radar
			? {
					id: radar.id,
					uid: radar.uid,
					pulse_length: radar.pulse_length,
					rot_period: radar.rot_period,
					freq: radar.freq,
					PRI: radar.PRI,
					comment: radar.comment ?? '',
				}
			: undefined,
	})

	const onSubmit: SubmitHandler<TypeSchemaCreateRadarCardForm> = useCallback(
		data => {
			const message: WebSocketMessage = { id: 130, data }
			dispatch(sendMessage(message))
			console.log('Radar saved to DB:', message)
			onClose()
		},
		[dispatch, onClose],
	)

	if (!radar) return null

	return (
		<FormProvider {...methods}>
			<ModalWindowForm
				open={open}
				onClose={onClose}
				title="Сохранить в базу данных"
				actions={
					<Stack direction="row" spacing={2}>
						<ButtonFormAction
							startIcon={<AiOutlineFileDone />}
							onClick={methods.handleSubmit(onSubmit)}
						>
							Сохранить
						</ButtonFormAction>
						<ButtonFormAction startIcon={<MdOutlineCancel />} onClick={onClose}>
							Отмена
						</ButtonFormAction>
					</Stack>
				}
			>
				<Stack direction="row" spacing={2}>
					<RHFTextField<TypeSchemaCreateRadarCardForm>
						name="id"
						label="ID"
						id="radar-id"
						sx={disabledFieldSx}
						disabled
					/>
					<RHFTextField<TypeSchemaCreateRadarCardForm>
						name="uid"
						label="UID"
						id="radar-uid"
						sx={disabledFieldSx}
						disabled
					/>
				</Stack>

				<Stack direction="row" spacing={2}>
					<RHFTextField<TypeSchemaCreateRadarCardForm>
						name="freq"
						label="Частота, МГц"
						id="radar-freq"
						sx={disabledFieldSx}
						disabled
					/>
					<RHFTextField<TypeSchemaCreateRadarCardForm>
						name="PRI"
						label="ПСИ, мкс"
						id="radar-pri"
						sx={disabledFieldSx}
						disabled
					/>
				</Stack>

				<Stack direction="row" spacing={2}>
					<RHFTextField<TypeSchemaCreateRadarCardForm>
						name="pulse_length"
						label="Длительность импульса, нс"
						id="radar-pulse"
						sx={disabledFieldSx}
						disabled
					/>
					<RHFTextField<TypeSchemaCreateRadarCardForm>
						name="rot_period"
						label="Период вращения, с"
						id="radar-rot"
						sx={disabledFieldSx}
						disabled
					/>
				</Stack>

				<RHFTextField<TypeSchemaCreateRadarCardForm>
					name="comment"
					label="Комментарий"
					id="radar-comment"
					placeholder="Введите комментарий..."
				/>
			</ModalWindowForm>
		</FormProvider>
	)
}
