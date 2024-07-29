import styles from './mainLayout.module.css'

import { Outlet } from 'react-router-dom'
import { Header } from '../../widgets/header'
import { Footer } from '../../widgets/footer'
import { SideMenuFilters } from '../../widgets/sideMenuFilters'

export const MainLayout = () => {
	return (
		<div className={styles.wrapper}>
			<Header />
			<main className={styles.main}>
				<Outlet />
			</main>
			<Footer />
			<SideMenuFilters />
		</div>
	)
}
