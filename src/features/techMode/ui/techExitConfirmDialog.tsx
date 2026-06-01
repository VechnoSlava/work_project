import { Stack, Typography } from '@mui/material'
import { ModalWindowForm } from '@/entities/modalWindowForm'
import { ButtonFormAction } from '@/shared/buttons'
import { useAppDispatch } from '@/app/store/hooks'
import { disableTechMode } from '../model/techModeSlice'
import { addLog } from '@/widgets/footer'

interface TechExitConfirmDialogProps {
	open: boolean
	onClose: () => void
}

export const TechExitConfirmDialog = ({ open, onClose }: TechExitConfirmDialogProps) => {
	const dispatch = useAppDispatch()

	const handleConfirm = () => {
		dispatch(disableTechMode())
		dispatch(addLog('Выход из технологического режима'))
		onClose()
	}

	return (
		<ModalWindowForm
			open={open}
			onClose={onClose}
			title="Подтверждение"
			actions={
				<Stack direction="row" spacing={2}>
					<ButtonFormAction onClick={handleConfirm}>Да</ButtonFormAction>
					<ButtonFormAction onClick={onClose}>Нет</ButtonFormAction>
				</Stack>
			}
		>
			<Typography sx={{ color: '#c8d6df' }}>Выйти из технологического режима?</Typography>
		</ModalWindowForm>
	)
}
