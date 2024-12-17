import { useEffect } from 'react'
import styles from './spectrumPanorama.module.css'
import { createSpectrumPanoramaChart } from './spectrumPanoramaChart'
import { spectrumPanoramaChart1 } from './spectrumPanoramaChart1'

export function SpectrumPanorama() {
	useEffect(() => {
		const container = document.getElementById('spectrumPanorama') as HTMLDivElement | null
		if (container) {
			// createSpectrumPanoramaChart(
			// 	'spectrumPanorama_spectrum',
			// 	'spectrumPanorama_band',
			// 	'spectrumPanorama_heatmap',
			// )
			spectrumPanoramaChart1.createPanoramaChart('spectrumPanorama_spectrum')
		} else {
			console.error('Container not found')
		}
	}, [])

	return (
		<div className={styles.spectrumPanorama} id={'spectrumPanorama'}>
			<div className={styles.spectrumPanorama__spectrum} id={'spectrumPanorama_spectrum'} />
			<div className={styles.spectrumPanorama__band} id={'spectrumPanorama_band'} />
			<div className={styles.spectrumPanorama__heatmap} id={'spectrumPanorama_heatmap'} />
		</div>
	)
}
