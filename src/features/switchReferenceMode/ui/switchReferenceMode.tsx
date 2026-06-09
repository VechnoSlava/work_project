import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { ToggleSwitch } from '@/entities/toggleSwitch'
import { ROUTES_PATH, MASTER_TO_SLAVE } from '@/shared/constants/routes'
import { selectModeReference, setReferenceMode } from '@/widgets/header/model/controlModesSlice'
import { setSlavePage } from '@/features/pagesNavigation/model/pagesNavigationSlice'

/** Доступен ли режим эталонов на данном пути (только База данных) */
const isHistoryArea = (pathname: string) =>
	pathname === ROUTES_PATH.HISTORY ||
	pathname === ROUTES_PATH.HISTORYIDENTIFICATION ||
	pathname === ROUTES_PATH.HISTORYREFERENCE

/** Является ли путь режимом эталонов */
const isReferencePath = (pathname: string) => pathname === ROUTES_PATH.HISTORYREFERENCE

export const SwitchReferenceMode = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const isReferenceMode = useAppSelector(selectModeReference)

	// Синхронизируем флаг с реальным URL
	useEffect(() => {
		const fromUrl = isReferencePath(pathname)
		if (fromUrl !== isReferenceMode) {
			dispatch(setReferenceMode(fromUrl))
		}
	}, [pathname, isReferenceMode, dispatch])

	// Кнопка активна только в области Базы данных
	const isDisabled = !isHistoryArea(pathname)

	const handleReferenceMode = () => {
		if (isDisabled) return
		const target = isReferenceMode ? ROUTES_PATH.HISTORY : ROUTES_PATH.HISTORYREFERENCE
		navigate(target)
		dispatch(setSlavePage(MASTER_TO_SLAVE[target]))
	}

	return (
		<ToggleSwitch
			nameSwitch="Режим эталонов"
			checked={isReferenceMode}
			onChange={handleReferenceMode}
			disabled={isDisabled}
			slotProps={{ input: { 'aria-label': 'Режим эталонов' } }}
		/>
	)
}
