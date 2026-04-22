import styles from './buttonWorkSettings.module.css'
import { IoIosSettings } from 'react-icons/io'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { ButtonMenuHead } from '../../../shared/buttons'
import { selectSideMenuSettingsOpened, toggleSideMenuSettings } from '@/widgets/sideMenuSettings'

export const ButtonWorkSettings = () => {
	const dispatch = useAppDispatch()
	const sideMenuSettingsOpened = useAppSelector(selectSideMenuSettingsOpened)

	const handleOpenSettings = () => {
		dispatch(toggleSideMenuSettings())
	}

	return (
		<>
			<div className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					selected={sideMenuSettingsOpened}
					title="Параметры работы"
					onClick={handleOpenSettings}
				>
					<IoIosSettings size="100%" />
				</ButtonMenuHead>
			</div>
		</>
	)
}
