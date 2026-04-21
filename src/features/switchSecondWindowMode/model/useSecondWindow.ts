import { useCallback, useEffect, useRef } from 'react'
import {
	selectModeSecondWindow,
	toggleSecondaryWindow,
} from '@/widgets/header/model/controlModesSlice'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectSlavePage } from '@/features/pagesNavigation/model/pagesNavigationSlice'

export const useSecondWindow = () => {
	const dispatch = useAppDispatch()
	const isSecondaryWindowOpen = useAppSelector(selectModeSecondWindow)
	const currentSlavePage = useAppSelector(selectSlavePage)
	const newWindowRef = useRef<Window | null>(null)

	/**
	 * Флаг подавления unload-события.
	 * true — когда окно закрывается программно (toggle off)
	 *        или когда происходит навигация через location.replace
	 */
	const suppressUnloadRef = useRef(false)

	/**
	 * Обработчик закрытия slave-окна пользователем (крестик / Alt+F4).
	 * Стабильный ref-callback — не зависит от dispatch (dispatch стабилен в Redux,
	 * но используем ref чтобы избежать пересоздания и каскада зависимостей).
	 */
	const handleUnloadRef = useRef(() => {
		if (suppressUnloadRef.current) return
		dispatch(toggleSecondaryWindow())
	})
	// Обновляем ref при каждом рендере (dispatch стабилен, но на всякий случай)
	handleUnloadRef.current = () => {
		if (suppressUnloadRef.current) return
		dispatch(toggleSecondaryWindow())
	}

	const stableHandleUnload = useCallback(() => {
		handleUnloadRef.current()
	}, [])

	/** Ждёт полной загрузки окна и вешает обработчик unload */
	const waitAndAttachUnload = useCallback(
		(win: Window) => {
			const interval = setInterval(() => {
				try {
					if (win.closed) {
						clearInterval(interval)
						return
					}
					if (win.document.readyState === 'complete') {
						clearInterval(interval)
						suppressUnloadRef.current = false
						win.removeEventListener('unload', stableHandleUnload)
						win.addEventListener('unload', stableHandleUnload)
					}
				} catch {
					// cross-origin — окно ещё не загрузилось, ждём
				}
			}, 100)
			return interval
		},
		[stableHandleUnload],
	)

	// Управление жизненным циклом slave-окна
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined

		if (isSecondaryWindowOpen) {
			suppressUnloadRef.current = false

			if (!newWindowRef.current || newWindowRef.current.closed) {
				// Открываем новое окно
				newWindowRef.current = window.open(
					currentSlavePage,
					'slaveWindow',
					'width=800,height=600,menubar=0,toolbar=0',
				)
			} else {
				// Окно уже открыто — навигация на другую slave-страницу.
				// location.replace вызывает unload → подавляем его,
				// иначе сработает toggleSecondaryWindow и окно закроется.
				suppressUnloadRef.current = true
				newWindowRef.current.location.replace(currentSlavePage)
			}

			if (newWindowRef.current) {
				interval = waitAndAttachUnload(newWindowRef.current)
			}
		} else if (newWindowRef.current) {
			// Программное закрытие — подавляем unload
			suppressUnloadRef.current = true
			newWindowRef.current.close()
			newWindowRef.current = null
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isSecondaryWindowOpen, currentSlavePage, waitAndAttachUnload])

	// Cleanup при размонтировании хука (смена страницы главного окна и т.д.)
	useEffect(() => {
		return () => {
			newWindowRef.current?.removeEventListener('unload', stableHandleUnload)
		}
	}, [stableHandleUnload])

	return {
		isSecondaryWindowOpen,
		toggle: () => dispatch(toggleSecondaryWindow()),
	}
}
