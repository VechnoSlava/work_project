import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { closeSideMenuSettings, selectSideMenuSettingsOpened } from '../model/sideMenuSettingsSlice'
import { FormSettingsMain } from '@/features/formSettingsMain'

export const SideMenuSettings = () => {
	console.log('render_sideMenuSettings')
	const dispatch = useAppDispatch()
	const sideMenuSettingsOpened = useAppSelector(selectSideMenuSettingsOpened)

	return (
		<Drawer
			anchor="left"
			open={sideMenuSettingsOpened}
			onClose={() => dispatch(closeSideMenuSettings())}
			variant="persistent"
			slotProps={{
				paper: { sx: { backgroundColor: '#0e3753' } },
			}}
		>
			<Box sx={{ width: 500, minHeight: '100vh' }} role="presentation">
				<FormSettingsMain />
			</Box>
		</Drawer>
	)
}
