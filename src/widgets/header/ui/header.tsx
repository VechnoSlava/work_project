import styles from './header.module.css'
import { IconLogo } from '@/shared/icons'
import { PagesNavigationMenu, PagesNavigationTabs } from '@/features/pagesNavigation'
import { ButtonConnectToServer } from '@/features/buttonConnectToServer'
import { ButtonSideMenuFilters } from '@/features/buttonSideMenuFilters'
import { SwitchSecondWindowMode } from '@/features/switchSecondWindowMode'
import { SwitchIdentificationMode } from '@/features/switchIdentificationMode'
import { SwitchReferenceMode } from '@/features/switchReferenceMode'
import { ButtonTestMessage } from '@/features/buttonTestMessage'
import { ButtonWorkSettings } from '@/features/buttonWorkSettings'
import { TechModeButton, TechCommandsButton, selectTechModeActive } from '@/features/techMode'

export const Header = () => {
	console.log('RENDER_HEADER')

	return (
		<header className={styles.header}>
			<div className={styles.header__container}>
				<div className={styles.header__icon}>
					<IconLogo />
				</div>
				<div className={styles.header__navigation}>
					<PagesNavigationTabs />
					<PagesNavigationMenu />
				</div>
				<div className={styles.header__controls}>
					<div className={styles.controls__column}>
						<SwitchSecondWindowMode />
						<SwitchIdentificationMode />
					</div>
					<div className={styles.controls__column}>
						<SwitchReferenceMode />
					</div>
				</div>
				<div className={styles.header__buttons}>
					<ButtonConnectToServer />
					<ButtonWorkSettings />
					<ButtonSideMenuFilters />
					<ButtonTestMessage />
					<TechCommandsButton />
					<TechModeButton />
				</div>
			</div>
		</header>
	)
}
