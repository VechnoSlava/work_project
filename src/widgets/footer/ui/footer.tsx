import { useEffect, useRef, useState } from 'react'
import { IoChevronUp } from 'react-icons/io5'
import styles from './footer.module.css'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectLogs, selectLastLog, clearLogs } from '../model/footerSlice'
import { SystemClock } from '../components/systemClock'

export const Footer = () => {
	console.log('Render FOOTER')

	const [panelOpen, setPanelOpen] = useState(false)
	const logListRef = useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()
	const logs = useAppSelector(selectLogs)
	const lastLog = useAppSelector(selectLastLog)

	// Автопрокрутка к последнему логу при открытой панели
	useEffect(() => {
		if (panelOpen && logListRef.current) {
			logListRef.current.scrollTop = logListRef.current.scrollHeight
		}
	}, [logs, panelOpen])

	return (
		<div className={styles.wrapper}>
			{/* Панель логов — выезжает поверх основного контента */}
			{panelOpen && (
				<div className={styles.panel}>
					<div className={styles.panelHeader}>
						<span>Журнал событий ({logs.length})</span>
						<button className={styles.panelClearBtn} onClick={() => dispatch(clearLogs())}>
							Очистить
						</button>
					</div>
					<div className={styles.logList} ref={logListRef}>
						{logs.length === 0 && (
							<div className={styles.logEntry}>
								<span className={styles.logMessage}>Нет записей</span>
							</div>
						)}
						{logs.map(log => (
							<div key={log.id} className={styles.logEntry}>
								<span className={styles.logTime}>{log.time}</span>
								<span className={styles.logMessage}>{log.message}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Строка-бар — всегда видна */}
			<div className={styles.bar}>
				<button
					className={`${styles.toggleBtn} ${panelOpen ? styles.toggleBtnOpen : ''}`}
					onClick={() => setPanelOpen(prev => !prev)}
					title={panelOpen ? 'Свернуть журнал' : 'Развернуть журнал'}
				>
					<IoChevronUp />
				</button>

				<div className={styles.lastLog}>
					{lastLog ? (
						<>
							<span className={styles.lastLogTime}>{lastLog.time}</span>
							{lastLog.message}
						</>
					) : (
						'Нет событий'
					)}
				</div>

				<SystemClock />
			</div>
		</div>
	)
}
