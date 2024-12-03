import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { selectSideMenuOpened, toggleSideMenu } from '../model/sideMenuSlice'
import { FormFiltersSideMenu } from '../../../features/formFiltersSideMenu'

export const SideMenuFilters = () => {
	const dispatch = useAppDispatch()
	const sideMenuOpened = useAppSelector(selectSideMenuOpened)
	const handlerToggleSideMenu = () => {
		dispatch(toggleSideMenu())
	}

	const DrawerList = (
		<Box sx={{ width: 500, height: '100vh', backgroundColor: '#112d49' }} role="presentation">
			<FormFiltersSideMenu />
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
