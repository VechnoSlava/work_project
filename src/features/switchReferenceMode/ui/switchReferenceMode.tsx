import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { ToggleSwitch } from '../../../entities/toggleSwitch'
import { RoutePath, ROUTES_PATH } from '../../../shared/constants/routes'
import {
	selectModeReference,
	toggleReferenceMode,
} from '../../../widgets/header/model/controlModesSlice'
import { selectPage } from '../../pagesNavigation/model/pagesNavigationSlice'

export const SwitchReferenceMode = () => {
	const dispatch = useAppDispatch()
	const isReferenceMode = useAppSelector(selectModeReference)
	const currentMainPage = useAppSelector(selectPage)

	const handleReferenceMode = () => {
		dispatch(toggleReferenceMode())
	}

	const handleDisabledReferenceMode = (currentMainPage: RoutePath) => {
		return currentMainPage === ROUTES_PATH.MAIN ? true : false
	}
	return (
		<ToggleSwitch
			nameSwitch="Режим эталонов"
			checked={isReferenceMode}
			onChange={handleReferenceMode}
			disabled={handleDisabledReferenceMode(currentMainPage)}
			inputProps={{ 'aria-label': 'Режим эталонов' }}
		/>
	)
}
