import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { selectSideMenuOpened, toggleSideMenu } from '../model/sideMenuSlice'
import { FormFiltersMain } from '../../../features/formFiltersMain'
import { FormFiltersHistory } from '../../../features/formFiltersHistory'

export const SideMenuFilters = () => {
	console.log('render Side menu')

	const dispatch = useAppDispatch()
	const sideMenuOpened = useAppSelector(selectSideMenuOpened)
	const handlerToggleSideMenu = () => {
		dispatch(toggleSideMenu())
	}

	const DrawerList = (
		<Box sx={{ width: 500, height: '100vh', backgroundColor: '#0e3753' }} role="presentation">
			<FormFiltersMain />
			{/* <FormFiltersHistory /> */}
		</Box>
	)
	return (
		<div>
			<Drawer sx={{}} anchor={'right'} open={sideMenuOpened} onClose={handlerToggleSideMenu}>
				{DrawerList}
			</Drawer>
		</div>
	)
}
