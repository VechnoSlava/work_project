import { useEffect } from 'react'
import styles from './spectrogram.module.css'
import { createSpectrum } from './spectrum'

export function Spectrogram() {
	useEffect(() => {
		const container = document.getElementById('plot_spectrogram') as HTMLDivElement | null
		if (container) {
			createSpectrum('spectrum', 'spectrum_band')
		} else {
			console.error('Container not found')
		}
	}, [])

	return (
		<div className={styles.spectrogram} id={'plot_spectrogram'}>
			<div className={styles.spectrogram__spectrum} id={'spectrum'} />
			<div className={styles.spectrogram__spectrum_band} id={'spectrum_band'} />
		</div>
	)
}
