import { useState } from 'react'
import { MdEngineering } from 'react-icons/md'
import { ButtonMenuHead } from '@/shared/buttons'
import { useAppSelector } from '@/app/store/hooks'
import styles from './techModeButton.module.css'
import { selectTechModeActive } from '../model/techModeSlice'
import { TechAuthDialog } from './TechAuthDialog'
import { TechExitConfirmDialog } from './TechExitConfirmDialog'

export const TechModeButton = () => {
	const isActive = useAppSelector(selectTechModeActive)
	const [authOpen, setAuthOpen] = useState(false)
	const [exitConfirmOpen, setExitConfirmOpen] = useState(false)

	const handleClick = () => {
		if (isActive) {
			setExitConfirmOpen(true)
		} else {
			setAuthOpen(true)
		}
	}

	return (
		<>
			<div className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					selected={isActive}
					title="Технологический режим"
					onClick={handleClick}
				>
					<MdEngineering size="100%" />
				</ButtonMenuHead>
			</div>

			<TechAuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
			<TechExitConfirmDialog open={exitConfirmOpen} onClose={() => setExitConfirmOpen(false)} />
		</>
	)
}
