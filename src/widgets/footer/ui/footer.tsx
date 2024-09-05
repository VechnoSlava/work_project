import type { FC } from 'react'
import styles from './footer.module.css'

export const Footer: FC = () => {
	return (
		<footer className={styles.container}>
			<p>Данные сети</p>
		</footer>
	)
}
