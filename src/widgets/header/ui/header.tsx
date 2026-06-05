import styles from './header.module.css'
import { useLocation } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'
import { IconLogo } from '@/shared/icons'
import { PagesNavigationMenu, PagesNavigationTabs } from '@/features/pagesNavigation'
import { ButtonConnectToServer } from '@/features/buttonConnectToServer'
import { ButtonSideMenuFilters } from '@/features/buttonSideMenuFilters'
import { SwitchSecondWindowMode } from '@/features/switchSecondWindowMode'
import { SwitchIdentificationMode } from '@/features/switchIdentificationMode'
import { SwitchReferenceMode } from '@/features/switchReferenceMode'
import { ButtonTestMessage } from '@/features/buttonTestMessage'
import { ButtonWorkSettings } from '@/features/buttonWorkSettings'
import { TechModeButton, TechCommandsButton } from '@/features/techMode'
import { RecordSignalButton } from '@/features/recordSignalButton'
import { ROUTES_PATH } from '@/shared/constants/routes'
import { ControlsMenu } from '../components/controlsMenu/controlsMenu'

export const Header = () => {
	const { pathname } = useLocation()
	const isHistoryPage = pathname === ROUTES_PATH.HISTORY
	const isMainPage = pathname === ROUTES_PATH.MAIN

	// Узкий экран — кнопки управления сворачиваются в выпадающее меню
	const isNarrow = useMediaQuery('(max-width:1220px)')

	// Набор кнопок управления (порядок сохраняется в обоих режимах)
	const controlButtons = (
		<>
			<ButtonConnectToServer />
			{!isHistoryPage && <ButtonWorkSettings />}
			{!isHistoryPage && <TechCommandsButton />}
			{!isMainPage && <ButtonSideMenuFilters />}
			<ButtonTestMessage />
		</>
	)

	return (
		<header className={styles.header}>
			<div className={styles.header__container}>
				{/* 1. Логотип */}
				<div className={styles.header__icon}>
					<IconLogo />
				</div>

				{/* 2. Меню навигации */}
				<div className={styles.header__navigation}>
					<PagesNavigationTabs />
					<PagesNavigationMenu />
				</div>

				{/* 3. Блок режимов */}
				<div className={styles.header__controls}>
					<div className={styles.controls__column}>
						<SwitchSecondWindowMode />
						<SwitchIdentificationMode />
					</div>
					<div className={`${styles.controls__column} ${styles.controls__column_reference}`}>
						<SwitchReferenceMode />
						{!isHistoryPage && <RecordSignalButton />}
					</div>
				</div>

				{/* 4. Блок кнопок управления — слева, следом за режимами */}
				{isNarrow ? (
					<ControlsMenu>{controlButtons}</ControlsMenu>
				) : (
					<div className={styles.header__buttons}>{controlButtons}</div>
				)}

				{/* 5. Тех. режим — отдельно в правом краю */}
				{!isHistoryPage && (
					<div className={styles.header__techMode}>
						<TechModeButton />
					</div>
				)}
			</div>
		</header>
	)
}
