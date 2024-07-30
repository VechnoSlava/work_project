import { Tabs, Tab } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import { type RoutePath, ROUTES_PATH } from '../../../../shared/constants/routes'
import { selectPage, setPage } from '../../model/pagesNavigationSlice'
import styles from './pagesNavigationTabs.module.css'

export const PagesNavigationTabs = () => {
	console.log('TABS')

	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const currentMainPage = useAppSelector(selectPage)

	const handlePageChange = (event: React.SyntheticEvent | null, newPage: RoutePath) => {
		dispatch(setPage(newPage))
		if (event) {
			navigate(newPage)
		}
	}

	return (
		<nav className={styles.navigation__tabs}>
			<Tabs
				value={currentMainPage}
				onChange={handlePageChange}
				aria-label="navigation tabs"
				textColor="inherit"
				TabIndicatorProps={{
					sx: {
						backgroundColor: '#fff',
						height: 3, // Толщина линии подчеркивания
						bottom: 0, // Полоса по нижнему краю блока
					},
				}}
				sx={{
					height: '100%',
					'& .MuiTab-root': {
						height: '100%',
						transition: 'color 0.3s',
						'&:hover': {
							backgroundColor: '#00000052',
						},
					},
					'& .MuiTabs-flexContainer': {
						height: '100%',
					},
				}}
			>
				<Tab
					label="Текущая обстановка"
					value={ROUTES_PATH.MAIN}
					component={NavLink}
					to={ROUTES_PATH.MAIN}
				/>
				<Tab
					label="База данных"
					value={ROUTES_PATH.HISTORY}
					component={NavLink}
					to={ROUTES_PATH.HISTORY}
				/>
			</Tabs>
		</nav>
	)
}
