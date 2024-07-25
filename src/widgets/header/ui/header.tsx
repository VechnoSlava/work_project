import styles from './header.module.css'
import { IconLogo } from '../../../shared/icons'
import { PagesNavigationMenu, PagesNavigationTabs } from '../../../features/pagesNavigation'
import { ButtonConnectToServer } from '../../../features/buttonConnectToServer'
import { ButtonSideMenuFilters } from '../../../features/buttonSideMenuFilters'
import { SwitchSecondWindowMode } from '../../../features/switchSecondWindowMode'
import { SwitchIdentificationMode } from '../../../features/switchIdentificationMode'
import { SwitchReferenceMode } from '../../../features/switchReferenceMode'

export const Header = () => {
	console.log('HEADER')

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
					<ButtonSideMenuFilters />
				</div>
			</div>
		</header>
	)
}
