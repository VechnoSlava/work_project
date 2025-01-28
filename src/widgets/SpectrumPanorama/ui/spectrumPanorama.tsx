import { useEffect } from 'react'
import styles from './spectrumPanorama.module.css'
import { spectrumPanoramaChart } from './spectrumPanoramaChart'

export function SpectrumPanorama() {
	// useEffect(() => {
	// 	return () => spectrumPanoramaChart.deletePanoramaChart()
	// }, [])

	useEffect(() => {
		const container = document.getElementById('spectrumPanorama') as HTMLDivElement | null
		if (container) {
			spectrumPanoramaChart.createPanoramaChart(
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
