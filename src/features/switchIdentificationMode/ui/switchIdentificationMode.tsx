import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { ToggleSwitch } from '@/entities/toggleSwitch'
import {
	selectModeIdentification,
	setIdentificationMode,
} from '@/widgets/header/model/controlModesSlice'
import { setSlavePage } from '@/features/pagesNavigation/model/pagesNavigationSlice'
import { ROUTES_PATH, MASTER_TO_SLAVE, type RoutePath } from '@/shared/constants/routes'

/**
 * Карта переходов: куда вести при включении/выключении режима
 * идентификации в зависимости от текущей базовой страницы.
 */
const TOGGLE_MAP: Record<string, { on: RoutePath; off: RoutePath }> = {
	[ROUTES_PATH.MAIN]: { on: ROUTES_PATH.IDENTIFICATION, off: ROUTES_PATH.MAIN },
	[ROUTES_PATH.IDENTIFICATION]: { on: ROUTES_PATH.IDENTIFICATION, off: ROUTES_PATH.MAIN },
	[ROUTES_PATH.HISTORY]: { on: ROUTES_PATH.HISTORYIDENTIFICATION, off: ROUTES_PATH.HISTORY },
	[ROUTES_PATH.HISTORYIDENTIFICATION]: {
		on: ROUTES_PATH.HISTORYIDENTIFICATION,
		off: ROUTES_PATH.HISTORY,
	},
}

/** Является ли путь идентификационным */
const isIdentificationPath = (pathname: string) =>
	pathname === ROUTES_PATH.IDENTIFICATION || pathname === ROUTES_PATH.HISTORYIDENTIFICATION

export const SwitchIdentificationMode = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const isIdentificationMode = useAppSelector(selectModeIdentification)

	// Синхронизируем флаг в Redux с реальным URL
	// (на случай навигации между страницами в обход свитча)
	useEffect(() => {
		const fromUrl = isIdentificationPath(pathname)
		if (fromUrl !== isIdentificationMode) {
			dispatch(setIdentificationMode(fromUrl))
		}
	}, [pathname, isIdentificationMode, dispatch])

	const handleIdentificationMode = () => {
		const route = TOGGLE_MAP[pathname]
		if (!route) return

		const target = isIdentificationMode ? route.off : route.on
		navigate(target)
		// Обновляем slave-путь, чтобы открытое второе окно
		// переключилось в тот же режим
		dispatch(setSlavePage(MASTER_TO_SLAVE[target]))
	}

	return (
		<ToggleSwitch
			nameSwitch="Режим идентификации"
			checked={isIdentificationMode}
			onChange={handleIdentificationMode}
			slotProps={{ input: { 'aria-label': 'Режим идентификации' } }}
		/>
	)
}
