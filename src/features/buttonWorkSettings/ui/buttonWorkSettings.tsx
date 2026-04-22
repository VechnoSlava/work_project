import styles from './buttonWorkSettings.module.css'
import { IoIosSettings } from 'react-icons/io'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { ButtonMenuHead } from '../../../shared/buttons'

export const ButtonWorkSettings = () => {
	const dispatch = useAppDispatch()

	const handleOpenSettings = () => {
		dispatch(() => {})
	}

	return (
		<>
			<div className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					selected={true}
					title="Параметры работы"
					onClick={handleOpenSettings}
				>
					<IoIosSettings size="100%" />
				</ButtonMenuHead>
			</div>
		</>
	)
}
