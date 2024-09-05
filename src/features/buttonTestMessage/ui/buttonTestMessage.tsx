import { useAppDispatch } from '../../../app/store/hooks'
import { ButtonMenuHead } from '../../../shared/buttons'
import styles from './buttonTestMessage.module.css'
import { sendMessage } from '../../../shared/webSocket/serverConnectionSlice'
import { TbMessage } from 'react-icons/tb'
import { ISelectedPulse } from '../../../shared/webSocket/IWebSocket'

export const ButtonTestMessage = () => {
	const dispatch = useAppDispatch()

	const message: ISelectedPulse = {
		id: 2,
		radar: '55eea2dd-5172-4b75-6cf8-2c7c7c869ebb',
	}

	const handleTestMessage = () => {
		console.log('Message sent:', message)
		dispatch(sendMessage(message))
	}

	return (
		<>
			<div className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					// selected={sideMenuFiltersOpened}
					title="Тестовое сообщение"
					onClick={handleTestMessage}
				>
					<TbMessage size="100%" />
				</ButtonMenuHead>
			</div>
		</>
	)
}
