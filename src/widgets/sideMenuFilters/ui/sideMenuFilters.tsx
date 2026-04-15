import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectSideMenuOpened, toggleSideMenu } from '../model/sideMenuSlice'
import { FormFiltersMain } from '@/features/formFiltersMain'
import { FormFiltersHistory } from '@/features/formFiltersHistory'

export const SideMenuFilters = () => {
	console.log('render_sideMenuFilters')

	const dispatch = useAppDispatch()
	const sideMenuOpened = useAppSelector(selectSideMenuOpened)

	return (
		<Drawer
			anchor="right"
			open={sideMenuOpened}
			onClose={() => dispatch(toggleSideMenu())}
			variant="persistent"
		>
			<Box sx={{ width: 500, height: '100vh', backgroundColor: '#0e3753' }} role="presentation">
				<FormFiltersMain />
			</Box>
		</Drawer>
	)
}
