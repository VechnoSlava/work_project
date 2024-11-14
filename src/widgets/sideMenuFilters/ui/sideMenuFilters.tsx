import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { selectSideMenuOpened, toggleSideMenu } from '../model/sideMenuSlice'
import { FieldFilters } from '../../../entities/fieldFilters'

export const SideMenuFilters = () => {
	const dispatch = useAppDispatch()
	const sideMenuOpened = useAppSelector(selectSideMenuOpened)
	const handlerToggleSideMenu = () => {
		dispatch(toggleSideMenu())
	}

	const DrawerList = (
		<Box
			sx={{ width: 500, height: '100vh', backgroundColor: '#112d49' }}
			role="presentation"
			// onClick={handlerToggleSideMenu}
		>
			<List>
				<ListItem key={1}>
					<FieldFilters name={'Фильтрация по частоте'} />
				</ListItem>
				<ListItem key={2}>
					<FieldFilters name={'Фильтрация по длительности импульса'} />
				</ListItem>
			</List>
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
