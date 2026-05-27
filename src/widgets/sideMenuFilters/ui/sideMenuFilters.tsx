import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectSideMenuOpened, toggleSideMenu } from '../model/sideMenuSlice'
import { FormFiltersMain } from '@/features/formFiltersMain'
import { selectPage } from '@/features/pagesNavigation/model/pagesNavigationSlice'
import { FormFiltersHistory } from '@/features/formFiltersHistory'

export const SideMenuFilters = () => {
	console.log('render_sideMenuFilters')
	const dispatch = useAppDispatch()
	const sideMenuOpened = useAppSelector(selectSideMenuOpened)
	const routePath = useAppSelector(selectPage)
	console.log(`Путь страницы: ${routePath}`)
	return (
		<Drawer
			anchor="right"
			open={sideMenuOpened}
			onClose={() => dispatch(toggleSideMenu())}
			variant="persistent"
			slotProps={{
				paper: { sx: { backgroundColor: '#0e3753' } },
			}}
		>
			<Box sx={{ width: 460, minHeight: '100vh' }} role="presentation">
				{routePath == '/' ? <FormFiltersMain /> : <FormFiltersHistory />}
			</Box>
		</Drawer>
	)
}
