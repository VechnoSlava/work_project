import { useCallback, useEffect, useRef } from 'react'
import {
	selectModeSecondWindow,
	toggleSecondaryWindow,
} from '../../../widgets/header/model/controlModesSlice'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { selectSlavePage } from '../../pagesNavigation/model/pagesNavigationSlice'

export const useSecondWindow = () => {
	const dispatch = useAppDispatch()
	const isSecondaryWindowOpen = useAppSelector(selectModeSecondWindow)
	const currentSlavePage = useAppSelector(selectSlavePage)
	const newWindowRef = useRef<Window | null>(null)

	const handleUnload = useCallback(() => {
		dispatch(toggleSecondaryWindow())
	}, [dispatch])

	const attachHandlerUnload = useCallback(
		(win: Window) => {
			win.removeEventListener('unload', handleUnload)
			win.addEventListener('unload', handleUnload)
		},
		[handleUnload],
	)

	useEffect(() => {
		let interval: ReturnType<typeof setInterval>

		const waitAndAttach = (win: Window) => {
			interval = setInterval(() => {
				if (win.document.readyState === 'complete') {
					attachHandlerUnload(win)
					clearInterval(interval)
				}
			}, 100)
		}

		if (isSecondaryWindowOpen) {
			if (!newWindowRef.current || newWindowRef.current.closed) {
				newWindowRef.current = window.open(
					currentSlavePage,
					'slaveWindow',
					'width=800,height=600,menubar=0,toolbar=0',
				)
			} else {
				newWindowRef.current.location.replace(currentSlavePage)
			}
			if (newWindowRef.current) waitAndAttach(newWindowRef.current)
		} else if (newWindowRef.current) {
			newWindowRef.current.close()
			newWindowRef.current = null
		}

		return () => {
			clearInterval(interval)
			newWindowRef.current?.removeEventListener('unload', handleUnload)
		}
	}, [isSecondaryWindowOpen, currentSlavePage, attachHandlerUnload, handleUnload])

	return {
		isSecondaryWindowOpen,
		toggle: () => dispatch(toggleSecondaryWindow()),
	}
}
