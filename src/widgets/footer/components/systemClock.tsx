import { useEffect, useRef } from 'react'
import styles from './systemClock.module.css'

export const SystemClock = () => {
	const spanRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const update = () => {
			if (spanRef.current) {
				spanRef.current.textContent = new Date().toLocaleTimeString('ru-RU')
			}
		}
		update()
		const timer = setInterval(update, 1000)
		return () => clearInterval(timer)
	}, [])

	return <span ref={spanRef} className={styles.clock} />
}
