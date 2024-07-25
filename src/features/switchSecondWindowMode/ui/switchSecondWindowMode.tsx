import { useRef, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { ToggleSwitch } from '../../../entities/toggleSwitch'
import {
	selectModeSecondWindow,
	toggleSecondaryWindow,
} from '../../../widgets/header/model/controlModesSlice'
import { selectSlavePage } from '../../pagesNavigation/model/pagesNavigationSlice'

export const SwitchSecondWindowMode = () => {
	const dispatch = useAppDispatch()
	const isSecondaryWindowOpen = useAppSelector(selectModeSecondWindow)
	const currentSlavePage = useAppSelector(selectSlavePage)
	const newWindowRef = useRef<Window | null>(null)

	const handleToggleWindow = () => {
		dispatch(toggleSecondaryWindow())
	}

	// второе окно
	useEffect(() => {
		const handleUnload = () => {
			dispatch(toggleSecondaryWindow())
		}
		const attachHandlerUnload = (currentWin: Window) => {
			currentWin.removeEventListener('unload', handleUnload)
			currentWin.addEventListener('unload', handleUnload)
		}

		if (isSecondaryWindowOpen) {
			if (!newWindowRef.current || newWindowRef.current.closed) {
				newWindowRef.current = window.open(
					currentSlavePage,
					'slaveWindow',
					'width=800,height=600,menubar=0,toolbar=0',
				)
				const interval = setInterval(() => {
					if (newWindowRef.current && newWindowRef.current.document.readyState === 'complete') {
						attachHandlerUnload(newWindowRef.current)
						clearInterval(interval)
					}
				}, 100)
			} else {
				newWindowRef.current.location.replace(currentSlavePage)
				const interval = setInterval(() => {
					if (newWindowRef.current && newWindowRef.current.document.readyState === 'complete') {
						attachHandlerUnload(newWindowRef.current)
						clearInterval(interval)
					}
				}, 100)
			}
		} else if (newWindowRef.current) {
			newWindowRef.current.close()
			newWindowRef.current = null
		}
		return () => {
			if (newWindowRef.current) {
				newWindowRef.current.removeEventListener('unload', handleUnload)
			}
		}
	}, [isSecondaryWindowOpen, currentSlavePage, dispatch])

	return (
		<ToggleSwitch
			nameSwitch="2-х оконный режим"
			checked={isSecondaryWindowOpen}
			onChange={handleToggleWindow}
			inputProps={{ 'aria-label': '2-х оконный режим' }}
		/>
	)
}
