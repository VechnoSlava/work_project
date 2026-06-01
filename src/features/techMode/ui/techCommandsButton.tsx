import { useRef, useState } from 'react'
import { MdMiscellaneousServices } from 'react-icons/md'
import { Popover, Stack } from '@mui/material'
import { ButtonMenuHead, ButtonFormAction } from '@/shared/buttons'
import { useAppDispatch } from '@/app/store/hooks'
import { sendMessage } from '@/shared/webSocket/serverConnectionSlice'
import { addLog } from '@/widgets/footer'
import type { WebSocketMessage } from '@/shared/webSocket/IWebSocket'
import styles from './techCommandsButton.module.css'

const COMMANDS: { id: number; label: string; logMessage: string }[] = [
	{ id: 151, label: 'Сохранить в базу данных', logMessage: 'Команда: Сохранить в базу данных' },
	{ id: 152, label: 'Сброс треков', logMessage: 'Команда: Сброс треков' },
	{ id: 111, label: 'Экспорт JSON', logMessage: 'Команда: Экспорт JSON' },
	{ id: 113, label: 'Экспорт сигнатуры', logMessage: 'Команда: Экспорт сигнатуры' },
	{ id: 114, label: 'Импорт сигнатуры', logMessage: 'Команда: Импорт сигнатуры' },
]

export const TechCommandsButton = () => {
	const [open, setOpen] = useState(false)
	const buttonRef = useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()

	const handleToggle = () => setOpen(prev => !prev)
	const handleClose = () => setOpen(false)

	const handleCommand = (cmd: (typeof COMMANDS)[number]) => {
		const message: WebSocketMessage = { id: cmd.id, data: {} }
		dispatch(sendMessage(message))
		dispatch(addLog(cmd.logMessage))
		handleClose()
	}

	return (
		<>
			<div ref={buttonRef} className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					selected={open}
					title="Технологические команды"
					onClick={handleToggle}
					// disabled={true}
				>
					<MdMiscellaneousServices size="100%" />
				</ButtonMenuHead>
			</div>

			<Popover
				open={open}
				anchorEl={buttonRef.current}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
				slotProps={{
					paper: {
						sx: {
							backgroundColor: '#0e3753',
							backgroundImage: 'none',
							border: '1px solid rgba(255, 255, 255, 0.12)',
							marginTop: '4px',
						},
					},
				}}
			>
				<Stack direction="column" spacing={1} sx={{ padding: '12px', minWidth: 220 }}>
					{COMMANDS.map(cmd => (
						<ButtonFormAction
							key={cmd.id}
							onClick={() => handleCommand(cmd)}
							sx={{ justifyContent: 'flex-start' }}
						>
							{cmd.label}
						</ButtonFormAction>
					))}
				</Stack>
			</Popover>
		</>
	)
}
