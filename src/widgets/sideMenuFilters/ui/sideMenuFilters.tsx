import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectSideMenuOpened, toggleSideMenu } from '../model/sideMenuSlice'
import { FormFiltersMain } from '@/features/formFiltersMain'

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
			slotProps={{
				paper: { sx: { backgroundColor: '#0e3753' } },
			}}
		>
			<Box sx={{ width: 500, minHeight: '100vh' }} role="presentation">
				<FormFiltersMain />
			</Box>
		</Drawer>
	)
}
