import { useEffect } from 'react'
import styles from './spectrumPanoramaTest.module.css'
import { createSpectrumPanoramaChart } from './spectrumPanoramaChartTest'

export function SpectrumPanoramaTest() {
	useEffect(() => {
		const container = document.getElementById('spectrumPanorama') as HTMLDivElement | null
		if (container) {
			createSpectrumPanoramaChart(
				'spectrumPanorama_spectrum',
				'spectrumPanorama_band',
				'spectrumPanorama_heatmap',
			)
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
