import styles from './recordSignalButton.module.css'
import { useEffect, useRef, useState } from 'react'
import { IoPlay, IoStop } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectTechModeActive } from '@/features/techMode'
import { sendMessage } from '@/shared/webSocket/serverConnectionSlice'
import { addLog } from '@/widgets/footer'
import type { WebSocketMessage } from '@/shared/webSocket/IWebSocket'

export const RecordSignalButton = () => {
	const dispatch = useAppDispatch()
	const techModeActive = useAppSelector(selectTechModeActive)
	const [recording, setRecording] = useState(false)

	const handleClick = () => {
		const message: WebSocketMessage = { id: 150, data: {} }
		dispatch(sendMessage(message))

		if (recording) {
			dispatch(addLog('Запись сигнала остановлена'))
			setRecording(false)
		} else {
			dispatch(addLog('Начата запись сигнала'))
			setRecording(true)
		}
	}

	// Если вышли из техрежима во время записи — сбрасываем состояние
	useEffect(() => {
		if (!techModeActive && recording) {
			setRecording(false)
		}
	}, [techModeActive, recording])

	return (
		<button
			className={`${styles.button} ${recording ? styles.recording : ''}`}
			onClick={handleClick}
			disabled={!techModeActive}
			title={recording ? 'Остановить запись' : 'Записать сигнал'}
		>
			<span className={styles.label}>{recording ? 'Остановить запись' : 'Записать сигнал'}</span>
			<span className={styles.iconBox}>
				{recording ? (
					<>
						<RecordTimer />
						<IoStop className={styles.icon} />
					</>
				) : (
					<IoPlay className={styles.icon} />
				)}
			</span>
		</button>
	)
}

/**
 * Таймер записи — изолирован, чтобы тик не ререндерил родителя.
 * Обновляет textContent через ref каждую секунду.
 */
const RecordTimer = () => {
	const spanRef = useRef<HTMLSpanElement>(null)
	const startRef = useRef<number>(Date.now())

	useEffect(() => {
		startRef.current = Date.now()
		const update = () => {
			if (!spanRef.current) return
			const elapsed = Math.floor((Date.now() - startRef.current) / 1000)
			const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
			const ss = String(elapsed % 60).padStart(2, '0')
			spanRef.current.textContent = `${mm}:${ss}`
		}
		update()
		const timer = setInterval(update, 1000)
		return () => clearInterval(timer)
	}, [])

	return <span ref={spanRef} className={styles.timer} />
}
