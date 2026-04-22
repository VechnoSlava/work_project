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
			anchor="right"
			open={sideMenuSettingsOpened}
			onClose={() => dispatch(closeSideMenuSettings())}
			variant="persistent"
		>
			<Box sx={{ width: 500, height: '100vh', backgroundColor: '#0e3753' }} role="presentation">
				<FormSettingsMain />
			</Box>
		</Drawer>
	)
}
