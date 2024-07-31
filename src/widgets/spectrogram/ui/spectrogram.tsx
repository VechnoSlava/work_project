import { useEffect } from 'react'
import styles from './spectrogram.module.css'
import { createSpectrum } from './spectrum'

export function Spectrogram() {
	useEffect(() => {
		const container = document.getElementById('plot_spectrogram') as HTMLDivElement | null
		if (container) {
			createSpectrum(container)
		} else {
			console.error('Container not found')
		}
	}, [])

	return (
		<>
			<div className={styles.plot} id={'plot_spectrogram'}></div>
		</>
	)
}
